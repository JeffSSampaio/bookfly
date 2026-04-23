package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.StatusLoan;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LoanResponseDTO")
public record LoanResponseDTO(
        @Schema(description = "identificador do Emprestimo")
        Long loan_id,
        @Schema(description = "Usuario")
        UserResponseDTO user,
        @Schema(description = "Livro")
        BookResponseDTO book,
        @Schema(description = "Quantidade de Livro Emprestada")
        int book_qtd_loaned,
        @Schema(description = "Status do Emprestimo")
        StatusLoan statusLoan
) { }
