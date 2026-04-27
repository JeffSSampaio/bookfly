package com.jefferson.bookfly_api.dto.moviment;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MovimentQtdRequest(

        @Schema(description = "ID do livro", example = "1")
        @NotNull
        Long bookId,
        @Schema(description = "ID do usuário")
        @NotNull
        Long userId,

        @Schema(description = "Quantidade de itens", examples = { "2", "-2"  })
        @NotNull
        Integer qtd
) {

}
