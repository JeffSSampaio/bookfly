package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.StatusPenalty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
@Schema(name = "penaltyDTO")
public record PenaltyResponseDTO(
     @Schema(description = "Identificador da multa")
     Long penalty_id,
     @Schema(description = "Data de Multa")
     LocalDate penaltyDate,
     @Schema(description = "Data do pagamento")
     LocalDate payedDate,
     @Schema(description = "Usuario")
     UserResponseDTO user,
     @Schema(description = "Identificador da multa")
     Double valuePenalty,
     @Schema(description = "Status da Multa")
     StatusPenalty statusPenalty
) {}
