package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;


@Entity
@Table(name="autor")
public class Autor {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "bookcase_id")
    private Estante bookcase;

    @ManyToMany(mappedBy = "authors")
    private ArrayList<Livro> books;


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Estante getBookcase() {
        return bookcase;
    }

    public void setBookcase(Estante bookcase) {
        this.bookcase = bookcase;
    }

    public ArrayList<Livro> getBooks() {
        return books;
    }

    public void setBooks(ArrayList<Livro> books) {
        this.books = books;
    }
}