package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.dto.stockbook.*;
import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.service.PdfService;
import com.jefferson.bookfly_api.service.StockBookService;
import com.jefferson.bookfly_api.strategy.pdf.StockBookPdfStrategy;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@Tag(name = "Estoque", description = "Gerenciamento do estoque de livros")
public class StockBookController {

    private final StockBookService stockBookService;
    private final PdfService pdfService;

    @Operation(summary = "Listar numeros de StockBook ")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/list")
    public ResponseEntity<Page<StockBookSummary>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search
    ){
        Sort.Direction dir = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page,size,Sort.by(dir,sort));
        Page <StockBook> stockBooks = stockBookService.findAll(search,pageable);
        Page<StockBookSummary> response = stockBooks.map(StockBookSummary::from);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar todos os livros no estoque")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/list-all")
    public ResponseEntity<List<StockBookSummary>> getAllBooksOnStock() {

        return ResponseEntity.ok(
                stockBookService.findAllActive()
                        .stream()
                        .map(StockBookSummary::from)
                        .toList()
        );
    }

    @Operation(summary = "Buscar livro específico no estoque")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Livro encontrado no estoque"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado no estoque")
    })
    @GetMapping("/book/{bookId}")
    public ResponseEntity<StockBookSummary> getBookOnStock(@PathVariable Long bookId) {

        StockBook stockBook = stockBookService.findByBook(bookId);

        return ResponseEntity.ok(
                StockBookSummary.from(stockBook)
        );
    }

    @Operation(summary = "Adicionar livro ao estoque")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Livro adicionado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição")
    })
    @PostMapping("/addbook")
    public ResponseEntity<StockBookSummary> addbookOnStock(
            @RequestBody @Valid StockBookRequest request
    ) {
        StockBook bookOnStockAdded = stockBookService.addBookOnStock(request.bookId(), request.userId(), request.qtd());

        return ResponseEntity.ok(
                StockBookSummary.from(bookOnStockAdded)
        );
    }

    @Operation(summary = "Remover livro do estoque (zerar quantidade)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Livro removido do estoque"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado")
    })
    @DeleteMapping("/remove/{bookId}")
    public ResponseEntity<Void> removeBookFromStock(@PathVariable Long bookId, Long userId) {

        stockBookService.removeBookOnStock(bookId,userId);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Atualizar quantidade de livros no estoque")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Quantidade atualizada"),
            @ApiResponse(responseCode = "400", description = "Erro na atualização")
    })
    @PutMapping("/update-qtd")
    public ResponseEntity<StockBookUpdateQtdSummary> updateQtd(
            @RequestBody @Valid StockBookUpdateQtdRequest request
    ) {
        StockBook stockBook = stockBookService.updateQtd(request.bookId(),request.qtd(), request.userId(), request.description());

        return ResponseEntity.ok(
                StockBookUpdateQtdSummary.from(
                        stockBook,
                        request.qtd(),
                        request.qtd() > 0 ? "ENTRADA" : "SAIDA",
                        request.userId()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookFromStock(@PathVariable Long id,Long userId){
        stockBookService.removeBookOnStock(id,userId);
        return ResponseEntity.noContent().build();
    }


    @Operation(summary = "Exportar PDF")
    @ApiResponse(
            responseCode = "200",
            description = "PDF gerado com sucesso"
    )
    @GetMapping(
            value = "/pdf",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    @Auditable(action = "EXPORTAR_RELATÓRIO_SISTEMA", details = "EXPORTAR RELATORIO EM PDF")
    public void exportPDF(HttpServletResponse response)
            throws IOException {

        response.setContentType("application/pdf");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=relatorioEstoque.pdf"
        );
        List<StockBook> stockBooks = stockBookService.findAll();
        StockBookPdfStrategy strategy = new StockBookPdfStrategy();
        pdfService.export(
                response,
                stockBooks,
                strategy
        );

    }

}