package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.StatusMulta;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "multa")
public class Multa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean payed;
    private LocalDate payedDate;
    private LocalDate penaltyDate;

    @Enumerated(EnumType.STRING)
    private StatusMulta status;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emprestimo_id")
    private Emprestimo loan;


    public Boolean getPayed() {
        return payed;
    }

    public void setPayed(Boolean payed) {
        this.payed = payed;
    }

    public LocalDate getPayedDate() {
        return payedDate;
    }

    public void setPayedDate(LocalDate payedDate) {
        this.payedDate = payedDate;
    }

    public LocalDate getPenaltyDate() {
        return penaltyDate;
    }

    public void setPenaltyDate(LocalDate penaltyDate) {
        this.penaltyDate = penaltyDate;
    }

    public StatusMulta getStatus() {
        return status;
    }

    public void setStatus(StatusMulta status) {
        this.status = status;
    }

    public Emprestimo getLoan() {
        return loan;
    }

    public void setLoan(Emprestimo loan) {
        this.loan = loan;
    }
}
