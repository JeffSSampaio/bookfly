package com.jefferson.bookfly_api.dto.book;

import com.jefferson.bookfly_api.dto.author.AuthorSummary;
import com.jefferson.bookfly_api.models.Book;

import java.util.List;

public record BookSummary(Long bookId, String title ,String cover, String summary, List<AuthorSummary> authors) {
    public static  BookSummary from(Book book){
            return new BookSummary(
                    book.getId(),
                    book.getTitle(),
                    book.getCover(),
                    book.getSummary(),
                    book.getAuthors().stream().map(AuthorSummary::from).toList()
            );
    }
}
