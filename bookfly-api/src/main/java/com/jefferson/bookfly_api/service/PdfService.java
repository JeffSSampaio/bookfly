package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.interfaces.IPdfReportStrategy;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    public <T> void export(
            HttpServletResponse response,
            List<T> items,
            IPdfReportStrategy<T> strategy
    ) throws IOException {

        response.setContentType("application/pdf");

        Document document = new Document(
                PageSize.A4,
                30,
                30,
                30,
                30
        );

        PdfWriter.getInstance(
                document,
                response.getOutputStream()
        );

        document.open();

        Font titleFont = new Font(
                Font.HELVETICA,
                18,
                Font.BOLD
        );

        Paragraph title = new Paragraph(
                strategy.getTitle(),
                titleFont
        );

        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);

        document.add(title);

        String[] headers = strategy.getHeaders();

        PdfPTable table = new PdfPTable(headers.length);

        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        for (String header : headers) {
            table.addCell(createHeaderCell(header));
        }

        for (T item : items) {

            String[] row = strategy.getRow(item);

            for (String value : row) {
                table.addCell(
                        createDataCell(
                                value == null ? "" : value
                        )
                );
            }
        }

        document.add(table);

        Font footerFont = new Font(
                Font.HELVETICA,
                10,
                Font.ITALIC
        );

        String generatedAt =
                LocalDateTime.now()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "dd/MM/yyyy HH:mm:ss"
                                )
                        );

        Paragraph footer = new Paragraph(
                "Gerado em: " + generatedAt,
                footerFont
        );

        footer.setAlignment(Element.ALIGN_RIGHT);

        document.add(footer);

        document.close();
    }

    private PdfPCell createHeaderCell(String text) {

        Font font = new Font(
                Font.HELVETICA,
                9,
                Font.BOLD,
                Color.WHITE
        );

        PdfPCell cell = new PdfPCell(
                new Phrase(text, font)
        );

        cell.setBackgroundColor(
                new Color(52, 73, 94)
        );

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER
        );

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        cell.setPadding(8);

        return cell;
    }

    private PdfPCell createDataCell(String text) {

        Font font = new Font(
                Font.HELVETICA,
                11,
                Font.NORMAL
        );

        PdfPCell cell = new PdfPCell(
                new Phrase(text, font)
        );

        cell.setPadding(6);

        cell.setHorizontalAlignment(
                Element.ALIGN_LEFT
        );

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE
        );

        return cell;
    }
}