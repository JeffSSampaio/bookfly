package com.jefferson.bookfly_api.dto.penalty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "dados para requisição de multa")
public record PenaltyRequest(
        @NotNull
        Long userId,
        @NotNull
        Long loanId
) {

}
