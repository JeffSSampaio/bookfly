package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Bookcase;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.BookcaseRepository;
import com.jefferson.bookfly_api.repository.StockBookRepository;
import com.jefferson.bookfly_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookcaseService {

    private final BookcaseRepository bookcaseRepository;
    private final UserRepository userRepository;
    private final StockBookRepository stockBookRepository;

    @Transactional
    public Bookcase createBookcase(String name, Long userId, Long stockBookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        StockBook stockBook = stockBookRepository.findById(stockBookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado no estoque"));


        List<Bookcase> existingBookcases = bookcaseRepository.findByUser(user);
        boolean alreadyExistsInAnyBookcase = existingBookcases.stream()
                .flatMap(bookcase -> bookcase.getStockBooks().stream())
                .anyMatch(sb -> sb.getId().equals(stockBookId));

        if (alreadyExistsInAnyBookcase) {
            throw new RuntimeException("Livro já está em uma estante deste usuário");
        }

        Bookcase bookcase = new Bookcase();
        bookcase.setName(name);
        bookcase.setUser(user);


        if (bookcase.getStockBooks() == null) {
            bookcase.setStockBooks(new ArrayList<>());
        }
        bookcase.getStockBooks().add(stockBook);

        return bookcaseRepository.save(bookcase);
    }

    public Bookcase findById(Long id) {
        return bookcaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estante não encontrada"));
    }

    public List<Bookcase> findAll() {
        return bookcaseRepository.findAll();
    }

    public List<Bookcase> findByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return bookcaseRepository.findByUser(user);
    }

    public List<Bookcase> findByAuthor(Long authorId) {
        return bookcaseRepository.findByStockBooksBookAuthorsId(authorId);
    }

    @Transactional
    public Bookcase addBookToBookcase(Long bookcaseId, Long stockBookId) {
        Bookcase bookcase = bookcaseRepository.findById(bookcaseId)
                .orElseThrow(() -> new RuntimeException("Estante não encontrada"));

        StockBook stockBook = stockBookRepository.findById(stockBookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado no estoque"));

        boolean alreadyExists = bookcase.getStockBooks().stream()
                .anyMatch(sb -> sb.getId().equals(stockBookId));

        if (alreadyExists) {
            throw new RuntimeException("Livro já está na estante");
        }


        bookcase.getStockBooks().add(stockBook);

        return bookcaseRepository.save(bookcase);
    }

    @Transactional
    public Bookcase updateBookcase(Long id, String name, Long stockBookId) {

        Bookcase bookcase = bookcaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estante não encontrada"));

        if (name != null && !name.isBlank()) {
            bookcase.setName(name);
        }

        if (stockBookId != null) {

            StockBook stockBook = stockBookRepository.findById(stockBookId)
                    .orElseThrow(() -> new RuntimeException("Livro não encontrado no estoque"));

            boolean alreadyExists = bookcase.getStockBooks().stream()
                    .anyMatch(sb -> sb.getId().equals(stockBookId));

            if (alreadyExists) {
                throw new RuntimeException("Livro já está na estante");
            }

            bookcase.getStockBooks().add(stockBook);
        }

        return bookcaseRepository.save(bookcase);
    }

    @Transactional
    public Bookcase removeBookFromBookcase(Long bookcaseId, Long stockBookId) {

        Bookcase bookcase = bookcaseRepository.findById(bookcaseId)
                .orElseThrow(() -> new RuntimeException("Estante não encontrada"));

        boolean removed = bookcase.getStockBooks()
                .removeIf(sb -> sb.getId().equals(stockBookId));

        if (!removed) {
            throw new RuntimeException("Livro não estava na estante");
        }

        return bookcaseRepository.save(bookcase);
    }

    public void deleteBookcase(Long id) {

        if (!bookcaseRepository.existsById(id)) {
            throw new RuntimeException("Estante não encontrada");
        }

        bookcaseRepository.deleteById(id);
    }
}