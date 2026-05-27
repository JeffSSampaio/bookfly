package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.StatusPenalty;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@SQLDelete(sql = "UPDATE multa SET record_status_value  = 'DELETED', status_date_time = NOW() WHERE id = ?")
@Table(name = "multa")
public class Penalty {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean paid;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime payedDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime penaltyDate;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "penalty_status")
    private StatusPenalty status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emprestimo_id")
    private Loan loan;

    @Embedded
    private RecordStatus recordStatus = new RecordStatus();

    public BigDecimal getPaymentAmount(LocalDateTime dateReturnDateLoan, LocalDateTime dateCurrent) {
        long daysPassed = ChronoUnit.DAYS.between(dateReturnDateLoan, dateCurrent);
        long value = Math.max(0, daysPassed);

        return new BigDecimal(value)
                .multiply(new BigDecimal("1.50"))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public Penalty() {
    }

    public Penalty(Long id, Boolean paid, LocalDateTime payedDate, LocalDateTime penaltyDate, BigDecimal amount, StatusPenalty status, Loan loan, RecordStatus recordStatus) {
        this.id = id;
        this.paid = paid;
        this.payedDate = payedDate;
        this.penaltyDate = penaltyDate;
        this.amount = amount;
        this.status = status;
        this.loan = loan;
        this.recordStatus = recordStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public LocalDateTime getPayedDate() {
        return payedDate;
    }

    public void setPayedDate(LocalDateTime payedDate) {
        this.payedDate = payedDate;
    }

    public LocalDateTime getPenaltyDate() {
        return penaltyDate;
    }

    public void setPenaltyDate(LocalDateTime penaltyDate) {
        this.penaltyDate = penaltyDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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

    public RecordStatus getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(RecordStatus recordStatus) {
        this.recordStatus = recordStatus;
    }


}
