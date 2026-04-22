package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Author createAuthor(Author author){
        return authorRepository.save(author);
    }


    public Author getAuthorById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author não encontrado"));
    }

    public Optional<Author> findByName(String name){
       return authorRepository.findByName(name);
    }


    public List<Book> getBooksByAuthor(Long id) {
        Author author = getAuthorById(id);
        return author.getBooks();
    }

}
