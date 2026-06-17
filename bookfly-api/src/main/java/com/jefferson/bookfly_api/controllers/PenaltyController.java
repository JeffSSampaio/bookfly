package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.dto.penalty.PenaltyDetail;
import com.jefferson.bookfly_api.dto.penalty.PenaltyRequest;
import com.jefferson.bookfly_api.dto.penalty.PenaltyUpdateRequest;
import com.jefferson.bookfly_api.models.Penalty;
import com.jefferson.bookfly_api.service.PdfService;
import com.jefferson.bookfly_api.service.PenaltyService;
import com.jefferson.bookfly_api.strategy.pdf.PenaltyPdfStrategy;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/penalties")
@RequiredArgsConstructor
@Tag(name = "Multas", description = "Gerenciamento de Multas")
public class PenaltyController {

    private final PenaltyService penaltyService;
    private final PdfService pdfService;

    @Operation(summary = "Criar penalidade")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Penalidade criada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário ou empréstimo não encontrado")
    })
    @PostMapping("/create")
    public ResponseEntity<PenaltyDetail> doPenalty(@RequestBody PenaltyRequest request) {
        Penalty penalty = penaltyService.createPenalty(request.userId(), request.loanId());
        return ResponseEntity.ok().body(PenaltyDetail.from(penalty));
    }

    @Operation(summary = "Listar todas as penalidades")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/list")
    public ResponseEntity<List<PenaltyDetail>> getAllPenalties() {
        return ResponseEntity.ok()
                .body(penaltyService.getAllPenaltys()
                        .stream()
                        .map(PenaltyDetail::from)
                        .toList()
                );
    }

    @Operation(summary = "Atualizar penalidade")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Penalidade atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Penalidade não encontrada")
    })
    @PatchMapping("/update/{id}")
    public ResponseEntity<PenaltyDetail> updatePenalty(
            @PathVariable Long id,
            @RequestBody PenaltyUpdateRequest request
    ) {
         Penalty penaltyData = new Penalty();
         penaltyData.setPenaltyDate(request.penaltyDate());
         penaltyData.setPaid(request.paid());
         penaltyData.setAmount(new java.math.BigDecimal(request.amount().toString()));
         penaltyData.setStatus(request.status());

        Penalty updatedPenalty = penaltyService.updatePenalty(id, penaltyData);
        return ResponseEntity.ok(PenaltyDetail.from(updatedPenalty));
    }

    @Operation(summary = "Deletar penalidade")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Penalidade atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Penalidade não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePenalty(@PathVariable Long id , Long userId ){
        penaltyService.removePenalty(id,userId);
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
                "attachment; filename=relatorioMultas.pdf"
        );

        List<Penalty> penalties = penaltyService.getAllPenaltys();

        PenaltyPdfStrategy strategy = new PenaltyPdfStrategy();

        pdfService.export(
                response,
                penalties,
                strategy
        );

    }

}