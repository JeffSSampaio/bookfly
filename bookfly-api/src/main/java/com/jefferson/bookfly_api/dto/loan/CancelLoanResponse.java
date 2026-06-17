package com.jefferson.bookfly_api.dto.loan;

import com.jefferson.bookfly_api.models.Moviment;

public record CancelLoanResponse(
        Long userId,
        String description,
        Long movimentId,
        Long canceledLoanId
) {
    public static CancelLoanResponse from(Long loanId, Moviment moviment){
        return new CancelLoanResponse(
                moviment.getUser().getId(),
                moviment.getDescription(),
                moviment.getId(),
                loanId
        );
    }
}
