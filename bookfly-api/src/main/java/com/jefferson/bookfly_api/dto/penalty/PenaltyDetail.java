package com.jefferson.bookfly_api.dto.penalty;

import com.jefferson.bookfly_api.dto.book.BookSummaryPrincipal;
import com.jefferson.bookfly_api.dto.loan.LoanByUserBooksSumary;
import com.jefferson.bookfly_api.dto.loan.LoanUserBookSumary;
import com.jefferson.bookfly_api.dto.user.UserDetail;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.dto.user.UserSummaryPrincipal;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.models.Penalty;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PenaltyDetail(
        Long penaltyId,
        StatusPenalty statusPenalty,
        BookSummaryPrincipal book,
        UserSummaryPrincipal user,
        BigDecimal amount,
        LocalDateTime penaltyDate,
        LocalDateTime payedDate,
        RecordStatusValue recordStatus,
        LocalDateTime recordDateTime

) {
    public static PenaltyDetail from(Penalty penalty){
        return new PenaltyDetail(
                penalty.getId(),
                penalty.getStatus(),
                BookSummaryPrincipal.from(penalty.getLoan().getStockBook().getBook()),
                UserSummaryPrincipal.from(penalty.getLoan().getUser()),
                penalty.getAmount(),
                penalty.getPenaltyDate(),
                penalty.getPayedDate(),
                penalty.getRecordStatus().getRecordStatusValue(),
                penalty.getRecordStatus().getDateTime()
        );
    }
}
