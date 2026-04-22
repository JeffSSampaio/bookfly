package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.StatusLoan;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LoanDTO")
public record LoanDTO(
        @Schema(description = "identificador do Emprestimo")
        Long loan_id,
        @Schema(description = "identificador do Usuario")
        Long user_id,
        @Schema(description = "Nome do Usuario")
        String user_name,
        @Schema(description = "Titulo do Livro")
        String book_title,
        @Schema(description = "Quantidade de Livro Emprestada")
        int book_qtd_loaned,
        @Schema(description = "Status do Emprestimo")
        StatusLoan statusLoan
) { }
