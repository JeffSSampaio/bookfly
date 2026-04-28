package com.jefferson.bookfly_api.dto.loan;

import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.enums.StatusLoan;

import java.time.LocalDate;

public record LoanSummary(
        Long id,
        String bookTitle,
        LocalDate loanDate,
        LocalDate returnDate,
        StatusLoan status
) {

    public static LoanSummary from(Loan loan) {
        return new LoanSummary(
                loan.getId(),
                loan.getStockBook().getBook().getTitle(),
                loan.getLoanDate(),
                loan.getReturnDate(),
                loan.getStatus()
        );
    }
}