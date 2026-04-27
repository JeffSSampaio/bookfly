package com.jefferson.bookfly_api.dto.moviment;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MovimentRequest(

        @Schema(description = "ID do livro", example = "1")
        @NotNull
        Long bookId,

        @Schema(description = "ID do usuário")
        @NotNull
        Long userId,

        @Schema(description = "Tipo da movimentação (ENTRADA ou SAIDA)", example = "SAIDA")
        @NotNull
        TypeMoviment typeItem,

        @Schema(description = "Quantidade de itens", example = "2")
        @NotNull
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer qtd
) {}