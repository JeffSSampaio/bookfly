package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.Moviment;
import com.jefferson.bookfly_api.repository.MovimentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MovimentService {

    private final MovimentRepository movimentRepository;
    private final StockService stockService;


    public List<Moviment> getAllMoviments() {
        return movimentRepository.findAll();
    }



    public void doMoviment(Loan loan, TypeMoviment tipo) {
         Stock stock = stockService.getStock();

        Optional<Book> existBook = stock.getBooks().stream()
                .filter(b ->  b.getTitle().equalsIgnoreCase(loan.getBook().getTitle()) )
                .findFirst();

        if (existBook.isEmpty()){
            throw new RuntimeException("Livro não existe em stock");
        }

        Book bookBorrowed = existBook.get();
        Moviment moviment = new Moviment();
        moviment.setLoan(loan);
        moviment.setStock(stock);
        moviment.setTypeItem(tipo);
        moviment.setCreatedDate(LocalDate.now());
        if (tipo == TypeMoviment.SAIDA){
            bookBorrowed.setQtd(bookBorrowed.getQtd() - 1);
            moviment.setQtd(bookBorrowed.getQtd());
            stockService.updateBookQtd(bookBorrowed);
        }
        else if (tipo == TypeMoviment.ENTRADA){
            bookBorrowed.setQtd(bookBorrowed.getQtd() + 1);
            moviment.setQtd(bookBorrowed.getQtd());
            stockService.updateBookQtd(bookBorrowed);
        }

        movimentRepository.save(moviment);
    }

    public Moviment getMovimentById(Long id) {
        return movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada"));
    }


    public List<Moviment> getMovimentByStock(Stock stock) {
        return movimentRepository.findByStock(stock);
    }


    public List<Moviment> getMovimentsByLoan(Loan loan) {
        return movimentRepository.findByLoan(loan);
    }

}