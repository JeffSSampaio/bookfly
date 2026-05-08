package com.jefferson.bookfly_api.dto.moviment;

import com.jefferson.bookfly_api.enums.TypeMoviment;

public record MovimentUpdateRequest(
        Long userId,
        TypeMoviment typeItem,
        String description,
        Integer qtdMoviment
) {
}
