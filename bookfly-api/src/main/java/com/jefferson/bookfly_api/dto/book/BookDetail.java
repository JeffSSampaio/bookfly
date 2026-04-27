package com.jefferson.bookfly_api.dto.book;

import com.jefferson.bookfly_api.dto.author.AuthorSummary;
import com.jefferson.bookfly_api.enums.Gender;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;

import java.util.List;

public record BookDetail(
       Long bookid,
       String title,
       String cover,
       List<AuthorSummary> authors,
       List<Gender> genders
) {

    public static BookDetail from(Book book){
        return new BookDetail(
                book.getId(),
                book.getTitle(),
                book.getCover(),
                book.getAuthors().stream().map(AuthorSummary::from).toList(),
                book.getGenders()
        );
    }

}
