package com.jefferson.bookfly_api.dto.penalty;

import com.jefferson.bookfly_api.dto.loan.LoanByUserBooksSumary;
import com.jefferson.bookfly_api.dto.loan.LoanUserBookSumary;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.models.Penalty;

public record PenaltyDetail(
        Long penaltyId,
        StatusPenalty statusPenalty,
        UserMovimentSummary user,
        LoanByUserBooksSumary loan

) {
    public static PenaltyDetail from(Penalty penalty){
        return new PenaltyDetail(
                penalty.getId(),
                penalty.getStatus(),
                UserMovimentSummary.from(penalty.getLoan().getUser()),
                LoanByUserBooksSumary.from(penalty.getLoan())
        );
    }
}
