package com.jefferson.bookfly_api.dto.bookcase;

public record BookcaseUpdateRequest(
        String name,
        Long stockBookId
) {}