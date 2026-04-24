package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.repository.BookRepository;
import com.jefferson.bookfly_api.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public Book createBook(Book book){
        List<Book> allBooks = bookRepository.findAll();

        Optional<Book> existBook = allBooks.stream()
                .filter(b-> b.getId().equals(book.getId()))
                .findFirst();

        if (existBook.isEmpty()){
            System.out.println("/n Livro Salvo:" + book.toString());
            bookRepository.save(book);
            return book;
        } 

        return book;

    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
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
