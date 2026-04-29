package com.jefferson.bookfly_api.dto.loan;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "dados para requisitar um emprestimo de um livro")
public record LoanRequest(
        @NotNull
        Long bookId,
        @NotNull
        Long userId,
        @NotNull
        LocalDateTime returnDateBook
) {
}
