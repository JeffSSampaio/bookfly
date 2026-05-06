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

    private String summary;

    @ManyToMany
    @JoinTable(
            name = "livro_author",
            joinColumns = @JoinColumn(name = "livro_id"),
            inverseJoinColumns = @JoinColumn(name = "autor_id")
    )
    private List<Author> authors;


    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "livro_genero", joinColumns = @JoinColumn(name = "livro_id"))
    private List<Gender> genders = new ArrayList<>();

    public Book(Long id, String title, String cover, String summary, List<Author> authors, List<Gender> genders) {
        this.id = id;
        this.title = title;
        this.cover = cover;
        this.summary = summary;
        this.authors = authors;
        this.genders = genders;
    }

    public Book() {
    }



    @Override
    public String toString() {
        return "Book{" +
                ", title='" + title + '\'' +
                ", cover='" + cover + '\'' +
                ", authors=" + authors +
                ", genders=" + genders +
                '}';
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

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(List<Author> authors) {
        this.authors = authors;
    }

    public List<Gender> getGenders() {
        return genders;
    }

    public void setGenders(List<Gender> genders) {
        this.genders = genders;
    }
}
