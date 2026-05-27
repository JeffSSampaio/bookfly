package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;

import java.util.ArrayList;
import java.util.List;


@Entity
@SQLDelete(sql = "UPDATE autor SET record_status_value = 'DELETED', status_date_time = NOW() WHERE id = ?")
@Table(name="autor")
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

//    @ManyToOne
//    @JoinColumn(name = "bookcase_id")
//    private Bookcase bookcase;

    @ManyToMany(mappedBy = "authors")
    private List<Book> books;

    @Embedded
    private RecordStatus recordStatus = new RecordStatus();

    public Author() {
    }

    public Author(Long id, String name, List<Book> books, RecordStatus recordStatus) {
        this.id = id;
        this.name = name;
        this.books = books;
        this.recordStatus = recordStatus;
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

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public RecordStatus getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(RecordStatus recordStatus) {
        this.recordStatus = recordStatus;
    }
}