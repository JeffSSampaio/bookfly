package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentService {

    private final MovimentRepository movimentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final StockBookRepository stockBookRepository;
    private final StockService stockService;

    @Transactional
    public Moviment doMoviment(Long bookId, Long userId, int qtd) {
        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não esta registrado"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não existe no estoque"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não existe"));

        if (qtd == 0) throw new RuntimeException("Quantidade não pode ser zero");

        int newQtd = bookOnStock.getQtd() + qtd;
        if (newQtd < 0) throw new RuntimeException("Quantidade insuficiente no Estoque");

        bookOnStock.setQtd(newQtd);
        stockBookRepository.save(bookOnStock);

        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        TypeMoviment type;
        if (qtd > 0) {
            type = isAdmin ? TypeMoviment.ENTRADA_ADMIN : TypeMoviment.ENTRADA;
        } else {
            type = isAdmin ? TypeMoviment.SAIDA_ADMIN : TypeMoviment.SAIDA;
        }

        Moviment moviment = new Moviment();
        moviment.setStockBook(bookOnStock);
        moviment.setUser(user);
        moviment.setTypeItem(type);
        moviment.setQtdMoviment(Math.abs(qtd));
        moviment.setCreatedDate(LocalDate.now());

        return movimentRepository.save(moviment);
    }

    public List<Moviment> getAllMoviments() {
        return movimentRepository.findAll();
    }

    public Moviment getMoviment(Long id) {
        return movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação inexistente no estoque"));
    }

    @Transactional
    public Moviment updateMoviment(Long id, Long userId, TypeMoviment typeItem, int qtd) {
        Moviment oldMoviment = movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação inexistente no estoque"));

        StockBook stockBook = oldMoviment.getStockBook();

        boolean wasOutput = oldMoviment.getTypeItem() == TypeMoviment.SAIDA;

        if (wasOutput) {
            stockBook.setQtd(stockBook.getQtd() + oldMoviment.getQtdMoviment());
        } else {
            if (stockBook.getQtd() < oldMoviment.getQtdMoviment()) {
                throw new RuntimeException("Erro ao reverter movimentação antiga");
            }
            stockBook.setQtd(stockBook.getQtd() - oldMoviment.getQtdMoviment());
        }

        if (qtd <= 0) {
            throw new RuntimeException("Quantidade inválida");
        }

        boolean isNewOutput = typeItem == TypeMoviment.SAIDA;

        if (isNewOutput) {
            if (stockBook.getQtd() < qtd) {
                throw new RuntimeException("Estoque insuficiente");
            }
            stockBook.setQtd(stockBook.getQtd() - qtd);
        } else {
            stockBook.setQtd(stockBook.getQtd() + qtd);
        }

        stockBookRepository.save(stockBook);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario não existe"));

        oldMoviment.setUser(user);
        oldMoviment.setTypeItem(typeItem);
        oldMoviment.setQtdMoviment(qtd);

        return movimentRepository.save(oldMoviment);
    }

    @Transactional
    public void deleteMoviment(Long id) {
        Moviment moviment = movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada"));

        StockBook stockBook = moviment.getStockBook();
        boolean isOutput = moviment.getTypeItem() == TypeMoviment.SAIDA;

        if (isOutput) {
            stockBook.setQtd(stockBook.getQtd() + moviment.getQtdMoviment());
        } else {
            if (stockBook.getQtd() < moviment.getQtdMoviment()) {
                throw new RuntimeException("Erro ao reverter movimentação");
            }
            stockBook.setQtd(stockBook.getQtd() - moviment.getQtdMoviment());
        }

        stockBookRepository.save(stockBook);
        movimentRepository.delete(moviment);
    }
}