package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;


@Entity
@Table(name = "estoque")
public class Estoque {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "stock", cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private ArrayList<Livro> books;

    public ArrayList<Livro> getBooks() {
        return books;
    }

    public void setBooks(ArrayList<Livro> books) {
        this.books = books;
    }
}