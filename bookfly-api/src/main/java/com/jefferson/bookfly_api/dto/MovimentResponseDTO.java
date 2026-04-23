package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "MovimentDTO")
public record MovimentResponseDTO(
        @Schema(description = "Identificador de Movimentação")
        Long moviment_id,
        @Schema(description = "Tipo de Movimentação", examples = {"ENTRADA","SAÍDA"})
        TypeMoviment typeMoviment,
        @Schema(description = "Livro")
        BookResponseDTO book
) { }
