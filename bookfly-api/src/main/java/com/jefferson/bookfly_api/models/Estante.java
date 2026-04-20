package com.jefferson.bookfly_api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Entity
@Table(name = "estante")
public class Estante {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "bookcase")
    private ArrayList<Livro> books;

}