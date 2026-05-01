package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.penalty.PenaltyDetail;
import com.jefferson.bookfly_api.dto.penalty.PenaltyRequest;
import com.jefferson.bookfly_api.models.Penalty;
import com.jefferson.bookfly_api.service.PenaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalties")
@RequiredArgsConstructor
public class PenaltyController {

    private final PenaltyService penaltyService;

    @PostMapping("/create")
    public ResponseEntity<PenaltyDetail> doPenalty(@RequestBody PenaltyRequest request) {
        Penalty penalty = penaltyService.createPenalty(request.userId(), request.loanId());
        return ResponseEntity.ok().body(PenaltyDetail.from(penalty));
    }

    @GetMapping("/list")
    public ResponseEntity<List<PenaltyDetail>> getAllPenalties() {
        return ResponseEntity.ok()
                .body(penaltyService.getAllPenaltys()
                        .stream()
                        .map(PenaltyDetail::from)
                        .toList()
                );
    }
}