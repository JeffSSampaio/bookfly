package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.dto.moviment.MovimentQtdRequest;
import com.jefferson.bookfly_api.dto.moviment.MovimentSummary;
import com.jefferson.bookfly_api.dto.moviment.MovimentUpdateRequest;
import com.jefferson.bookfly_api.models.Moviment;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.service.MovimentService;
import com.jefferson.bookfly_api.service.PdfService;
import com.jefferson.bookfly_api.strategy.pdf.MovimentPdfStrategy;
import jakarta.servlet.http.HttpServletResponse;
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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/moviments")
@RequiredArgsConstructor
@Tag(name = "Movimentações", description = "Operações relacionadas às movimentações de estoque")
public class MovementController {

    private final MovimentService movimentService;
    private final PdfService pdfService;

    @Operation(summary = "Listar todas as movimentações")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimentações retornadas com sucesso")
    })
    @GetMapping("/list")
    public ResponseEntity<Page<MovimentSummary>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search
    ) {

        Sort.Direction dir = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sort));

        Page<Moviment> moviments = movimentService.findAll(search, pageable);

        Page<MovimentSummary> response = moviments.map(MovimentSummary::from);

        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Listar todas as movimentações")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Movimentações retornadas com sucesso")})
    @GetMapping("/list-all")
    public ResponseEntity<List<MovimentSummary>> getAll() {
        List<Moviment> allMoviments = movimentService.getAllMoviments();

        return ResponseEntity.ok(
                allMoviments.stream()
                        .map(MovimentSummary::from)
                        .toList()
        );
    }

    @Operation(summary = "Buscar movimentação por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimentação encontrada"),
            @ApiResponse(responseCode = "404", description = "Movimentação não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MovimentSummary> getMoviment(@PathVariable Long id) {
        Moviment moviment = movimentService.getMoviment(id);
        return ResponseEntity.ok(MovimentSummary.from(moviment));
    }

    @Operation(summary = "Criar nova movimentação")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimentação criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<MovimentSummary> createMoviment(@RequestBody MovimentQtdRequest request) {
        Moviment moviment = movimentService.doMoviment(request.bookId(), request.userId(), request.qtd(),request.description());
        return ResponseEntity.ok(MovimentSummary.from(moviment));
    }

    @Operation(summary = "Atualizar movimentação")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimentação atualizada"),
            @ApiResponse(responseCode = "404", description = "Movimentação não encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MovimentSummary> updateMoviment(
            @PathVariable Long id,
            @RequestBody MovimentUpdateRequest request
    ) {
        Moviment moviment = new Moviment();
        User user = new User();
        user.setId(request.userId());
        moviment.setUser(user);
        moviment.setDescription(request.description());
        moviment.setQtdMoviment(request.qtdMoviment());
        moviment.setTypeItem(request.typeItem());

        return ResponseEntity.ok(MovimentSummary.from(movimentService.editMoviment(id,moviment)));
    }

    @Operation(summary = "Remover movimentação")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Movimentação removida com sucesso"),
            @ApiResponse(responseCode = "404", description = "Movimentação não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<MovimentSummary> deleteMoviment(@PathVariable Long id) {
       Moviment moviment = movimentService.deleteMoviment(id);
        return ResponseEntity.ok(MovimentSummary.from(moviment));
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
                "attachment; filename=relatorioMovimentacoes.pdf"
        );
        List<Moviment> moviments = movimentService.getAllMoviments();

        MovimentPdfStrategy strategy = new MovimentPdfStrategy();

        pdfService.export(
                response,
                moviments,
                strategy
        );


    }

}