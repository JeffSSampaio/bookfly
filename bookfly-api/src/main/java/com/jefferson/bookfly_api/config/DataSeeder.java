/*
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
        book1.setCover("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHmkcR1BUTUEMz3gtzlkRM2Lb73oWVcU7S0A&s");
        book1.setGenders(List.of(Gender.FANTASIA));
        book1.setAuthors(List.of(tolkien));
        book1.setSummary("O livro narra a jornada de Bilbo Bolseiro, um hobbit pacato que é arrastado para uma aventura pelo mago Gandalf e treze anões. O objetivo é retomar o Reino de Erebor e seu tesouro das garras do dragão Smaug. É nesta história que Bilbo encontra o 'um anel' e enfrenta criaturas como trolls, lobos e o icônico Gollum.");

        Book book2 = new Book();
        book2.setTitle("O Senhor dos Anéis: A Sociedade do Anel");
        book2.setCover("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHB8qZ_YJcBCgxXcnR6GhGMoA4IxKtlZnAoQ&s");
        book2.setGenders(List.of(Gender.FANTASIA, Gender.ACAO));
        book2.setAuthors(List.of(tolkien));
        book2.setSummary("Anos após os eventos de O Hobbit, o Um Anel passa para as mãos de Frodo Bolseiro. Ao descobrir que o artefato pertence ao Lorde das Trevas, Sauron, Frodo precisa deixar o Condado para destruí-lo na Montanha da Perdição. Ele é acompanhado pela ' do Anel', formada por representantes das diferentes raças da Terra Média (homens, elfos, anões e hobbits).");

        Book book3 = new Book();
        book3.setTitle("It: A Coisa");
        book3.setCover("https://m.media-amazon.com/images/I/91g9Dvtf+jL._UF1000,1000_QL80_.jpg");
        book3.setGenders(List.of(Gender.TERROR));
        book3.setAuthors(List.of(king));
        book3.setSummary("Ambientado na cidade de Derry, o livro acompanha um grupo de sete amigos conhecidos como 'O Clube dos Otários'. Eles enfrentam uma entidade milenar e metamórfica que assume a forma dos medos mais profundos das crianças — frequentemente personificada como o palhaço Pennywise. A história alterna entre a infância dos personagens e o retorno deles, já adultos, para derrotar o mal definitivamente.");

        Book book4 = new Book();
        book4.setTitle("Histórias Extraordinárias");
        book4.setCover("https://m.media-amazon.com/images/I/91J4ze7NJlL._AC_UF1000,1000_QL80_.jpg");
        book4.setGenders(List.of(Gender.TERROR));
        book4.setAuthors(List.of(poe));
        book4.setSummary("Esta é uma coletânea que reúne os contos mais famosos de Poe, o mestre do mistério e do macabro. O livro geralmente inclui clássicos como:\n" +
                "\n" +
                "O Gato Preto: Uma narrativa sobre culpa e sanidade.\n" +
                "\n" +
                "O Coração Delator: Onde o som de um coração batendo leva um assassino ao desespero.\n" +
                "\n" +
                "A Queda da Casa de Usher: Uma exploração do isolamento e da decadência familiar.\n" +
                "\n" +
                "Os Assassinatos na Rua Morgue: Considerada a primeira história moderna de detetive.");

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
               2L,
                stockBook1.getQtd()
        );
    }
}*/
