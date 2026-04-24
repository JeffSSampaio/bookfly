package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "estoque")
public class Stock {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "stock", cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private List<StockBook> stockBooks;

    public Stock() {
    }

    public Stock(Long id, List<StockBook> stockBooks) {
        this.id = id;
        this.stockBooks = stockBooks;
    }

    public List<StockBook> getStockBooks() {
        return stockBooks;
    }

    public void setStockBooks(List<StockBook> stockBooks) {
        this.stockBooks = stockBooks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}