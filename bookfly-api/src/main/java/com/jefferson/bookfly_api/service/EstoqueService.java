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
    public void addBookOnStock(ArrayList<Livro> books){
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










}
