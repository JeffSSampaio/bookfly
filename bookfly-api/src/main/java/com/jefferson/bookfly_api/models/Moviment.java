package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import jakarta.persistence.*;


import java.time.LocalDate;

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
    @JoinColumn(name = "estoque_livro_id", referencedColumnName = "estoque_id")
    private StockBook stockBook;

    @Enumerated(EnumType.STRING)
    private TypeMoviment typeItem;

    private int qtdMoviment;

    private LocalDate createdDate;

    public Moviment() {
    }

    public Moviment(Long id, User user, StockBook stockBook, TypeMoviment typeItem, int qtdMoviment, LocalDate createdDate) {
        this.id = id;
        this.user = user;
        this.stockBook = stockBook;
        this.typeItem = typeItem;
        this.qtdMoviment = qtdMoviment;
        this.createdDate = createdDate;
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

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
}
