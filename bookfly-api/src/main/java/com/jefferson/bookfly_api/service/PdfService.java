package com.jefferson.bookfly_api.service;


import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.StockBook;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfService {

    public void export(HttpServletResponse response, List<Book> books) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document,response.getOutputStream());
        document.open();
        document.add(new Paragraph("Relatório de Livros"));

        PdfPTable table = new PdfPTable(4);
        table.addCell("ID");
        table.addCell("Titulo");
        table.addCell("Autor");
        table.addCell("Status");

        for (Book book : books){

            String authors = book.getAuthors().stream()
                    .map(author -> author.getName())
                    .collect(Collectors.joining(", "));

            table.addCell(String.valueOf(book.getId()));
            table.addCell(book.getTitle());
            table.addCell(authors);
        }

        document.add(table);
        document.close();

    }

//    public void export(HttpServletResponse response, List<StockBook> stockBooks) throws IOException{
//
//
//    }

}
