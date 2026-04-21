package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Estoque;
import com.jefferson.bookfly_api.models.Livro;
import com.jefferson.bookfly_api.repository.EstoqueRepository;
import com.jefferson.bookfly_api.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.awt.print.Book;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EstoqueService {

    private EstoqueRepository estoqueRepository;
    private static final Long ESTOQUE_ID = 1L;
    private LivroRepository livroRepository;

    public Estoque getEstoque() {
        return estoqueRepository.findById(ESTOQUE_ID)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado"));
    }
    public void addBooksOnStock(ArrayList<Livro> books){
        Estoque estoque = getEstoque();

        List<Livro> allbooksStock = estoque.getBooks();

        books.forEach(newbook -> {
            Optional<Livro> existBook = allbooksStock.stream()
                    .filter(b -> b.getTitle().equalsIgnoreCase(newbook.getTitle()))
                    .findFirst();
            if (existBook.isPresent()){
                Livro book = existBook.get();
                book.setQtd(book.getQtd() + newbook.getQtd());
                livroRepository.save(book);
            } else {
                estoque.addBook(newbook);
            }

        });
       estoqueRepository.save(estoque);

    }


    public void addBookOnStock(Livro newBook) {
        Estoque estoque = getEstoque();

        List<Livro> allBooksStock = estoque.getBooks();

        Optional<Livro> existBook = allBooksStock.stream()
                .filter(b -> b.getTitle().equalsIgnoreCase(newBook.getTitle()))
                .findFirst();

        if (existBook.isPresent()) {
            Livro book = existBook.get();
            book.setQtd(book.getQtd() + newBook.getQtd());
            livroRepository.save(book);
        } else {
            estoque.addBook(newBook);
            estoqueRepository.save(estoque);
        }
    }


    public void removeBookOnStock(Livro book) {
        Estoque estoque = getEstoque();

        List<Livro> allBooksStock = estoque.getBooks();

        Optional<Livro> existBook = allBooksStock.stream()
                .filter(b -> b.getTitle().equalsIgnoreCase(book.getTitle()))
                .findFirst();

        if (existBook.isPresent()) {
            Livro existingBook = existBook.get();

            if (existingBook.getQtd() <= 0) {
                throw new RuntimeException("Livro já está com quantidade zero");
            }

            estoque.removeBook(existingBook);
            estoqueRepository.save(estoque);
        } else {
            throw new RuntimeException("Livro não encontrado no estoque");
        }
    }

    public void removeBooksOnStock(ArrayList<Livro> books) {
        books.forEach(this::removeBookOnStock);
    }


}
