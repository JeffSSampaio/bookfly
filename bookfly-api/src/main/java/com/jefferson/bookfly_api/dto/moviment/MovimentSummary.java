package com.jefferson.bookfly_api.dto.moviment;

import com.jefferson.bookfly_api.dto.book.BookMovimentSummary;
import com.jefferson.bookfly_api.dto.book.BookSummary;
import com.jefferson.bookfly_api.dto.loan.LoanSummary;
import com.jefferson.bookfly_api.dto.stockbook.StockBookSummary;
import com.jefferson.bookfly_api.dto.user.UserMovimentSummary;
import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.Moviment;

import java.time.LocalDateTime;

public record MovimentSummary(
        Long movimentId,
        int qtdMoved,
        LocalDateTime createdTime,
        TypeMoviment type,
        String description,
        UserMovimentSummary user,
        BookMovimentSummary book,
        RecordStatusValue recordStatus,
        LocalDateTime recordDateTime


) {
    public static MovimentSummary from(Moviment moviment){
        return new MovimentSummary(
                moviment.getId(),
                moviment.getQtdMoviment(),
                moviment.getCreatedTime(),
                moviment.getTypeItem(),
                moviment.getDescription(),
                UserMovimentSummary.from(moviment.getUser()),
                BookMovimentSummary.from(moviment.getStockBook().getBook()),
                moviment.getRecordStatus().getRecordStatusValue(),
                moviment.getRecordStatus().getDateTime()

        );
    }
}
