package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.dto.stockbook.StockBookSummary;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockBookService {

    private final StockBookRepository stockBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final MovimentRepository movimentRepository;
    private final StockService stockService;


    @Auditable(
            action = "ADICIONADO_LIVRO_ESTOQUE",
            details = "ADICIONADO LIVRO ID°{bookId} POR USUÁRIO {userId} EM UMA QUANTIDADE DE {qtd}"
    )
    public StockBook addBookOnStock(Long bookId, Long userId, int qtd) {
        if (qtd <= 0) {
            throw new NotFoundException("Quantidade deve ser maior que zero");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não existe"));

        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        if (!isAdmin) {
            throw new NotFoundException("Usuário não autorizado");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElse(null);

        if (stockBook != null) {
            if (RecordStatusValue.DELETED.equals(stockBook.getRecordStatus().getRecordStatusValue())) {
                stockBook.getRecordStatus().active(user);
            }
            stockBook.setQtd(stockBook.getQtd() + qtd);
        } else {
            stockBook = new StockBook();
            stockBook.setStock(stock);
            stockBook.setBook(book);
            stockBook.setQtd(qtd);
            if (stockBook.getRecordStatus() != null) {
                stockBook.getRecordStatus().active(user);
            }
        }

        TypeMoviment typeMoviment = TypeMoviment.ENTRADA_ADMIN;
        String description = "ADMIN REALIZOU " + typeMoviment + " EM " + book.getTitle() + " COM " + qtd + " UNIDADE(S)";

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

//    public StockBook removeBookFromStock(Long bookId) {
//        Book book = bookRepository.findById(bookId)
//                .orElseThrow(() -> new NotFoundException("Livro não encontrado"));
//
//        Stock stock = stockService.getStock();
//
//        StockBook stockBook = stockBookRepository
//                .findByStockAndBook(stock, book)
//                .orElseThrow(() -> new NotFoundException("Livro não existe no estoque"));
//
//        stockBook.setQtd(0);
//
//        return stockBookRepository.save(stockBook);
//    }

    public StockBook findByBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        return stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new NotFoundException("Livro não está no estoque"));
    }

    @Transactional
    @Auditable(
            action = "ATUALIZACAO_LIVRO_QUANTIDADE",
            details = "QUANTIDADE DE LIVRO ID°{bookId} FOI ALTERADA POR USUARIO {adminId}  "
    )
    public StockBook updateQtd(Long bookId, int delta, Long adminId , String description) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Livro não encontrado"));

        Stock stock = stockService.getStock();

        StockBook stockBook = stockBookRepository
                .findByStockAndBook(stock, book)
                .orElseThrow(() -> new NotFoundException("Livro não está no estoque"));

        int newQtd = stockBook.getQtd() + delta;
        if (newQtd < 0) throw new NotFoundException("Quantidade insuficiente no estoque");

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

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

    public List<StockBook> findAllActive(){
        return stockBookRepository.findAllActive()
                .stream()
                .sorted(Comparator.comparing(stockBook -> stockBook.getBook().getId()))
                .toList();
    }

    public List<StockBook> findAll() {

       List<StockBook> booksOnStock = stockBookRepository.findAll().stream()
                .sorted(Comparator.comparing(stockBook -> stockBook.getBook().getId()))
               .toList();
        return booksOnStock;
    }
    @Auditable(
            action = "REMOCAO_LIVRO_ESTOQUE",
            details = "REMOÇÃO DO LIVRO DO ESTOQUE"
    )
    public void removeBookOnStock(Long id,Long userId){

        StockBook stockBook = stockBookRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Esse Livro não existe no estoque"));

        User userExist = userRepository.findById(userId)
                .orElseThrow(()-> new NotFoundException("Este Usuário não foi encontrado para realizar essa ação"));

        stockBook.getRecordStatus().delete(userExist);
        stockBook.setQtd(0);

        stockBookRepository.save(stockBook);
    }
    public Page<StockBook> findAll(String search,Pageable pageable){
        if (search == null || search.isBlank()){
            return stockBookRepository.findAll(pageable);
        }
        return stockBookRepository.search(
                search,
                pageable
        );
    }
    public Page<StockBook> findAll(Pageable pageable){
        return stockBookRepository.findAll(pageable);
    }

}