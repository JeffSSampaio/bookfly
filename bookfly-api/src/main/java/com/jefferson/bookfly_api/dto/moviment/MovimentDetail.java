package com.jefferson.bookfly_api.dto.moviment;

import com.jefferson.bookfly_api.dto.loan.LoanSummary;
import com.jefferson.bookfly_api.dto.user.UserDetail;
import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.Moviment;

import java.time.LocalDate;

public record MovimentDetail(

        Long id,
        Long stockId,
        TypeMoviment type,
        int qtd,
        LocalDate createdDate,
        UserSummary user

) {

    public static MovimentDetail from(Moviment moviment) {
        return new MovimentDetail(
                moviment.getId(),
                moviment.getStockBook().getStock().getId(),
                moviment.getTypeItem(),
                moviment.getQtd(),
                moviment.getCreatedDate(),
                UserSummary.from(moviment.getUser())
        );
    }
}