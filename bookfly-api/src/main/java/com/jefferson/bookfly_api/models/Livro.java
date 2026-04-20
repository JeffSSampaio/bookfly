package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.Genero;
import jakarta.persistence.*;

import java.util.ArrayList;

@Entity
@Table(name = "livro")
public class Livro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private int qtd;

    private boolean qtdAvailabe;

    @Column(nullable = false)
    private String cover;

    @ManyToOne(fetch = FetchType.LAZY)
    private Estoque stock;

    @ManyToMany
    @JoinTable(
            name = "livro_author",
            joinColumns = @JoinColumn(name = "livro_id"),
            inverseJoinColumns = @JoinColumn(name = "autor_id")

    )
    private ArrayList<Autor> authors;

    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinColumn(name = "estante_id")
    private Estante bookcase;

    @Enumerated(EnumType.STRING)
    private ArrayList<Genero> genders;


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

    public ArrayList<Autor> getAuthors() {
        return authors;
    }

    public void setAuthors(ArrayList<Autor> authors) {
        this.authors = authors;
    }

    public Estante getBookcase() {
        return bookcase;
    }

    public void setBookcase(Estante bookcase) {
        this.bookcase = bookcase;
    }

    public ArrayList<Genero> getGenders() {
        return genders;
    }

    public void setGenders(ArrayList<Genero> genders) {
        this.genders = genders;
    }
}
