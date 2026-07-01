package com.jefferson.bookfly_api.dto.author;

import com.jefferson.bookfly_api.enums.RecordStatusValue;

import java.time.LocalDateTime;

public record AuthorRequest(
        String name,
        RecordStatusValue recordStatusValue,
        LocalDateTime recordDateTime
) {

}
