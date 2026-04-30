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

    public Book createBook(Book book){

        List<Author> authors = new ArrayList<>();

        for (Author author : book.getAuthors()) {

            Author authorExist = authorRepository
                    .findByNameIgnoreCase(author.getName())
                    .orElse(null);

            if (authorExist != null) {
                authors.add(authorExist);
            } else {
                Author newAuthor = new Author();
                newAuthor.setName(author.getName());

                Author savedAuthor = authorRepository.save(newAuthor);
                authors.add(savedAuthor);
            }
        }
        List<Gender> genders = book.getGenders()
                .stream()
                .distinct()
                .toList();

        Book bookToSave = new Book();
        bookToSave.setTitle(book.getTitle());
        bookToSave.setCover(book.getCover());
        bookToSave.setAuthors(authors);
        bookToSave.setGenders(genders);

        boolean existBook = bookRepository
                .existsByTitleIgnoreCaseAndAuthorsIn(bookToSave.getTitle(), authors);

        if (existBook){
            throw new RuntimeException("Livro já cadastrado");
        }

        System.out.println("\nLivro cadastrado " + book);

        return bookRepository.save(bookToSave);
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
    }

    public Book updateBook(Long id, Book book){
        Book existBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não existe"));

        if (book.getTitle() != null) existBook.setTitle(book.getTitle());
        if (book.getCover() != null) existBook.setCover(book.getCover());
        if (book.getGenders() != null) existBook.setGenders(book.getGenders());



        if (book.getAuthors() != null) {
            List<Author> managedAuthors = new ArrayList<>();

            for (Author author : book.getAuthors()) {
                Author managedAuthor = authorRepository
                        .findByNameIgnoreCase(author.getName())
                        .orElseGet(() -> {
                            Author newAuthor = new Author();
                            newAuthor.setName(author.getName());
                            return authorRepository.save(newAuthor);
                        });
                managedAuthors.add(managedAuthor);
            }
            existBook.setAuthors(managedAuthors);
        }

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
