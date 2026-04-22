package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.models.Book;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name = "AuthorDTO")
public record AuthorDTO(
        @Schema(description = " identificador do id")
        Long author_id,
        @Schema(description = "nome do autor")
        String nameAuthor,
        @Schema(description = "nome do livro")
        List<Book> books
) {}
