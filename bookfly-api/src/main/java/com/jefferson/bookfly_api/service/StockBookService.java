package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockBookService {

    private final StockBookRepository stockBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final MovimentRepository movimentRepository;
    private final StockService stockService;

    public StockBook addBookOnStock(Long bookId, Long userId, int qtd) {
        if (qtd < 0) throw new RuntimeException("Quantidade inválida");

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElse(null);

        if (stockBook != null) {
            stockBook.setQtd(stockBook.getQtd() + qtd);
        } else {
            stockBook = new StockBook();
            stockBook.setStock(stock);
            stockBook.setBook(book);
            stockBook.setQtd(qtd);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario não existe"));

        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        TypeMoviment typeMoviment = TypeMoviment.ENTRADA_ADMIN;
        String description = "";
        if(isAdmin){
            description = "Admin realizou " + typeMoviment + " em " + book.getTitle() + " com " + qtd + " unidade(s)";
        } else{
            throw new RuntimeException("Usuario não autorizado");
        }

        Moviment moviment = new Moviment();
        moviment.setStockBook(stockBook);
        moviment.setQtdMoviment(qtd);
        moviment.setUser(user);
        moviment.setDescription(description.toUpperCase());
        moviment.setTypeItem(typeMoviment);
        moviment.setCreatedTime(LocalDateTime.now());

        StockBook saved = stockBookRepository.save(stockBook);
        movimentRepository.save(moviment);

        return saved;
    }

    public StockBook removeBookFromStock(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não existe no estoque"));

        stockBook.setQtd(0);

        return stockBookRepository.save(stockBook);
    }

    public StockBook findByBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        return stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não está no estoque"));
    }

    @Transactional
    public StockBook updateQtd(Long bookId, int delta, Long adminId , String description) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não está no estoque"));

        int newQtd = stockBook.getQtd() + delta;
        if (newQtd < 0) throw new RuntimeException("Quantidade insuficiente no estoque");

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        TypeMoviment type = delta > 0 ? TypeMoviment.ENTRADA_ADMIN : TypeMoviment.SAIDA_ADMIN;
        if (description == null || description.equals("")) description = "ALTERAÇÃO: Admin " + admin.getName() + " realizou " + type + " de " + Math.abs(delta) + " unidade(s)";

        stockBook.setQtd(newQtd);
        Moviment moviment = new Moviment();
        moviment.setStockBook(stockBook);
        moviment.setQtdMoviment(Math.abs(delta));
        moviment.setTypeItem(type);
        moviment.setDescription(description.toUpperCase());
        moviment.setUser(admin);
        moviment.setCreatedTime(LocalDateTime.now());
        movimentRepository.save(moviment);

        return stockBookRepository.save(stockBook);
    }

    public List<StockBook> findAll() {
        Stock stock = stockService.getStock();
        return stockBookRepository.findByStock(stock);
    }
}