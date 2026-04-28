package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.loan.LoanRequest;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoanService {
    private final LoanRepository loanRepository;
    private final MovimentRepository movimentRepository;
    private final UserRepository userRepository;
    private final BookRepository  bookRepository;
    private final StockBookRepository stockBookRepository;
    private final StockService stockService;

    public List<Loan> getAllLoans(){
        return loanRepository.findAll()
                .stream()
                .filter(loan -> loan != null)
                .toList();
    }

    @Transactional
    public Loan doLoanBook(LoanRequest request){
        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(()-> new RuntimeException("Esse livro não existe"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock,book)
                .orElseThrow(()-> new RuntimeException("Esse livro não existe dentro de estoque"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(()-> new RuntimeException("Usuario não existe") );


        Optional<Loan> existLoan = loanRepository.findByUserAndStockBook(user,bookOnStock);

        if (existLoan.isPresent()){
            throw new RuntimeException("Este Usuario ja possui um emprestimo ativo para este livro");
        }

        Loan loan = new Loan();
        if (bookOnStock.isBookAvailable()){

            bookOnStock.setQtd(bookOnStock.getQtd() - 1 );


            Moviment moviment = new Moviment();
            moviment.setUser(user);
            moviment.setQtdMoviment(1);
            moviment.setTypeItem(TypeMoviment.SAIDA);
            moviment.setStockBook(bookOnStock);
            moviment.setCreatedDate(LocalDate.now());


            loan.setLoanDate(LocalDate.now());
            loan.setReturnDate(request.returnDateBook());
            loan.setMoviments(new ArrayList<>());
            loan.getMoviments().add(moviment);
            loan.setUser(user);
            loan.setStatus(StatusLoan.ATIVO);
            loan.setStockBook(bookOnStock);



            stockBookRepository.save(bookOnStock);
            movimentRepository.save(moviment);
            return loanRepository.save(loan);

        } else {

            throw new RuntimeException("Não foi possível fazer emprestimo");
        }

    }



    public List<Loan> findAllLoansByUser(long userId){
        User existUser = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("Este Usuario Não existe") );
        return loanRepository.findByUser(existUser);
    }







}
