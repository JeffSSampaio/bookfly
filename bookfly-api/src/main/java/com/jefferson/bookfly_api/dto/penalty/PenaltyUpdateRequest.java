package com.jefferson.bookfly_api.dto.penalty;

import com.jefferson.bookfly_api.enums.StatusPenalty;

import java.time.LocalDateTime;

public record PenaltyUpdateRequest(
        LocalDateTime penaltyDate,
        Boolean paid,
        Double amount,
        StatusPenalty status,
        Long loanId
) {}