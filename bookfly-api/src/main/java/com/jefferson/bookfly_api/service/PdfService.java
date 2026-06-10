package com.jefferson.bookfly_api.service;


import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.StockBook;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfService {

   public <T> void export(
           HttpServletResponse response,
           List<T> items,
           IPdfReportStrategy<T> strategy
            ) throws IOException {
       Document document = new Document(PageSize.A4);
       PdfWriter.getInstance(
               document,
               response.getOutputStream()
       );
       document.open();

       String title = strategy.getTitle();

       document.add(
               new Paragraph(title)
       );

       String[] headers = strategy.getHeaders();
       PdfPTable table = new PdfPTable(headers.length);
       for(String header : headers){
           table.addCell(header);
       };

       for(T item : items){
           String[] row = strategy.getRow(item);
           for(String value : row){
             table.addCell(value);
           }
       }
       document.add(table);

       document.close();

   }

}
