package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="autor")
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "bookcase_id")
    private Bookcase bookcase;

    @ManyToMany(mappedBy = "authors")
    private List<Book> books;

    public Author() {
    }

    public Author(Long id, String name, Bookcase bookcase, List<Book> books) {
        this.id = id;
        this.name = name;
        this.bookcase = bookcase;
        this.books = books;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Bookcase getBookcase() {
        return bookcase;
    }

    public void setBookcase(Bookcase bookcase) {
        this.bookcase = bookcase;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public void setBooks(ArrayList<Book> books) {
        this.books = books;
    }

}