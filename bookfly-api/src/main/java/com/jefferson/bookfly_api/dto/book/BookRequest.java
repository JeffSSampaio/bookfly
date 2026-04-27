package com.jefferson.bookfly_api.dto.book;

import com.jefferson.bookfly_api.enums.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
@Schema(description = "Dados para criação de um livro")
public record BookRequest(
        @Schema(description = "Identificador de Livro")
        Long bookId,
        @Schema(description = "Título do livro")
        @NotBlank(message = "Título é obrigatório")
        String title,

        @Schema(description = "URL da capa")
        @NotBlank(message = "Cover é obrigatória")
        String cover,

        @Schema(description = "Lista de autores")
        @NotEmpty(message = "Deve ter pelo menos um autor")
        List<String> authors,

        @Schema(description = "Gêneros do livro")
        @NotEmpty(message = "Deve ter pelo menos um gênero")
        List<Gender> genders
) {
}
