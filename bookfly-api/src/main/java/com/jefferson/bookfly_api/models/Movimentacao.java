package com.jefferson.bookfly_api.models;

import com.jefferson.bookfly_api.enums.TipoMovimentacao;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;


import java.time.LocalDate;

@Entity
@Table(name = "movimentacoes")
public class Movimentacao  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estoque_id")
    private Estoque stock;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emprestimo_id")
    private Emprestimo loan;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao typeItem;

    private int qtd;

    @CreationTimestamp
    private LocalDate createdDate;


    public Long getId() {
        return id;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public Estoque getStock() {
        return stock;
    }

    public void setStock(Estoque stock) {
        this.stock = stock;
    }

    public Emprestimo getLoan() {
        return loan;
    }

    public void setLoan(Emprestimo loan) {
        this.loan = loan;
    }

    public TipoMovimentacao getTypeItem() {
        return typeItem;
    }

    public void setTypeItem(TipoMovimentacao typeItem) {
        this.typeItem = typeItem;
    }

    public int getQtd() {
        return qtd;
    }

    public void setQtd(int qtd) {
        this.qtd = qtd;
    }
}
