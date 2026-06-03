package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.config.AuditContext;
import com.jefferson.bookfly_api.enums.*;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final MovimentRepository movimentRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final StockBookRepository stockBookRepository;
    private final StockService stockService;
    private final PenaltyRepository penaltyRepository;

    @Auditable(
            action = "LISTAR_TODAS_MOVIMENTAÇÕES",
            details = "LISTAR TODAS AS MOVIMENTAÇÕES"
    )
    public List<Loan> getAllLoans() {
        return loanRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Loan::getId))
                .toList();
    }

    public List<Loan> getAllLoansActive(){
        return loanRepository.findAllActive();
    }

    @Transactional
    @Auditable(action = "SOLICITAR_EMPRESTIMO",details = "USUARIO {userId} FEZ EMPRESTIMO DE LIVRO ID ({bookId}) ")
    public Loan doLoanBook(Long bookId, Long userId) {
        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Esse livro não existe"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new NotFoundException("Esse livro não existe dentro do estoque"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não existe"));

        Optional<Loan> existLoan = loanRepository.findByUserAndStockBook(user, bookOnStock);

        if (existLoan.isPresent()) {
            Loan loan = existLoan.get();
            if (loan.getRecordStatus().getRecordStatusValue() == RecordStatusValue.DELETED ){
                loan.getRecordStatus().active(user);
                loan.setLoanDate(LocalDateTime.now());
                loan.setReturnDate(LocalDateTime.now().plusDays(7));
                loan.setStatus(StatusLoan.EM_ESPERA);

                bookOnStock.setQtd(bookOnStock.getQtd() - 1);

                stockBookRepository.save(bookOnStock);

                return loanRepository.save(loan);
            }

            Penalty penalty = loan.getPenalty();
            if (penalty != null && !penalty.getPaid()) {
                throw new NotFoundException(
                        "Usuário possui multa pendente para este livro. " +
                                "Valor: R$ " + penalty.getAmount() + ". Quite a multa antes de fazer novo empréstimo."
                );
            }

            throw new NotFoundException("Usuário já possui um empréstimo ativo para este livro");
        }

        if (!bookOnStock.isBookAvailable()) {
            throw new NotFoundException("Não foi possível fazer empréstimo: livro indisponível no estoque");
        }

        bookOnStock.setQtd(bookOnStock.getQtd() - 1);

        String description = "Usuário realizou empréstimo do livro " + book.getTitle();

        Moviment moviment = new Moviment();
        moviment.setUser(user);
        moviment.setQtdMoviment(1);
        moviment.setTypeItem(TypeMoviment.SAIDA);
        moviment.setStockBook(bookOnStock);
        moviment.setDescription(description.toUpperCase());
        moviment.setCreatedTime(LocalDateTime.now());

        LocalDateTime timeNow = LocalDateTime.now();
        LocalDateTime returnDate = timeNow.plusDays(7);

        Loan loan = new Loan();
        loan.setLoanDate(timeNow);
        loan.setReturnDate(returnDate);
        loan.setMoviments(new ArrayList<>());
        loan.getMoviments().add(moviment);
        loan.setUser(user);
        loan.setStatus(StatusLoan.EM_ESPERA);
        loan.setStockBook(bookOnStock);

        stockBookRepository.save(bookOnStock);
        movimentRepository.save(moviment);
        return loanRepository.save(loan);
    }

    @Transactional
    @Auditable(action = "ATIVAR_EMPRESTIMO",details = "USUARIO {userId} ATIVOU EMPRESTIMO ID°{loanId}")
    public Loan activateLoanBook(Long loanId, Long userId) {
        Loan loanExists = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Emprestimo Não Encontrado no Sistema"));
        User userExists = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Não Existe este Usuário no Sistema"));

        if (loanExists.getStatus() == StatusLoan.ATIVO){
            throw new NotFoundException("Este EMprestimo ja esta ativo");
        }


        if (loanExists.getStatus() != StatusLoan.EM_ESPERA) {
            throw new NotFoundException("Este empréstimo não pode ser ativado pois seu status atual é: " + loanExists.getStatus());
        }

        if (!userExists.getRole().equals(Role.ADMIN)) {
            throw new NotFoundException("Apenas administradores podem ativar um empréstimo");
        }

        loanExists.getMoviments().forEach(moviment -> {
            String description = "Confirmação de Empréstimo Realizado por " + userExists.getName();
            moviment.setDescription(description.toUpperCase());
            movimentRepository.save(moviment);
        });

        loanExists.setStatus(StatusLoan.ATIVO);
        return loanRepository.save(loanExists);
    }

    @Transactional
    @Auditable(action = "RETORNAR_EMPRESTIMO_LIVRO", details = " RETORNO DO LIVRO NO EMPRESTIMO {loanId}")
    public Loan returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Empréstimo não encontrado"));

        if (loan.getStatus() == StatusLoan.FINALIZADO) {
            throw new NotFoundException("Este empréstimo já foi finalizado");
        }

        Penalty penalty = loan.getPenalty();
        if (penalty != null && !penalty.getPaid()) {
            throw new NotFoundException(
                    "Não é possível devolver o livro: existe multa pendente. " +
                            "Valor: R$ " + penalty.getAmount()
            );
        }

        StockBook bookOnStock = loan.getStockBook();
        User user = loan.getUser();
        String bookTitle = bookOnStock.getBook().getTitle();

        bookOnStock.setQtd(bookOnStock.getQtd() + 1);

        String description = "Usuário devolveu o livro " + bookTitle;

        Moviment movimentEntrada = new Moviment();
        movimentEntrada.setUser(user);
        movimentEntrada.setQtdMoviment(1);
        movimentEntrada.setTypeItem(TypeMoviment.ENTRADA);
        movimentEntrada.setStockBook(bookOnStock);
        movimentEntrada.setDescription(description.toUpperCase());
        movimentEntrada.setCreatedTime(LocalDateTime.now());

        loan.getMoviments().add(movimentEntrada);
        loan.setStatus(StatusLoan.FINALIZADO);

        if (penalty != null) {
            penalty.setStatus(StatusPenalty.PAGO);
        }

        stockBookRepository.save(bookOnStock);
        movimentRepository.save(movimentEntrada);
        return loanRepository.save(loan);
    }

    @Transactional
    @Auditable(action = "CANCELAR_EMPRESTIMO_LIVRO",details = "CANCELAMENTO DO LIVRO NO EMPRESTIMO {loanId} do USUARIO {userId}")
    public Moviment cancelLoan(Long loanId) {
        Loan existLoan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Este Emprestimo Não Existe"));

        if (existLoan.getStatus() == StatusLoan.FINALIZADO) {
            throw new NotFoundException("Não é possível cancelar um empréstimo já finalizado");
        }

        if (existLoan.getStatus() == StatusLoan.ATIVO) {
            throw new NotFoundException("Não é Possível Cancelar um Empéstimo ativado");
        }

        StockBook bookOnStock = stockBookRepository.findById(existLoan.getStockBook().getId())
                .orElseThrow(() -> new NotFoundException("Esse Livro não existe no stock"));

        Moviment moviment = new Moviment();
        moviment.setUser(existLoan.getUser());
        moviment.setQtdMoviment(1);
        moviment.setCreatedTime(LocalDateTime.now());
        bookOnStock.setQtd(bookOnStock.getQtd() + moviment.getQtdMoviment());
        moviment.setStockBook(bookOnStock);

        Boolean isUserAdmin = existLoan.getUser().getRole().equals(Role.ADMIN);
        String description = "";
        TypeMoviment type;

        if (isUserAdmin) {
            description = "Admin Cancelou Emprestimo de Livro " + existLoan.getStockBook().getBook().getTitle();
            type = TypeMoviment.ENTRADA_ADMIN;
        } else {
            description = "Usuario Cancelou Emprestimo de Livro " + existLoan.getStockBook().getBook().getTitle();
            type = TypeMoviment.ENTRADA;
        }

        moviment.setTypeItem(type);
        moviment.setDescription(description.toUpperCase());

        AuditContext.capture("userId",existLoan.getUser().getId());

        movimentRepository.save(moviment);
        stockBookRepository.save(bookOnStock);
        loanRepository.delete(existLoan);

        return moviment;
    }

    @Transactional
    @Auditable(
            action = "ATUALIZAR_EMPRESTIMO_LIVRO",
            details = " FEITO ATUALIZAÇÃO DO EMPRÉSTIMO {loanId}"
    )
    public Loan updateLoan(Long loanId, Loan newLoan) {
        Loan existLoan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Esse Empréstimo não existe no sistema"));

        if (newLoan.getUser() != null && newLoan.getUser().getId() != null) {
            User user = userRepository.findById(newLoan.getUser().getId())
                    .orElseThrow(() -> new NotFoundException("Esse Usuario não existe"));
            existLoan.setUser(user);
        }

        if (newLoan.getStockBook() != null && newLoan.getStockBook().getId() != null) {
            StockBook stockBook = stockBookRepository.findById(newLoan.getStockBook().getId())
                    .orElseThrow(() -> new NotFoundException("Este Livro não existe dentro do Estoque"));
            existLoan.setStockBook(stockBook);
        }

        if (newLoan.getMoviments() != null) existLoan.setMoviments(newLoan.getMoviments());
        if (newLoan.getLoanDate() != null) existLoan.setLoanDate(newLoan.getLoanDate());
        if (newLoan.getReturnDate() != null) existLoan.setReturnDate(newLoan.getReturnDate());

        if (newLoan.getStatus() != null) {
            StatusLoan newLoanStatus = newLoan.getStatus();

            if (newLoanStatus == StatusLoan.ATRASADO) {
                Optional<Penalty> penaltyExist = penaltyRepository.findByLoan(existLoan);
                if (penaltyExist.isEmpty()) {

                    boolean isOverdue = existLoan.getReturnDate().isBefore(LocalDateTime.now());
                    if (!isOverdue) {
                        throw new NotFoundException(
                                "Não é possível marcar como atrasado: o prazo de devolução ainda não venceu."
                        );
                    }

                    Penalty penalty = new Penalty();
                    penalty.setPenaltyDate(LocalDateTime.now());
                    penalty.setPaid(false);
                    penalty.setLoan(existLoan);
                    penalty.setStatus(StatusPenalty.PENDENTE);


                    penalty.setAmount(penalty.getPaymentAmount(existLoan.getReturnDate(), LocalDateTime.now()));

                    existLoan.setReturnDate(null);
                    penaltyRepository.save(penalty);
                }
            }

            if (newLoanStatus == StatusLoan.FINALIZADO) {
                Penalty penalty = existLoan.getPenalty();
                if (penalty != null && !penalty.getPaid()) {
                    throw new NotFoundException(
                            "Não é possível finalizar o empréstimo: existe multa pendente. " +
                                    "Valor: R$ " + penalty.getAmount() + ". Quite a multa antes de finalizar."
                    );
                }

                if (penalty != null) {
                    existLoan.setReturnDate(LocalDateTime.now());
                    penalty.setStatus(StatusPenalty.PAGO);
                    penalty.setPayedDate(LocalDateTime.now());
                    penaltyRepository.save(penalty);
                }
            }

            existLoan.setStatus(newLoanStatus);
        }

        return loanRepository.save(existLoan);
    }
    @Auditable(
            action = "ENCONTRAR_EMPRESTIMO_POR_USUARIO",
            details = "USUÁRIO {userId} FEITO RETORNO DO LIVRO ID({bookId})"
    )
    public Loan findByBookOnLoanForUser(Long userId, Long bookId) {
        User userExist = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario nâo encontrado"));


        Book bookExist = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Livro não encontrado"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stockService.getStock(), bookExist)
                .orElseThrow(() -> new NotFoundException("Livro não Encontrado no estoque"));

        return loanRepository.findActiveByUserAndStockBook(userExist, bookOnStock)
                .orElseThrow(() -> new NotFoundException("Não foi encontrado Nenhum Emprestimo com esse Livro por este Usuario"));
    }

    public List<Loan> findAllLoansByUser(long userId) {
        User existUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Este usuário não existe"));
        return loanRepository.findActiveByUser(existUser);
    }

    @Transactional
    @Auditable(
            action = "REMOVER_EMPRESTIMO_POR_USUARIO",
            details = "USUÁRIO {userId} REMOVENDO EMPRESTIMO ID({id})"
    )
    public void removeLoan(Long id, Long userId) {
        Loan existLoan = loanRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Não existe esse empréstimo no sistema"));
        User existUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Esse Usuário não existe para realizar esa ação"));

        existLoan.getRecordStatus().delete(existUser);
        loanRepository.save(existLoan);
    }
}