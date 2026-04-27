package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.stockbook.StockBookRequest;
import com.jefferson.bookfly_api.dto.stockbook.StockBookUpdateQtdRequest;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockBookService {

    private final StockBookRepository stockBookRepository;
    private final StockRepository stockRepository;
    private final BookRepository bookRepository;
    private final MovimentRepository movimentRepository;

    private final StockService stockService;

    public StockBook addBookOnStock(StockBookRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElse(null);

        if (stockBook != null) {
            stockBook.setQtd(stockBook.getQtd() + request.qtd());
        } else {
            stockBook = new StockBook();
            stockBook.setStock(stock);
            stockBook.setBook(book);
            stockBook.setQtd(request.qtd());
        }

        StockBook saved = stockBookRepository.save(stockBook);


        Moviment moviment = new Moviment();
        moviment.setStockBook(stockBook);
        moviment.setQtd(request.qtd());
        moviment.setTypeItem(TypeMoviment.ENTRADA);
        moviment.setCreatedDate(LocalDate.now());

        movimentRepository.save(moviment);

        return saved;
    }

    public StockBook removeBookFromStock(Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não existe no estoque"));

        stockBook.setQtd(0);

        return stockBookRepository.save(stockBook);
    }

    public StockBook findByBook(Long bookId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        return stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não está no estoque"));
    }


    public StockBook updateQtd(StockBookUpdateQtdRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não está no estoque"));

        int delta = request.qtd();

        if (delta < 0) {
            int newQtd = stockBook.getQtd() + delta;

            if (newQtd < 0) {
                throw new RuntimeException("Quantidade insuficiente no estoque");
            }

            stockBook.setQtd(newQtd);

            Moviment moviment = new Moviment();
            moviment.setStockBook(stockBook);

            moviment.setQtd(Math.abs(delta));
            moviment.setTypeItem(TypeMoviment.SAIDA);
            moviment.setCreatedDate(LocalDate.now());

            movimentRepository.save(moviment);
        }


        else if (delta > 0) {
            stockBook.setQtd(stockBook.getQtd() + delta);
            Moviment moviment = new Moviment();
            moviment.setStockBook(stockBook);
            moviment.setQtd(delta);
            moviment.setTypeItem(TypeMoviment.ENTRADA);
            moviment.setCreatedDate(LocalDate.now());

            movimentRepository.save(moviment);
        }

        else {
            return stockBook;
        }

        return stockBookRepository.save(stockBook);
    }


    public List<StockBook> findAll() {

        Stock stock = stockService.getStock();

        return stockBookRepository.findByStock(stock);
    }

}
