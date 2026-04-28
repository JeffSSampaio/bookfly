package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;

@Entity
@Table(name = "estoque_livro")
public class StockBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estoque_id")
    private Stock stock;

    @ManyToOne
    @JoinColumn(name = "livro_id")
    private Book book;


    @Column(nullable = false)
    private int qtd;

    public StockBook() {
    }

    public StockBook(Long id, Stock stock, Book book, int qtd) {
        this.id = id;
        this.stock = stock;
        this.book = book;
        this.qtd = qtd;
    }

    public boolean isBookAvailable(){
        return getQtd() > 0;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getQtd() {
        return qtd;
    }

    public void setQtd(int qtd) {
        this.qtd = qtd;
    }
}
