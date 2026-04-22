package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public Book createBook(Book book){
      return bookRepository.save(book);
    }
    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book não encontrado"));
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public List<Book> findByAutor(Long autorId) {
        return bookRepository.findByAuthorsId(autorId);
    }

    public List<Book> findAvailable() {
        return bookRepository.findByQtdGreaterThan(0);
    }

    public void removeBook(Long id){
      bookRepository.deleteById(id);
    }

    public List<Book> findByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }
}
