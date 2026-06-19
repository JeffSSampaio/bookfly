package com.jefferson.bookfly_api.dto.book;

import com.jefferson.bookfly_api.dto.author.AuthorSummary;
import com.jefferson.bookfly_api.models.Book;

import java.util.List;

public record BookSummaryPrincipal(Long bookId, String title , List<AuthorSummary> authors) {
    public static BookSummaryPrincipal from(Book book){
            return new BookSummaryPrincipal(
                    book.getId(),
                    book.getTitle(),
                    book.getAuthors().stream().map(AuthorSummary::from).toList()
            );
    }
}
