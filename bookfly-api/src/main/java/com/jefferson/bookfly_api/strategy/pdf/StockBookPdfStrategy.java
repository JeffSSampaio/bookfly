package com.jefferson.bookfly_api.strategy.pdf;

import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.jefferson.bookfly_api.models.StockBook;

public class StockBookPdfStrategy implements IPdfReportStrategy<StockBook> {
    @Override
    public String getTitle() {
        return "Relatorio de Livros ";
    }

    @Override
    public String[] getHeaders() {
        return new String[]{
                "ID",
                "ID DO ESTOQUE",
                "LIVRO",
                "QUANTIDADE NO ESTOQUE"

        };
    }

    @Override
    public String[] getRow(StockBook stockBook) {
        return new String[]{
               String.valueOf(stockBook.getId()),
                String.valueOf(stockBook.getStock().getId()),
                stockBook.getBook().getTitle(),
                String.valueOf(stockBook.getQtd())
        };
    }
}
