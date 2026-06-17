package com.jefferson.bookfly_api.dto.moviment;

import com.jefferson.bookfly_api.dto.loan.LoanSummary;
import com.jefferson.bookfly_api.dto.user.UserDetail;
import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.Moviment;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MovimentDetail(

        Long id,
        Long stockId,
        TypeMoviment type,
        int qtdMoviment,
        LocalDateTime createdTime,
        UserSummary user

) {

    public static MovimentDetail from(Moviment moviment) {
        return new MovimentDetail(
                moviment.getId(),
                moviment.getStockBook().getStock().getId(),
                moviment.getTypeItem(),
                moviment.getQtdMoviment(),
                moviment.getCreatedTime(),
                UserSummary.from(moviment.getUser())
        );
    }
}