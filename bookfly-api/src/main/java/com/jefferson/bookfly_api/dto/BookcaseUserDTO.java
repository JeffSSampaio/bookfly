package com.jefferson.bookfly_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.Map;

public record BookcaseUserDTO(
        @Schema(description = "Id do Usuario")
        Long user_id,
        @Schema(description = "Nome do Usuario")
        String user_name,
        @Schema(description = "Nome da Estante")
        String name_bookcase,
        @Schema(description = "Livros dessa Estante")
        List<Map<Integer,String>> books

) {

}
