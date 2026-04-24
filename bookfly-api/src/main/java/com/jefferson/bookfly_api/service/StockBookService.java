package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.repository.BookRepository;
import com.jefferson.bookfly_api.repository.StockBookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockBookService {
    private final StockBookRepository stockBookRepository;
    private final StockService stockService;
    private final BookRepository bookRepository;



    public StockBook addBookOnStock(Book book, int qtd) {

        Stock stock = stockService.getStock();

        Book existBook = bookRepository.findById(book.getId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));



        Optional<StockBook> existBookOnStock =
                stockBookRepository.findByStockAndBook(stock, existBook);

        if (existBookOnStock.isPresent()) {
            StockBook stockBook = existBookOnStock.get();
            stockBook.setQtd(stockBook.getQtd() + qtd);
            System.out.println("\n adicionado " + stockBook.getQtd() + " ao Livro: " + stockBook.getBook().toString());
            return stockBookRepository.save(stockBook);
        }

        StockBook newStockBook = new StockBook();
        newStockBook.setStock(stock);
        newStockBook.setBook(existBook);
        newStockBook.setQtd(qtd);
        System.out.println("\n Livro adicionado ao estoque");
        return stockBookRepository.save(newStockBook);
    }


    public void removeBookFromStock(Book book){
            Stock stock = stockService.getStock();
            Book existBook = bookRepository.findById(book.getId()).orElseThrow(()-> new RuntimeException("Livro não encontrado"));
            Optional<StockBook> existBookOnStock = stockBookRepository.findByStockAndBook(stock,existBook);

            if(existBookOnStock.isPresent()){
            StockBook stockBook = existBookOnStock.get();
            stockBookRepository.delete(stockBook);
            System.out.println("\n Livro retirado do estoque");
            }

    }

    public StockBook getBookFromStock(Long bookId){
        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository.findByStockAndBookId(stock,bookId)
                .orElseThrow(()-> new RuntimeException("Livro não esta no estoque"));

        return stockBook;
    }

    public List<StockBook> getAllBooksFromStock(){

    }


}
