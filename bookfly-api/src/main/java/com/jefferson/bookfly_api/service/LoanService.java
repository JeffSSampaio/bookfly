package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    public List<Loan> getAllLoans() {
        return loanRepository.findAll()
                .stream()
                .filter(loan -> loan != null)
                .toList();
    }

    @Transactional
    public Loan doLoanBook(Long bookId, Long userId) {
        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Esse livro não existe"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Esse livro não existe dentro do estoque"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não existe"));

        Optional<Loan> existLoan = loanRepository.findByUserAndStockBook(user, bookOnStock);

        if (existLoan.isPresent()) {
            Loan activeLoan = existLoan.get();

            Penalty penalty = activeLoan.getPenalty();
            if (penalty != null && !penalty.getPaid()) {
                throw new RuntimeException(
                        "Usuário possui multa pendente para este livro. " +
                                "Valor: R$ " + penalty.getAmount() + ". Quite a multa antes de fazer novo empréstimo."
                );
            }

            throw new RuntimeException("Usuário já possui um empréstimo ativo para este livro");
        }

        if (!bookOnStock.isBookAvailable()) {
            throw new RuntimeException("Não foi possível fazer empréstimo: livro indisponível no estoque");
        }

        bookOnStock.setQtd(bookOnStock.getQtd() - 1);

        Moviment moviment = new Moviment();
        moviment.setUser(user);
        moviment.setQtdMoviment(1);
        moviment.setTypeItem(TypeMoviment.SAIDA);
        moviment.setStockBook(bookOnStock);
        moviment.setCreatedDate(LocalDate.now());

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
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));

        if (loan.getStatus() == StatusLoan.FINALIZADO) {
            throw new RuntimeException("Este empréstimo já foi finalizado");
        }

        Penalty penalty = loan.getPenalty();
        if (penalty != null && !penalty.getPaid()) {
            throw new RuntimeException(
                    "Não é possível devolver o livro: existe multa pendente. " +
                            "Valor: R$ " + penalty.getAmount()
            );
        }

        StockBook bookOnStock = loan.getStockBook();

        bookOnStock.setQtd(bookOnStock.getQtd() + 1);

        Moviment movimentEntrada = new Moviment();
        movimentEntrada.setUser(loan.getUser());
        movimentEntrada.setQtdMoviment(1);
        movimentEntrada.setTypeItem(TypeMoviment.ENTRADA);
        movimentEntrada.setStockBook(bookOnStock);
        movimentEntrada.setCreatedDate(LocalDate.now());

        loan.getMoviments().add(movimentEntrada);

        loan.setStatus(StatusLoan.FINALIZADO);

        if (penalty != null) {
            penalty.setStatus(StatusPenalty.PAGO);
        }

        stockBookRepository.save(bookOnStock);
        movimentRepository.save(movimentEntrada);
        return loanRepository.save(loan);
    }

    public List<Loan> findAllLoansByUser(long userId) {
        User existUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Este usuário não existe"));
        return loanRepository.findByUser(existUser);
    }
}