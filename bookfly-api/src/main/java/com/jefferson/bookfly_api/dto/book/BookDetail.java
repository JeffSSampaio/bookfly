package com.jefferson.bookfly_api.dto.book;

import com.jefferson.bookfly_api.dto.author.AuthorSummary;
import com.jefferson.bookfly_api.enums.Gender;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;

import java.time.LocalDateTime;
import java.util.List;

public record BookDetail(
       Long bookId,
       String title,
       String cover,
       String summary,
       List<AuthorSummary> authors,
       List<Gender> genders,
       RecordStatusValue recordStatus,
       LocalDateTime recordDateTime
) {

    public static BookDetail from(Book book){
        return new BookDetail(
                book.getId(),
                book.getTitle(),
                book.getCover(),
                book.getSummary(),
                book.getAuthors().stream().map(AuthorSummary::from).toList(),
                book.getGenders(),
                book.getRecordStatus().getRecordStatusValue(),
                book.getRecordStatus().getDateTime()
        );
    }

}
