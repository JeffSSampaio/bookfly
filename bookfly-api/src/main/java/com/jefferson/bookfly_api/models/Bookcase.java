package com.jefferson.bookfly_api.models;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
@Table(name = "estante")
public class Bookcase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private User user;

    @OneToMany(mappedBy = "bookcase", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Book> books;

    public Bookcase(Long id, String name, User user, List<Book> books) {
        this.id = id;
        this.name = name;
        this.user = user;
        this.books = books;
    }

    public Bookcase() {
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

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
}