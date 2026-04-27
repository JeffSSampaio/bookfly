package com.jefferson.bookfly_api.dto.book;

import com.jefferson.bookfly_api.dto.author.AuthorSummary;
import com.jefferson.bookfly_api.models.Book;

import java.util.List;

public record BookMovimentSummary(
        Long bookId,
        String title,
        List<AuthorSummary> authors
) {
    public static BookMovimentSummary from(Book book){
        return new BookMovimentSummary(
                book.getId(),
                book.getTitle(),
                book.getAuthors().stream().map(AuthorSummary::from).toList()
        );
    }
}
