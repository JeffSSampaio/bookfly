package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;

import java.util.ArrayList;


@Entity
@Table(name = "estoque")
public class Stock {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "stock", cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private ArrayList<Book> books;

    public ArrayList<Book> getBooks() {
        return books;
    }

    public void setBooks(ArrayList<Book> books) {
        this.books = books;
    }

    public Long getId() {
        return id;
    }

    public void addBook(Book book) {
        books.add(book);
        book.setStock(this);
    }

    public void removeBook(Book book) {
        books.remove(book);
        book.setStock(null);
    }

}