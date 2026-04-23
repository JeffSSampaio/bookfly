package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.Gender;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Dictionary;
import java.util.List;
import java.util.Map;

@Schema(name = "BookDTO")
public record BookResponseDTO(
        @Schema(description = "identificador do livro")
        Long id,
        @Schema(description = "capa do livro/imagem")
        String cover,
        @Schema(description = "titulo do livro")
        String title,
        @Schema(description = "Autores do livro")
        List<AuthorResponseDTO> authors,
        @Schema(description = "Quantidade disponivel no Estoque")
        int qtd,
        @Schema(description = "generos do livro")
        List<Gender> genders
) {


}
