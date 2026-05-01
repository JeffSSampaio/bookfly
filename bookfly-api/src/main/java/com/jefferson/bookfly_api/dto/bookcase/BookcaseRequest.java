package com.jefferson.bookfly_api.dto.bookcase;

public record BookcaseRequest(
        String name,
        Long userId,
        Long stockBookId
) {}
 