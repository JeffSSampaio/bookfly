package com.jefferson.bookfly_api.dto.book;

import com.jefferson.bookfly_api.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Schema(description = "Dados para criação de um livro")
public record BookUpdateRequest(

        @Schema(description = "Título do livro")
        String title,

        @Schema(description = "URL da capa")
        String cover,

        @Schema(description = "Lista de autores")
        List<String> authors,

        @Schema(description = "Gêneros do livro")
        List<Gender> genders
) {
}
