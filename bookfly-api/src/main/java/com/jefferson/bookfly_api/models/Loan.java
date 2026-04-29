package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.StatusLoan;
import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "emprestimo")
public class Loan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livro_id")
    private StockBook stockBook;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate loanDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private StatusLoan status;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "emprestimo_movimentacoes",
            joinColumns = {
                    @JoinColumn(name = "emprestimo_id" , referencedColumnName = "id"),
                    @JoinColumn(name = "emprestimo_livro_id", referencedColumnName = "livro_id")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "movimentacao_id", referencedColumnName = "id"),
                    @JoinColumn(name = "movimentacao_status", referencedColumnName = "typeitem")
            }
    )
    @JoinColumn(name = "moviment_id")
    private List<Moviment> moviments;

    @OneToOne(mappedBy = "loan", cascade = CascadeType.ALL)
    private Penalty penalty;

    public Loan() {
    }

    public Loan(Long id, User user, StockBook stockBook, LocalDate loanDate, LocalDate returnDate, StatusLoan status, List<Moviment> moviments, Penalty penalty) {
        this.id = id;
        this.user = user;
        this.stockBook = stockBook;
        this.loanDate = loanDate;
        this.returnDate = returnDate;
        this.status = status;
        this.moviments = moviments;
        this.penalty = penalty;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public StockBook getStockBook() {
        return stockBook;
    }

    public void setStockBook(StockBook stockBook) {
        this.stockBook = stockBook;
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

    public StatusLoan getStatus() {
        return status;
    }

    public void setStatus(StatusLoan status) {
        this.status = status;
    }

    public List<Moviment> getMoviments() {
        return moviments;
    }

    public void setMoviments(List<Moviment> moviments) {
        this.moviments = moviments;
    }

    public Penalty getPenalty() {
        return penalty;
    }

    public void setPenalty(Penalty penalty) {
        this.penalty = penalty;
    }
}
