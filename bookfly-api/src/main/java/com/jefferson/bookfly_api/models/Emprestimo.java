package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.StatusEmprestimo;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "emprestimo")
public class Emprestimo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livro_id")
    private Livro book;

    private LocalDate loanDate;
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private StatusEmprestimo status;

    public Usuario getUser() {
        return user;
    }

    public void setUser(Usuario user) {
        this.user = user;
    }

    public Livro getBook() {
        return book;
    }

    public void setBook(Livro book) {
        this.book = book;
    }

    public LocalDate getLoanDate() {
        return loanDate;
    }

    public void setLoanDate(LocalDate loanDate) {
        this.loanDate = loanDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public StatusEmprestimo getStatus() {
        return status;
    }

    public void setStatus(StatusEmprestimo status) {
        this.status = status;
    }
}
