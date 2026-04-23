package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.repository.StockRepository;
import com.jefferson.bookfly_api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final BookRepository bookRepository;
    private static final Long ESTOQUE_ID = 1L;

        public Stock getStock() {
        return stockRepository.findById(ESTOQUE_ID)
             .orElseThrow(() -> new RuntimeException("Estoque não encontrado"));
    }

    public List<Stock> getAllStocks(){
            return stockRepository.findAll();
    }
    public Book getBookFromStock(Book book){
          List<Stock> allBooksFromStock = getAllStocks();
           Optional<Stock> existBook = allBooksFromStock.stream()
                   .filter(s-> s.getBook().getTitle().equalsIgnoreCase(book.getTitle()) )
                   .findFirst();
           if (existBook.isPresent()){
               return book;
           }
           throw new RuntimeException("Livro Não existe");
    }

    public Book addBooksFromStock(Book book){
            Stock stock = getStock();
            stock.setBook(book);
            List<Book> allbooks = bookRepository.findAll();
                // vê se o livro existe dentro dos livros cadastrados
             Optional<Book> existBook = allbooks.stream()
                     .filter(b -> b.getTitle().equalsIgnoreCase(stock.getBook().getTitle()))
                     .findFirst();
                // vê se o livro existe dentro do estoque
            List<Stock> allbooksOnStock = stockRepository.findAll();
                Optional<Stock> existBookOnStock = allbooksOnStock.stream()
                        .filter(s -> s.getBook().equals(book) )
                        .findFirst();

        if (existBook.isPresent() && existBookOnStock.isPresent()){
            stock.setQtd(stock.getQtd() + 1);
            stockRepository.save(stock);
        } else if (existBook.isPresent()){
            stockRepository.save(stock);
        }
            return book;
        }


    public Book removeBookFromStock(Book book){
            Stock stock = getStock();
            stockRepository.deleteById(stock.getBook().getId());
            return book;
    }



//    private final StockRepository stockRepository;
//    private final AuthorService authorService;
//    private final BookcaseService bookcaseService;
//    private static final Long ESTOQUE_ID = 1L;
//    private final BookRepository bookRepository;
//    private final BookService bookService;
//
//    public Stock getStock() {
//        return stockRepository.findById(ESTOQUE_ID)
//                .orElseThrow(() -> new RuntimeException("Estoque não encontrado"));
//    }
//
//    private List<Author> resolveAuthors(List<Author> autores) {
//        List<Author> resolvedAutores = new ArrayList<>();
//
//        autores.forEach(author -> {
//            Optional<Author> existAutor = authorService.findByName(author.getName());
//
//            if (existAutor.isPresent()) {
//                resolvedAutores.add(existAutor.get());
//            } else {
//
//                resolvedAutores.add(authorService.createAuthor(author));
//            }
//        });
//
//        return resolvedAutores;
//    }
//
//    public void updateBookQtd(Book book) {
//
//        if (book.getQtd() > 0){
//            bookService.createBook(book);
//        }
//        throw new RuntimeException("Livro Indisponível no Stock");
//
//
//    }
//
//    public Book addBookOnStock(Book newBook) {
//        Stock stock = getStock();
//        List<Book> allBooksStock = stock.getBooks();
//
//
//        List<Author> autores = resolveAuthors(newBook.getAuthors());
//        newBook.setAuthors(autores);
//
//        Optional<Book> existBook = allBooksStock.stream()
//                .filter(b -> b.getTitle().equalsIgnoreCase(newBook.getTitle()))
//                .findFirst();
//
//        if (existBook.isPresent()) {
//
//            Book book = existBook.get();
//            book.setQtd(book.getQtd() + newBook.getQtd());
//            bookService.createBook(book);
//            return book;
//        } else {
//
//            autores.forEach(author -> {
//                author.getBooks().add(newBook);
//                authorService.createAuthor(author);
//            });
//            Optional<Book> book = bookRepository.findAllById(newBook.);
//
//            stock.setBooks(book.get());
//            stockRepository.save(stock);
//            return newBook;
//        }
//    }
//
//    public void addBooksOnStock(ArrayList<Book> books) {
//        books.forEach(this::addBookOnStock);
//    }
//
//    public void removeBookOnStock(Book book) {
//        Stock stock = getStock();
//
//        List<Book> allBooksStock = stock.getBooks();
//
//        Optional<Book> existBook = allBooksStock.stream()
//                .filter(b -> b.getTitle().equalsIgnoreCase(book.getTitle()))
//                .findFirst();
//
//        if (existBook.isPresent()) {
//            Book existingBook = existBook.get();
//
//            if (existingBook.getQtd() <= 0) {
//                throw new RuntimeException("Livro já está com quantidade zero");
//            }
//
//            stock.removeBook(existingBook);
//            stockRepository.save(stock);
//        } else {
//            throw new RuntimeException("Livro não encontrado no stock");
//        }
//    }
//
//    public void removeBooksOnStock(ArrayList<Book> books) {
//        books.forEach(this::removeBookOnStock);
//    }


}
