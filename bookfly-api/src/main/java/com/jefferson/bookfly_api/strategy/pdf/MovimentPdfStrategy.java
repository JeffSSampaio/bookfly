package com.jefferson.bookfly_api.strategy.pdf;

import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.jefferson.bookfly_api.models.Moviment;

import java.time.format.DateTimeFormatter;

public class MovimentPdfStrategy implements IPdfReportStrategy<Moviment> {
    @Override
    public String getTitle() {
        return "Relatório de Movimentação";
    }

    @Override
    public String[] getHeaders() {
        return new String[]{
                "ID",
                "ID USUÁRIO",
                "USUÁRIO",
                "TIPO",
                "QUANTIDADE",
                "DESCRIÇÃO",
                "DATA DE CRIAÇÃO"

        };
    }

    @Override
    public String[] getRow(Moviment moviment) {
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return new String[]{
                String.valueOf(moviment.getId()),
                String.valueOf(moviment.getUser().getId()),
                moviment.getUser().getName(),
                String.valueOf(moviment.getTypeItem()),
                String.valueOf(moviment.getQtdMoviment()),
                moviment.getDescription(),
                moviment.getCreatedTime().format(formatter)
        };
    }
}
