package com.jefferson.bookfly_api.dto.stockbook;

import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.models.StockBook;

public record StockBookDetail(
        Long id,
        Long stockId,
        BookSummary book,
        int qtd
) {
    public static StockBookDetail from(StockBook stockBook) {
        return new StockBookDetail(
                stockBook.getId(),
                stockBook.getStock().getId(),
                BookSummary.from(stockBook.getBook()),
                stockBook.getQtd()
        );
    }
}
