package com.jefferson.bookfly_api.strategy.pdf;

import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.jefferson.bookfly_api.models.Penalty;

import java.time.format.DateTimeFormatter;

public class PenaltyPdfStrategy implements IPdfReportStrategy<Penalty> {
    @Override
    public String getTitle() {
        return "Relatório de Multas";
    }

    @Override
    public String[] getHeaders() {
        return new String[]{
                "ID",
                "ID USUÁRIO",
                "USUARIO",
                "lIVRO",
                "STATUS DA MULTA",
                "DIA DA MULTA",
                "DIA DE CRIAÇÃO DO EMPRÉSTIMO",
                "DIA DE ENTREGA DO EMPRESTIMO",
                "DIA DO RETORNO DO LIVRO",
                "VALOR",
        };
    }

    @Override
    public String[] getRow(Penalty penalty) {
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return new String[]{
                String.valueOf(penalty.getId()),
                String.valueOf(penalty.getLoan().getUser().getId()),
                penalty.getLoan().getUser().getName(),
                penalty.getLoan().getStockBook().getBook().getTitle(),
                String.valueOf(penalty.getStatus()),
                penalty.getPenaltyDate().format(formatter),
                penalty.getLoan().getLoanDate().format(formatter),
                penalty.getLoan().getReturnDate().format(formatter),
                penalty.getPayedDate() != null ? penalty.getPayedDate().format(formatter) : "Ainda Não Pago",
                penalty.getAmount() != null ? String.valueOf(penalty.getAmount()) : "||"
        };
    }
}
