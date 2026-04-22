package com.jefferson.bookfly_api.dto;



import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name= "StockDTO")
public record StockDTO(
    @Schema(description = "Identificador do livro")
    int book_id,
    @Schema(description = "Titulo do Livro")
    String book_title,
    @Schema(description = "Autores do livro")
    List<String> authors ,
    @Schema(description = "Quantidade disponivel no stcok")
    int qtd_Stock
) { }
