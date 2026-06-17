package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
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
    @Auditable(
            action = "CRIADO_ESTANTE",
            details = "USUARIO {userId} CRIOU A ESTANTE - {name}"
    )
    public Bookcase createBookcase(String name, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        Bookcase bookcase = new Bookcase();
        bookcase.setName(name);
        bookcase.setUser(user);
        bookcase.setStockBooks(new ArrayList<>());


        return bookcaseRepository.save(bookcase);
    }

    public Bookcase findById(Long id) {
        return bookcaseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Estante não encontrada"));
    }

    public List<Bookcase> findAll() {
        return bookcaseRepository.findAll();
    }

    public List<Bookcase> findByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        return bookcaseRepository.findByUser(user);
    }

    public List<Bookcase> findByAuthor(Long authorId) {
        return bookcaseRepository.findByStockBooksBookAuthorsId(authorId);
    }

    @Transactional
    public Bookcase addBookToBookcase(Long bookcaseId, Long stockBookId) {
        Bookcase bookcase = bookcaseRepository.findById(bookcaseId)
                .orElseThrow(() -> new NotFoundException("Estante não encontrada"));

        StockBook stockBook = stockBookRepository.findById(stockBookId)
                .orElseThrow(() -> new NotFoundException("Livro não encontrado no estoque"));

        boolean alreadyExists = bookcase.getStockBooks().stream()
                .anyMatch(sb -> sb.getId().equals(stockBookId));

        if (alreadyExists) {
            throw new NotFoundException("Livro já está na estante");
        }


        bookcase.getStockBooks().add(stockBook);

        return bookcaseRepository.save(bookcase);
    }

    @Transactional
    public Bookcase updateBookcase(Long id, String name, Long stockBookId) {

        Bookcase bookcase = bookcaseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Estante não encontrada"));

        if (name != null && !name.isBlank()) {
            bookcase.setName(name);
        }

        if (stockBookId != null) {

            StockBook stockBook = stockBookRepository.findById(stockBookId)
                    .orElseThrow(() -> new NotFoundException("Livro não encontrado no estoque"));

            boolean alreadyExists = bookcase.getStockBooks().stream()
                    .anyMatch(sb -> sb.getId().equals(stockBookId));

            if (alreadyExists) {
                throw new NotFoundException("Livro já está na estante");
            }

            bookcase.getStockBooks().add(stockBook);
        }

        return bookcaseRepository.save(bookcase);
    }

    @Transactional
    public Bookcase removeBookFromBookcase(Long bookcaseId, Long stockBookId) {

        Bookcase bookcase = bookcaseRepository.findById(bookcaseId)
                .orElseThrow(() -> new NotFoundException("Estante não encontrada"));

        boolean removed = bookcase.getStockBooks()
                .removeIf(sb -> sb.getId().equals(stockBookId));

        if (!removed) {
            throw new NotFoundException("Livro não estava na estante");
        }

        return bookcaseRepository.save(bookcase);
    }




    public void deleteBookcase(Long id) {

        if (!bookcaseRepository.existsById(id)) {
            throw new NotFoundException("Estante não encontrada");
        }

        bookcaseRepository.deleteById(id);
    }
}