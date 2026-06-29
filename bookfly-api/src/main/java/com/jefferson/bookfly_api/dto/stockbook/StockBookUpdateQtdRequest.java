package com.jefferson.bookfly_api.dto.stockbook;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Atualizar quantidade em estoque")
public record StockBookUpdateQtdRequest(
        @Schema(description = "quantidade de livro a repor")
        @NotNull
        int qtd,
        @Schema(description = "Usuario que fez a movimentação")
        Long userId,

        String description
) {
}
