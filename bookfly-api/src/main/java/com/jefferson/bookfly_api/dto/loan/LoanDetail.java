package com.jefferson.bookfly_api.dto.loan;

import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.models.Loan;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LoanDetail(
        Long id,
        String bookTitle,
        LocalDateTime loanDate,
        LocalDateTime returnDate,
        StatusLoan status,
        UserSummary user
) {
    public static LoanDetail from(Loan loan){
        return new LoanDetail(
                loan.getId(),
                loan.getStockBook().getBook().getTitle(),
                loan.getLoanDate(),
                loan.getReturnDate(),
                loan.getStatus(),
                UserSummary.from(loan.getUser())
        );
    }
}
