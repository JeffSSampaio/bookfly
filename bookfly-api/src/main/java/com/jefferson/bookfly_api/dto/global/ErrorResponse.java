package com.jefferson.bookfly_api.dto.global;


import java.time.LocalDateTime;

public record ErrorResponse(

        LocalDateTime timestamp,
        Integer status,
        String error,
        String message,

        String method,
        String path,

        String origin

) {
}