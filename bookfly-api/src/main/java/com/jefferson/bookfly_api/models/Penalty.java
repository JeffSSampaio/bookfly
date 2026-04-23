package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.StatusPenalty;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "multa")
public class Penalty {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean payed;
    private LocalDate payedDate;
    private LocalDate penaltyDate;

    @Enumerated(EnumType.STRING)
    private StatusPenalty status;

    private Double valuePenalty;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emprestimo_id")
    private Loan loan;

    public Penalty(Long id, Boolean payed, LocalDate payedDate, LocalDate penaltyDate, StatusPenalty status, Double valuePenalty, Loan loan) {
        this.id = id;
        this.payed = payed;
        this.payedDate = payedDate;
        this.penaltyDate = penaltyDate;
        this.status = status;
        this.valuePenalty = valuePenalty;
        this.loan = loan;
    }

    public Penalty() {
    }

    public Long getId() {
        return id;
    }

    public Double getValuePenalty() {
        return valuePenalty;
    }

    public void setValuePenalty(Double valuePenalty) {
        this.valuePenalty = valuePenalty;
    }

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

    public StatusPenalty getStatus() {
        return status;
    }

    public void setStatus(StatusPenalty status) {
        this.status = status;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }
}
