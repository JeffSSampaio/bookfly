package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.book.BookRequest;
import com.jefferson.bookfly_api.enums.Gender;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.repository.AuthorRepository;
import com.jefferson.bookfly_api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public Book createBook(BookRequest request){

        List<Author> authors = new ArrayList<>();

        for (String name : request.authors()) {

            Author authorExist = authorRepository
                    .findByNameIgnoreCase(name)
                    .orElse(null);

            if (authorExist != null) {
                authors.add(authorExist);
            } else {
                Author newAuthor = new Author();
                newAuthor.setName(name);

                Author savedAuthor = authorRepository.save(newAuthor);
                authors.add(savedAuthor);
            }
        }
        List<Gender> genders = request.genders()
                .stream()
                .distinct()
                .toList();

        Book book = new Book();
        book.setTitle(request.title());
        book.setCover(request.cover());
        book.setAuthors(authors);
        book.setGenders(genders);

        boolean existBook = bookRepository
                .existsByTitleIgnoreCaseAndAuthorsIn(book.getTitle(), authors);

        if (existBook){
            throw new RuntimeException("Livro já cadastrado");
        }

        System.out.println("\nLivro cadastrado " + book);

        return bookRepository.save(book);
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
    }

    public Book updateBook(Long id, BookRequest request){
        Book existBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não existe"));
        existBook.setTitle(request.title());
        existBook.setCover(request.cover());
        existBook.setGenders(request.genders());

        List<Author> authors = new ArrayList<>();


        for (String name : request.authors()) {
            Author authorExist = authorRepository
                    .findByNameIgnoreCase(name)
                    .orElse(null);

            if (authorExist != null) {
                authors.add(authorExist);
            } else {
                Author newAuthor = new Author();
                newAuthor.setName(name);
                authors.add(authorRepository.save(newAuthor));
            }
        }
        existBook.setAuthors(authors);

        return bookRepository.save(existBook);

    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public List<Book> findBookByAutor(Long autorId) {
        return bookRepository.findByAuthorsId(autorId);
    }


    public void removeBook(Long id){
        bookRepository.deleteById(id);
    }

    public List<Book> findByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

}
