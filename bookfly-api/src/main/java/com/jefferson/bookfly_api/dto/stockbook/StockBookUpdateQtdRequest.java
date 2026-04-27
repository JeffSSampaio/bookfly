package com.jefferson.bookfly_api.dto.stockbook;

public record StockBookUpdateQtdRequest(
        Long bookId,
        int qtd
) {
}
