package com.jefferson.bookfly_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;
@Schema(name = "BookcaseUserResponseDTO")
public record BookcaseUserResponseDTO(
        @Schema(description = "Id do Usuario")
        UserResponseDTO user,
        @Schema(description = "Nome da Estante")
        String name_bookcase,
        @Schema(description = "Livros dessa Estante")
        List<BookcaseResponseDTO> bookcases

) {

}
