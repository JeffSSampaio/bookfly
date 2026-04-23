package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "estante")
public class Bookcase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private User user;

    @OneToMany(mappedBy = "bookcase", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Book> books;

    public Bookcase(Long id, User user, List<Book> books) {
        this.id = id;
        this.user = user;
        this.books = books;
    }

    public Bookcase() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
}