package com.jefferson.bookfly_api.strategy.pdf;

import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.jefferson.bookfly_api.models.Loan;

import java.time.format.DateTimeFormatter;

public class LoanPdfStrategy implements IPdfReportStrategy<Loan> {
    @Override
    public String getTitle() {
        return "Relatório de Empréstimos";
    }

    @Override
    public String[] getHeaders() {
        return new String[]{
                "ID",
                "ID USUÁRIO",
                "USUÁRIO",
                "LIVRO EMPRÉSTADO",
                "DIA DA CRIAÇÃO DO EMPRÉSTIMO",
                "DIA DO RETORNO DO LIVRO",
                "STATUS"
        };
    }

    @Override
    public String[] getRow(Loan loan) {
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return new String[]{
                String.valueOf(loan.getId()),
                String.valueOf(loan.getUser().getId()),
                loan.getUser().getName(),
                loan.getStockBook().getBook().getTitle(),
                loan.getLoanDate().format(formatter),
                loan.getReturnDate().format(formatter),
                String.valueOf(loan.getStatus())
        };
    }
}
