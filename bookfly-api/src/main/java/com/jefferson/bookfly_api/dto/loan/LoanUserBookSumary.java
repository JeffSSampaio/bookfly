package com.jefferson.bookfly_api.dto.loan;

import com.jefferson.bookfly_api.dto.book.BookMovimentSummary;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.models.Loan;

import java.time.LocalDate;

public record LoanUserBookSumary(
        Long loanId,
        LocalDate loanDate,
        LocalDate returnDate,
        StatusLoan statusLoan,
        BookMovimentSummary book,
        UserMovimentSummary user

) {
    public static LoanUserBookSumary from(Loan loan){
        return new LoanUserBookSumary(
                loan.getId(),
                loan.getLoanDate(),
                loan.getReturnDate(),
                loan.getStatus(),
                BookMovimentSummary.from(loan.getStockBook().getBook()),
                UserMovimentSummary.from(loan.getUser())
        );
    }
}
