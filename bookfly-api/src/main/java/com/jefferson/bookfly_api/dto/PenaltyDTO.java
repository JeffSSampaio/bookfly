package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.StatusPenalty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
@Schema(name = "penaltyDTO")
public record PenaltyDTO(
     @Schema(description = "Identificador da multa")
     Long penalty_id,
     @Schema(description = "Data de Multa")
     LocalDate penaltyDate,
     @Schema(description = "Data do pagamento")
     LocalDate payedDate,
     @Schema(description = "Identificador do Usuario")
     Long user_id,
     @Schema(description = "Nome do Usuario")
     String nameUser,
     @Schema(description = "Identificador da multa")
     Double valuePenalty,
     @Schema(description = "Status da Multa")
     StatusPenalty statusPenalty
) {}
