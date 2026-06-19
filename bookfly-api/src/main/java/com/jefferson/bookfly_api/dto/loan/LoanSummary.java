package com.jefferson.bookfly_api.dto.loan;

import com.jefferson.bookfly_api.dto.book.BookSummaryPrincipal;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.enums.StatusLoan;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LoanSummary(
        Long id,
        BookSummaryPrincipal book,
        UserMovimentSummary user,
        LocalDateTime loanDate,
        LocalDateTime returnDate,
        StatusLoan status
) {

    public static LoanSummary from(Loan loan) {
        return new LoanSummary(
                loan.getId(),
                BookSummaryPrincipal.from(loan.getStockBook().getBook()),
                UserMovimentSummary.from(loan.getUser()),
                loan.getLoanDate(),
                loan.getReturnDate(),
                loan.getStatus()
        );
    }
}