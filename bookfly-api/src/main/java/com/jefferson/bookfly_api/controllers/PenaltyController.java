package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.penalty.PenaltyDetail;
import com.jefferson.bookfly_api.dto.penalty.PenaltyRequest;
import com.jefferson.bookfly_api.dto.penalty.PenaltyUpdateRequest;
import com.jefferson.bookfly_api.models.Penalty;
import com.jefferson.bookfly_api.service.PenaltyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalties")
@RequiredArgsConstructor
@Tag(name = "Multas", description = "Gerenciamento de Multas")
public class PenaltyController {

    private final PenaltyService penaltyService;

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
}