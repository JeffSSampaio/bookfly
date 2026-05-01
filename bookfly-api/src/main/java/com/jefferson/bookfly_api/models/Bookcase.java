package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "estante")
public class Bookcase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "estante_estoque_livro",
            joinColumns = @JoinColumn(name = "estante_id"),
            inverseJoinColumns = @JoinColumn(name = "estoque_livro_id")
    )
    private List<StockBook> stockBooks = new ArrayList<>();

    public Bookcase() {
    }

    public Bookcase(Long id, String name, User user, List<StockBook> stockBooks) {
        this.id = id;
        this.name = name;
        this.user = user;
        this.stockBooks = stockBooks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<StockBook> getStockBooks() {
        return stockBooks;
    }

    public void setStockBooks(List<StockBook> stockBooks) {
        this.stockBooks = stockBooks;
    }
}