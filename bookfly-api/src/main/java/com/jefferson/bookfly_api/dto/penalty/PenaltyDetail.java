package com.jefferson.bookfly_api.dto.penalty;

import com.jefferson.bookfly_api.dto.loan.LoanByUserBooksSumary;
import com.jefferson.bookfly_api.dto.loan.LoanUserBookSumary;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.models.Penalty;

import java.time.LocalDateTime;

public record PenaltyDetail(
        Long penaltyId,
        StatusPenalty statusPenalty,
        Long userId,
        String userName,
        LocalDateTime loanDate,
        LocalDateTime returnDate,
        StatusLoan statusLoan

) {
    public static PenaltyDetail from(Penalty penalty){
        return new PenaltyDetail(
                penalty.getId(),
                penalty.getStatus(),
                penalty.getLoan().getUser().getId(),
                penalty.getLoan().getUser().getName(),
                penalty.getLoan().getLoanDate(),
                penalty.getLoan().getReturnDate(),
                penalty.getLoan().getStatus()
        );
    }
}
