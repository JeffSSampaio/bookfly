package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.moviment.MovimentQtdRequest;
import com.jefferson.bookfly_api.dto.moviment.MovimentRequest;
import com.jefferson.bookfly_api.dto.moviment.MovimentSummary;
import com.jefferson.bookfly_api.models.Moviment;
import com.jefferson.bookfly_api.service.MovimentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/moviments")
@RequiredArgsConstructor
@Tag(name = "Movimentações", description = "Operações relacionadas às movimentações de estoque")
public class MovimentController {

    private final MovimentService movimentService;

    @Operation(summary = "Listar todas as movimentações")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimentações retornadas com sucesso")
    })
    @GetMapping
    public ResponseEntity<List<MovimentSummary>> getAllMoviments(){
           List<Moviment> allMoviments =  movimentService.getAllMoviments().stream()
                    .filter(moviment -> (moviment.getId() != null) && (moviment.getUser() != null))
                    .toList();

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
    public ResponseEntity<MovimentSummary> getMoviment(@PathVariable Long id){
        Moviment moviment = movimentService.getMoviment(id);
        return ResponseEntity.ok(MovimentSummary.from(moviment));
    }

    @Operation(summary = "Criar nova movimentação")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Movimentação criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<MovimentSummary> createMoviment(@RequestBody MovimentQtdRequest request){

        Moviment moviment = movimentService.doMoviment(request);
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
            @RequestBody MovimentRequest request
    ){
        Moviment moviment = movimentService.updateMoviment(id, request);
        return ResponseEntity.ok(MovimentSummary.from(moviment));
    }

    @Operation(summary = "Remover movimentação")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Movimentação removida com sucesso"),
            @ApiResponse(responseCode = "404", description = "Movimentação não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMoviment(@PathVariable Long id){
        movimentService.deleteMoviment(id);
        return ResponseEntity.noContent().build();
    }
}