package com.jefferson.bookfly_api.dto.loan;

import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.enums.StatusLoan;

import java.time.LocalDateTime;

public record LoanUpdateRequest(

        Long userId,
        Long stockBookId,
        LocalDateTime loanDate,
        LocalDateTime returnDate,
        Long penaltyId,
        StatusLoan status

) {
}
