package com.jefferson.bookfly_api.dto.stockbook;

import com.jefferson.bookfly_api.dto.book.BookMovimentSummary;
import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.models.StockBook;

public record StockBookUpdateQtdSummary(
        Long stockBookId,
        int qtdCurrent,
        int qtdUpdated,
        String type,
        BookMovimentSummary book


) {
    public static  StockBookUpdateQtdSummary from(StockBook stockBook, int qtdAlterada, String type, Long userId){
        return new StockBookUpdateQtdSummary(
                stockBook.getId(),
                stockBook.getQtd(),
                qtdAlterada,
                type,
                BookMovimentSummary.from(stockBook.getBook())

        );
    }
}
