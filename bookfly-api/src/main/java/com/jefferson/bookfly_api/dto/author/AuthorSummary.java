package com.jefferson.bookfly_api.dto.author;

import com.jefferson.bookfly_api.models.Author;

public record AuthorSummary(
        Long id,
        String name
) {
    public static AuthorSummary from(Author author){
        return new AuthorSummary(
                author.getId(),
                author.getName()
        );
    }
}
