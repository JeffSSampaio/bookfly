package com.jefferson.bookfly_api.dto.bookcase;

import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.models.Bookcase;

import java.util.List;

public record BookcaseResponse(
        Long id,
        String name,
        UserMovimentSummary user,
        List<BookSummary> books
) {
    public static BookcaseResponse from(Bookcase bookcase) {
        return new BookcaseResponse(
                bookcase.getId(),
                bookcase.getName(),
                UserMovimentSummary.from(bookcase.getUser()),
                bookcase.getStockBooks().stream()
                        .map(sb -> BookSummary.from(sb.getBook()))
                        .toList()
        );
    }
}