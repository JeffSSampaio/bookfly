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

  
}
