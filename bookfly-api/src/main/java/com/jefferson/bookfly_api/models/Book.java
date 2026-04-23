package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.Gender;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "livro")
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

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
    private List<Author> authors;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinColumn(name = "estante_id")
    private Bookcase bookcase;

    @Enumerated(EnumType.STRING)
    private List<Gender> genders;

    public Book() {
    }

    public Book(Long id, String title, String cover, Stock stock, List<Author> authors, Bookcase bookcase, List<Gender> genders) {
        this.id = id;
        this.title = title;
        this.cover = cover;
        this.stock = stock;
        this.authors = authors;
        this.bookcase = bookcase;
        this.genders = genders;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public List<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(List<Author> authors) {
        this.authors = authors;
    }

    public Bookcase getBookcase() {
        return bookcase;
    }

    public void setBookcase(Bookcase bookcase) {
        this.bookcase = bookcase;
    }

    public List<Gender> getGenders() {
        return genders;
    }

    public void setGenders(List<Gender> genders) {
        this.genders = genders;
    }
}
