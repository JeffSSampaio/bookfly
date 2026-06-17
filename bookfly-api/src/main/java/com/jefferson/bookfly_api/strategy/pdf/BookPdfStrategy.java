package com.jefferson.bookfly_api.strategy.pdf;

import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.jefferson.bookfly_api.models.Book;


import java.util.stream.Collectors;


public class BookPdfStrategy implements IPdfReportStrategy<Book> {
    @Override
    public String getTitle() {
        return "Relatório de Livros";
    }

    @Override
    public String[] getHeaders() {
        return new String[]{
                "ID",
                "TITULO",
                "AUTORES",

        };
    }


    @Override
    public String[] getRow(Book book) {
       String authors = book.getAuthors()
               .stream()
               .map(author -> author.getName())
               .collect(Collectors.joining(", "));
        return new String[]{
                String.valueOf(book.getId()),
                book.getTitle(),
                authors
        };
    }
}
