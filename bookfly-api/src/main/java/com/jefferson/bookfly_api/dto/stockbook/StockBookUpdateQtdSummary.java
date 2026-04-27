package com.jefferson.bookfly_api.dto.stockbook;

import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.models.StockBook;

public record StockBookUpdateQtdSummary(
        BookSummary book,
        Long stockBookId,
        int qtdCurrent,
        int qtdUpdated,
        String type
) {
    public static  StockBookUpdateQtdSummary from(StockBook stockBook, int qtdAlterada, String type){
        return new StockBookUpdateQtdSummary(
                BookSummary.from(stockBook.getBook()),
                stockBook.getId(),
                stockBook.getQtd(),
                qtdAlterada,
                type

        );
    }
}
