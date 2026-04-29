package com.jefferson.bookfly_api.dto.loan;

import com.jefferson.bookfly_api.dto.book.BookMovimentSummary;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.models.Loan;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LoanByUserBooksSumary(
        Long loanId,
        LocalDateTime loanDate,
        LocalDateTime returnDate,
        StatusLoan statusLoan,
        BookMovimentSummary book

) {
    public static LoanByUserBooksSumary from(Loan loan){
        return new LoanByUserBooksSumary(
                loan.getId(),
                loan.getLoanDate(),
                loan.getReturnDate(),
                loan.getStatus(),
                BookMovimentSummary.from(loan.getStockBook().getBook())
        );
    }
}
