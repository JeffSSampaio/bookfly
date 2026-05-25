package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes")
public class Moviment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estoque_livro_id", referencedColumnName = "id")
    private StockBook stockBook;

    @Column(columnDefinition = "TEXT")
    private String description;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Enumerated(EnumType.STRING)
    private TypeMoviment typeItem;

    private int qtdMoviment;


    public Moviment() {
    }

    public Moviment(Long id, User user, StockBook stockBook, String description, LocalDateTime createdTime, TypeMoviment typeItem, int qtdMoviment) {
        this.id = id;
        this.user = user;
        this.stockBook = stockBook;
        this.description = description;
        this.createdTime = createdTime;
        this.typeItem = typeItem;
        this.qtdMoviment = qtdMoviment;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public StockBook getStockBook() {
        return stockBook;
    }

    public void setStockBook(StockBook stockBook) {
        this.stockBook = stockBook;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public TypeMoviment getTypeItem() {
        return typeItem;
    }

    public void setTypeItem(TypeMoviment typeItem) {
        this.typeItem = typeItem;
    }

    public int getQtdMoviment() {
        return qtdMoviment;
    }

    public void setQtdMoviment(int qtdMoviment) {
        this.qtdMoviment = qtdMoviment;
    }

}
