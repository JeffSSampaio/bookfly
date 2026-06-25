package com.jefferson.bookfly_api.dto.stockbook;

import com.jefferson.bookfly_api.dto.author.AuthorSummary;
import com.jefferson.bookfly_api.dto.book.BookDetail;
import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.models.StockBook;

import java.time.LocalDateTime;
import java.util.List;

public record StockBookSummary(
        Long stockId,
        BookSummary book,
        int qtd,
        RecordStatusValue recordStatus,
        LocalDateTime recordDateTime

) {
    public static StockBookSummary from(StockBook stockBook){
        return new StockBookSummary(
          stockBook.getId(),
           BookSummary.from(stockBook.getBook()),
                stockBook.getQtd(),
                stockBook.getRecordStatus().getRecordStatusValue(),
                stockBook.getRecordStatus().getDateTime()
        );
    }
}
