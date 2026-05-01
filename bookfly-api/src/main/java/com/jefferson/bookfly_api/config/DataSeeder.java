package com.jefferson.bookfly_api.config;

import com.jefferson.bookfly_api.enums.Gender;
import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.AuthorRepository;
import com.jefferson.bookfly_api.repository.BookRepository;
import com.jefferson.bookfly_api.repository.StockBookRepository;
import com.jefferson.bookfly_api.repository.UserRepository;
import com.jefferson.bookfly_api.service.BookService;
import com.jefferson.bookfly_api.service.StockBookService;
import com.jefferson.bookfly_api.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;
    private final StockBookService stockBookService;
    private final BookService bookService;
    private final StockService stockService;
    private final StockBookRepository stockBookRepository;

    @PostConstruct
    public void seed() {

        if (bookRepository.count() > 0) return;

        User admin = new User();
        admin.setName("admin");
        admin.setPassword("ad");
        admin.setEmail("admin@gmail.com");
        admin.setRole(Role.ADMIN);

        User user = new User();
        user.setName("user");
        user.setPassword("us");
        user.setEmail("user@gmail.com");
        user.setRole(Role.USER);

        userRepository.saveAll(List.of(user, admin));

        Author tolkien = new Author();
        tolkien.setName("J. R. R. Tolkien");

        Author king = new Author();
        king.setName("Stephen King");

        Author poe = new Author();
        poe.setName("Edgar Allan Poe");

        authorRepository.saveAll(List.of(tolkien, king, poe));

        Book book1 = new Book();
        book1.setTitle("O Hobbit");
        book1.setCover("https://example.com/hobbit.jpg");
        book1.setGenders(List.of(Gender.FANTASIA));
        book1.setAuthors(List.of(tolkien));

        Book book2 = new Book();
        book2.setTitle("O Senhor dos Anéis: A Sociedade do Anel");
        book2.setCover("https://example.com/lotr.jpg");
        book2.setGenders(List.of(Gender.FANTASIA, Gender.ACAO));
        book2.setAuthors(List.of(tolkien));

        Book book3 = new Book();
        book3.setTitle("It: A Coisa");
        book3.setCover("https://example.com/it.jpg");
        book3.setGenders(List.of(Gender.TERROR));
        book3.setAuthors(List.of(king));

        Book book4 = new Book();
        book4.setTitle("Histórias Extraordinárias");
        book4.setCover("https://example.com/poe.jpg");
        book4.setGenders(List.of(Gender.TERROR));
        book4.setAuthors(List.of(poe));

        List<Book> savedBooks = List.of(
                bookService.createBook(book1),
                bookService.createBook(book2),
                bookService.createBook(book3),
                bookService.createBook(book4)
        );

        StockBook stockBook1 = new StockBook();
        stockBook1.setBook(savedBooks.get(0));
        stockBook1.setStock(stockService.getStock());
        stockBook1.setQtd(10);

        stockBookService.addBookOnStock(
                savedBooks.get(0).getId(),
                stockBook1.getStock().getId(),
                stockBook1.getQtd()
        );
    }
}