package com.jefferson.bookfly_api.dto.moviment;

import com.jefferson.bookfly_api.dto.book.BookMovimentSummary;
import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.dto.loan.LoanSummary;
import com.jefferson.bookfly_api.dto.stockbook.StockBookSummary;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.Moviment;

public record MovimentSummary(
        Long movimentId,
        int qtdMoved,
        TypeMoviment type,
        UserMovimentSummary user,
        BookMovimentSummary book

) {
    public static MovimentSummary from(Moviment moviment){
        return new MovimentSummary(
                moviment.getId(),
                moviment.getQtdMoviment(),
                moviment.getTypeItem(),
                UserMovimentSummary.from(moviment.getUser()),
                BookMovimentSummary.from(moviment.getStockBook().getBook())
        );
    }
}
