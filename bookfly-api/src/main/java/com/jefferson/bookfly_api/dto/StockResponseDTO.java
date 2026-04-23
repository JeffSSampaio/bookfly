package com.jefferson.bookfly_api.dto;



import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(name= "StockDTO")
public record StockResponseDTO(
    List<BookResponseDTO> booksOnStock
) { }
