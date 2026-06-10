package com.jefferson.bookfly_api.strategy.pdf;

import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.jefferson.bookfly_api.models.User;

public class UserPdfStrategy implements IPdfReportStrategy<User> {
    @Override
    public String getTitle() {
        return "Relatório de Usuários";
    }

    @Override
    public String[] getHeaders() {
        return new String[]{
                "ID",
                "NOME",
                "EMAIL",
                "TIPO DE USUÁRIO",
                "ESTADO",
                "DATA/HORA DE ESTADO"
        };
    }

    @Override
    public String[] getRow(User user) {
        return new String[]{
                String.valueOf(user.getId()),
                user.getName(),
                user.getEmail(),
                String.valueOf(user.getRecordStatus().getRecordStatusValue()),
                String.valueOf(user.getRecordStatus().getDateTime())
        };
    }
}
