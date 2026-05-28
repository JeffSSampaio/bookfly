package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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

    public List<Loan> getAllLoans() {
        return loanRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Loan::getId))
                .toList();
    }

    @Transactional
    public Loan doLoanBook(Long bookId, Long userId) {
        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Esse livro não existe"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new NotFoundException("Esse livro não existe dentro do estoque"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não existe"));

        Optional<Loan> existLoan = loanRepository.findActiveByUserAndStockBook(user, bookOnStock);

        if (existLoan.isPresent()) {
            Loan activeLoan = existLoan.get();

            Penalty penalty = activeLoan.getPenalty();
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
        loan.setStatus(StatusLoan.ATIVO);
        loan.setStockBook(bookOnStock);

        stockBookRepository.save(bookOnStock);
        movimentRepository.save(moviment);
        return loanRepository.save(loan);
    }

    @Transactional
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
    public Moviment cancelLoan(Long loanId) {
        Loan existLoan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Este Emprestimo Não Existe"));

        if (existLoan.getStatus() == StatusLoan.FINALIZADO) {
            throw new NotFoundException("Não é possível cancelar um empréstimo já finalizado");
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


        movimentRepository.save(moviment);
        stockBookRepository.save(bookOnStock);
        loanRepository.delete(existLoan);

        return moviment;
    }
    @Transactional
    public Loan updateLoan(Long loanId, Loan newLoan){
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
            StatusLoan newLoanStatus= newLoan.getStatus();


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
                    penalty.setStatus(StatusPenalty.PAGO);
                    penaltyRepository.save(penalty);
                }
            }

            existLoan.setStatus(newLoanStatus);
        }

        return loanRepository.save(existLoan);
    }



    public List<Loan> findAllLoansByUser(long userId) {
        User existUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Este usuário não existe"));
        return loanRepository.findActiveByUser(existUser);
    }

    @Transactional
    public void removeLoan(Long id, Long userId){
        Loan existLoan = loanRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Não existe esse empréstimo no sistema"));
       User existUser = userRepository.findById(userId)
                .orElseThrow(()-> new NotFoundException("Esse Usuário não existe para realizar esa ação"));

        existLoan.getRecordStatus().delete(existUser);

        loanRepository.save(existLoan);
    }

}