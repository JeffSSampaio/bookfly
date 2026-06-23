package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.config.AuditContext;
import com.jefferson.bookfly_api.dto.moviment.MovimentSummary;
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
    @Auditable(
            action = "FAZER_MOVIMENTACAO_ITENS",
            details = "USUARIO ID°{userId} FEZ UMA MOVIMENTAÇÃO {type} DE {qtd}"
    )
    public Moviment doMoviment(Long bookId, Long userId, int qtd, String description) {
        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Livro não esta registrado"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new NotFoundException("Livro não existe no estoque"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não existe"));

        if (qtd == 0) throw new NotFoundException("Quantidade não pode ser zero");

        int newQtd = bookOnStock.getQtd() + qtd;
        if (newQtd < 0) throw new NotFoundException("Quantidade insuficiente no Estoque");

        bookOnStock.setQtd(newQtd);
        stockBookRepository.save(bookOnStock);

        boolean isAdmin = user.getRole().equals(Role.ADMIN);
        TypeMoviment type;
        if (qtd > 0) {
            type = isAdmin ? TypeMoviment.ENTRADA_ADMIN : TypeMoviment.ENTRADA;
        } else {
            type = isAdmin ? TypeMoviment.SAIDA_ADMIN : TypeMoviment.SAIDA;
        }


        String finalDescription = "";
        if (isAdmin) {
            finalDescription = (description == null || description.isBlank()) ? "Admin fez " + type + " de " + qtd + "em Livro " + bookOnStock.getBook().getTitle() : description;
        }

        AuditContext.capture("type",type);
        
        Moviment moviment = new Moviment();
        moviment.setStockBook(bookOnStock);
        moviment.setDescription(finalDescription);
        moviment.setUser(user);
        moviment.setTypeItem(type);
        moviment.setQtdMoviment(Math.abs(qtd));
        moviment.setCreatedTime(LocalDateTime.now());

        return movimentRepository.save(moviment);
    }




    @Auditable(
            action = "LISTAR_TODAS_MOVIMENTACAO",
            details = "LISTADO TODAS AS MOVIMENTAÇÕES"
    )
    public List<Moviment> getAllMoviments() {
        return movimentRepository.findAll();
    }

    @Auditable(
            action = "LISTAR_MOVIMENTAÇÃO",
            details = "LISTADA MOVIMENTAÇÃO ID°{id}"
    )
    public Moviment getMoviment(Long id) {
        return movimentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Movimentação inexistente no estoque"));
    }

    @Transactional
    @Auditable(
            action = "EDITAR_MOVIMENTACAO",
            details= "EDITAR MOVIMENTAÇÃO ID°{id} "
    )
    public Moviment editMoviment(Long id, Moviment newMoviment) {
        Moviment oldMoviment = movimentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Movimentação inexistente no estoque"));

        if (newMoviment.getQtdMoviment() <= 0) {
            throw new NotFoundException("Quantidade inválida");
        }

        User user = userRepository.findById(newMoviment.getUser().getId())
                .orElseThrow(() -> new NotFoundException("Usuario não existe"));

        StockBook stockBook = oldMoviment.getStockBook();

        boolean wasOutput = oldMoviment.getTypeItem() == TypeMoviment.SAIDA;
        if (wasOutput) {
            stockBook.setQtd(stockBook.getQtd() + oldMoviment.getQtdMoviment());
        } else {
            if (stockBook.getQtd() < oldMoviment.getQtdMoviment()) {
                throw new NotFoundException("Erro ao reverter movimentação antiga");
            }
            stockBook.setQtd(stockBook.getQtd() - oldMoviment.getQtdMoviment());
        }

        boolean isNewOutput = newMoviment.getTypeItem() == TypeMoviment.SAIDA;
        if (isNewOutput) {
            if (stockBook.getQtd() < newMoviment.getQtdMoviment()) {
                throw new NotFoundException("Estoque insuficiente");
            }
            stockBook.setQtd(stockBook.getQtd() - newMoviment.getQtdMoviment());
        } else {
            stockBook.setQtd(stockBook.getQtd() + newMoviment.getQtdMoviment());
        }

        if (newMoviment.getUser() != null) oldMoviment.setUser(user);
        if (newMoviment.getTypeItem() != null) oldMoviment.setTypeItem(newMoviment.getTypeItem());
        if (newMoviment.getDescription() != null) oldMoviment.setDescription(newMoviment.getDescription());
        if (newMoviment.getQtdMoviment() != oldMoviment.getQtdMoviment() ) oldMoviment.setQtdMoviment(newMoviment.getQtdMoviment());

        stockBookRepository.save(stockBook);
        return movimentRepository.save(oldMoviment);
    }

    @Transactional
    @Auditable(
            action = "DELETAR_MOVIMENTACAO",
            details = "DELETADA MOVIMENTACAO ID°{id}"
    )
    public void deleteMoviment(Long id) {
        Moviment moviment = movimentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Movimentação não encontrada"));

        StockBook stockBook = moviment.getStockBook();
        boolean isOutput = moviment.getTypeItem() == TypeMoviment.SAIDA;

        if (isOutput) {
            stockBook.setQtd(stockBook.getQtd() + moviment.getQtdMoviment());
        } else {
            if (stockBook.getQtd() < moviment.getQtdMoviment()) {
                throw new NotFoundException("Erro ao reverter movimentação");
            }
            stockBook.setQtd(stockBook.getQtd() - moviment.getQtdMoviment());
        }

        stockBookRepository.save(stockBook);
        movimentRepository.delete(moviment);
    }
    public Page<Moviment> findAll(String search,Pageable pageable){
        if (search == null || search.isBlank()){
            return movimentRepository.findAll(pageable);
        }

        return movimentRepository.search(
                search,
                pageable);
    }
    public Page<Moviment> findAll(Pageable pageable){
        return movimentRepository.findAll(pageable);
    }
}