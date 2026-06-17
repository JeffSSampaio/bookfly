package com.jefferson.bookfly_api.dto.stockbook;

import com.jefferson.bookfly_api.dto.book.BookDetail;
import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.models.Book;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Schema(description = "Dados para requisição de livros com quantdiade para o estoque")
public record StockBookRequest(
        @NotNull
        @Schema(description = "Identificador do livro registrado")
        Long bookId,
        @Schema(description = "Idenficador do Usuario que registrou o livro")
        Long userId,
        @NotNull
        @Schema(description = "Quantdiade do livro no estoque")
        int qtd

) {

}
