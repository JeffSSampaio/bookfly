package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.Role;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "usuario")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private List<Bookcase> bookcases;


    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<Loan> loans;

    public User() {
    }

    public User(Long id, String name, String email, String password, Role role, List<Bookcase> bookcases, List<Loan> loans) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.bookcases = bookcases;
        this.loans = loans;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Bookcase> getBookcases() {
        return bookcases;
    }

    public void setBookcases(List<Bookcase> bookcases) {
        this.bookcases = bookcases;
    }
}
