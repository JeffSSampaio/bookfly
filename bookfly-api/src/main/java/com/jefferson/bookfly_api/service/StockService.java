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
    private final AuthorService authorService;
    private final BookcaseService bookcaseService;
    private static final Long ESTOQUE_ID = 1L;
    private final BookRepository bookRepositor;
    private final BookService bookService;

    public Stock getStock() {
        return stockRepository.findById(ESTOQUE_ID)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado"));
    }

    private ArrayList<Author> resolveAutores(ArrayList<Author> autores) {
        ArrayList<Author> resolvedAutores = new ArrayList<>();

        autores.forEach(author -> {
            Optional<Author> existAutor = authorService.findByName(author.getName());

            if (existAutor.isPresent()) {
                resolvedAutores.add(existAutor.get());
            } else {

                resolvedAutores.add(authorService.createAuthor(author));
            }
        });

        return resolvedAutores;
    }

    public void updateBookQtd(Book book) {

        if (book.getQtd() > 0){
            bookService.createBook(book);
        }
        throw new RuntimeException("Livro Indisponível no Stock");


    }
        public void addBookOnStock(Book newBook) {
            Stock stock = getStock();
            List<Book> allBooksStock = stock.getBooks();


            ArrayList<Author> autores = resolveAutores(newBook.getAuthors());
            newBook.setAuthors(autores);

            Optional<Book> existBook = allBooksStock.stream()
                    .filter(b -> b.getTitle().equalsIgnoreCase(newBook.getTitle()))
                    .findFirst();

            if (existBook.isPresent()) {

                Book book = existBook.get();
                book.setQtd(book.getQtd() + newBook.getQtd());
                bookService.createBook(book);
            } else {

                autores.forEach(author -> {
                    author.getBooks().add(newBook);
                    authorService.createAuthor(author);
                });
                stock.addBook(newBook);
                stockRepository.save(stock);
            }
        }

    public void addBooksOnStock(ArrayList<Book> books) {
        books.forEach(this::addBookOnStock);
    }

    public void removeBookOnStock(Book book) {
        Stock stock = getStock();

        List<Book> allBooksStock = stock.getBooks();

        Optional<Book> existBook = allBooksStock.stream()
                .filter(b -> b.getTitle().equalsIgnoreCase(book.getTitle()))
                .findFirst();

        if (existBook.isPresent()) {
            Book existingBook = existBook.get();

            if (existingBook.getQtd() <= 0) {
                throw new RuntimeException("Livro já está com quantidade zero");
            }

            stock.removeBook(existingBook);
            stockRepository.save(stock);
        } else {
            throw new RuntimeException("Livro não encontrado no stock");
        }
    }

    public void removeBooksOnStock(ArrayList<Book> books) {
        books.forEach(this::removeBookOnStock);
    }


}
