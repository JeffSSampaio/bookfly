package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MovimentDTO")
public record MovimentDTO(
        @Schema(description = "Identificador de Movimentação")
        Long moviment_id,
        @Schema(description = "Tipo de Movimentação", examples = {"ENTRADA","SAÍDA"})
        TypeMoviment typeMoviment,
        @Schema(description = "Identificação de livro")
        Long book_id,
        @Schema(description = "Titulo do Livro")
        String book_title
) { }
