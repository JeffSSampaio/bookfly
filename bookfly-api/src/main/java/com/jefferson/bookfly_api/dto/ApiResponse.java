package com.jefferson.bookfly_api.dto;

import java.time.LocalDate;
import java.util.Optional;

public record ApiResponse(
        LocalDate date,
        Optional<Object> data
) {
}
