package com.jefferson.bookfly_api.dto.author;

import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;

import java.time.LocalDateTime;
import java.util.List;

public record AuthorDetail(
        Long id,
        String name,
        List<BookSummary>books,
        RecordStatusValue recordStatus,
        LocalDateTime recordDateTime
) {
    public static AuthorDetail from(Author author){
        return new AuthorDetail(
                author.getId(),
                author.getName(),
                author.getBooks().stream().map(BookSummary::from).toList(),
                author.getRecordStatus().getRecordStatusValue(),
                author.getRecordStatus().getDateTime()
        );
    }
}
