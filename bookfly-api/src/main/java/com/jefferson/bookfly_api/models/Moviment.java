package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
@Table(name = "movimentacoes")
public class Moviment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estoque_id")
    private Stock stock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emprestimo_id")
    private Loan loan;

    @Enumerated(EnumType.STRING)
    private TypeMoviment typeItem;

    private int qtd;


    private LocalDate createdDate;

    public Moviment(Long id, Stock stock, Loan loan, TypeMoviment typeItem, int qtd, LocalDate createdDate) {
        this.id = id;
        this.stock = stock;
        this.loan = loan;
        this.typeItem = typeItem;
        this.qtd = qtd;
        this.createdDate = createdDate;
    }

    public Moviment() {
    }

    public Long getId() {
        return id;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public TypeMoviment getTypeItem() {
        return typeItem;
    }

    public void setTypeItem(TypeMoviment typeItem) {
        this.typeItem = typeItem;
    }

    public int getQtd() {
        return qtd;
    }

    public void setQtd(int qtd) {
        this.qtd = qtd;
    }
}
