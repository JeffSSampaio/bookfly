package com.jefferson.bookfly_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;
@Schema(name = "BookcaseResponseDTO")
public record BookcaseResponseDTO(
        Long id,
        @Schema(description = "nome da Estante")
        String name,
        @Schema(description = "Livros da Estante")
        List<BookResponseDTO> books

) {
}
