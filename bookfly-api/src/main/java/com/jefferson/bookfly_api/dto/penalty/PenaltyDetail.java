package com.jefferson.bookfly_api.dto.penalty;

import com.jefferson.bookfly_api.dto.loan.LoanByUserBooksSumary;
import com.jefferson.bookfly_api.dto.loan.LoanUserBookSumary;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.models.Penalty;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PenaltyDetail(
        Long penaltyId,
        StatusPenalty statusPenalty,
        Long userId,
        String userName,
        BigDecimal amount,
        LocalDateTime penaltyDate,
        LocalDateTime returnLoanDate,
        StatusLoan statusLoan

) {
    public static PenaltyDetail from(Penalty penalty){
        var loan = penalty.getLoan();
        return new PenaltyDetail(
                penalty.getId(),
                penalty.getStatus(),
                penalty.getLoan().getUser().getId(),
                penalty.getLoan().getUser().getName(),
                penalty.getAmount(),
                penalty.getPenaltyDate(),
                penalty.getPayedDate(),
                loan != null ? loan.getStatus() : null
        );
    }
}
