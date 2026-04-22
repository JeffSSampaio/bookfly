package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.Gender;
import jakarta.persistence.*;

import java.util.ArrayList;

@Entity
@Table(name = "livro")
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private int qtd;

    private boolean qtdAvailabe;

    @Column(nullable = false)
    private String cover;

    @ManyToOne(fetch = FetchType.LAZY)
    private Stock stock;

    @ManyToMany
    @JoinTable(
            name = "livro_author",
            joinColumns = @JoinColumn(name = "livro_id"),
            inverseJoinColumns = @JoinColumn(name = "autor_id")
    )
    private ArrayList<Author> authors;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinColumn(name = "estante_id")
    private Bookcase bookcase;

    @Enumerated(EnumType.STRING)
    private ArrayList<Gender> genders;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public ArrayList<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(ArrayList<Author> authors) {
        this.authors = authors;
    }

    public Bookcase getBookcase() {
        return bookcase;
    }

    public void setBookcase(Bookcase bookcase) {
        this.bookcase = bookcase;
    }

    public ArrayList<Gender> getGenders() {
        return genders;
    }

    public void setGenders(ArrayList<Gender> genders) {
        this.genders = genders;
    }

    public int getQtd() {
        return qtd;
    }

    public void setQtd(int qtd) {
        this.qtd = qtd;
    }

    public boolean isQtdAvailabe() {
        return qtdAvailabe;
    }

    public void setQtdAvailabe(boolean qtdAvailabe) {
        this.qtdAvailabe = qtdAvailabe;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }
}
