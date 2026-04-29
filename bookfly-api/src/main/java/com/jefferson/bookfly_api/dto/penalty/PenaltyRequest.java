package com.jefferson.bookfly_api.dto.penalty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Schema(description = "dados para requisição de multa")
public record PenaltyRequest(
        @NotNull
        Long userId,
        @NotNull
        Long userLoanId
) {

}
