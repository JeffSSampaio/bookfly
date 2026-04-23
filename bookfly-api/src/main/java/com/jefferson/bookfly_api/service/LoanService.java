package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class LoanService {
//    private final LoanRepository loanRepository;
//    private final StockService stockService;
//    private final MovimentService movimentService;
//    private final PenaltyService penaltyService;
//
//    public List<Loan> getAllLoans() {
//        return loanRepository.findAll();
//    }
//
//    public Loan getLoanById(Long id) {
//        return loanRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Emprestimo não encontrado"));
//    }
//
//    public List<Loan> getActiveLoans() {
//        return loanRepository.findByStatus(StatusLoan.ATIVO);
//    }
//
//    public List<Loan> getLateLoans() {
//        return loanRepository.findByStatusAndReturnDateBefore(
//                StatusLoan.ATIVO,
//                LocalDate.now()
//        );
//    }
//
//    public List<Loan> getLoansByUser(User user) {
//        return loanRepository.findByUser(user);
//    }
//
//    public void createLoan(Loan loan, LocalDate returnDate) {
//        Stock stock = stockService.getStock();
//
//        Optional<Book> existBook = stock.getBooks().stream()
//                .filter(b -> b.getTitle().equalsIgnoreCase(loan.getBook().getTitle()))
//                .findFirst();
//
//        if (existBook.isEmpty()) {
//            throw new RuntimeException("Livro não encontrado no stock");
//        }
//
//        if (existBook.get().getQtd() <= 0) {
//            throw new RuntimeException("Livro sem quantidade disponível");
//        }
//
//        movimentService.doMoviment( loan, TypeMoviment.SAIDA);
//
//        loan.setStatus(StatusLoan.ATIVO);
//        loan.setLoanDate(LocalDate.now());
//        loan.setReturnDate(returnDate);
//        loanRepository.save(loan);
//
//
//    }
//
//    public void returnLoan(Long id) {
//        Loan loan = getLoanById(id);
//
//        if (loan.getStatus() == StatusLoan.DEVOLVIDO) {
//            throw new RuntimeException("Emprestimo já foi devolvido");
//        }
//
//        Stock stock = stockService.getStock();
//
//        Optional<Book> existBook = stock.getBooks().stream()
//                .filter(b -> b.getTitle().equalsIgnoreCase(loan.getBook().getTitle()))
//                .findFirst();
//
//        if (existBook.isPresent()) {
//            Book bookStock = existBook.get();
//            bookStock.setQtd(bookStock.getQtd() + 1);
//            stockService.updateBookQtd(bookStock);
//        }
//
//        loan.setStatus(StatusLoan.DEVOLVIDO);
//        loan.setReturnDate(LocalDate.now());
//        loanRepository.save(loan);
//
//        penaltyService.generatePenaltyIfLate(loan);
//        movimentService.doMoviment( loan, TypeMoviment.ENTRADA);
//    }
//
//    public void deleteLoan(Long id) {
//        loanRepository.deleteById(id);
//    }
}
