package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "DTO para criação de usuário")
public record UserRequest(

        @Schema(description = "ID do usuário (usado apenas para update)", example = "1",hidden = true)
        Long userID,

        @NotBlank(message = "Nome é obrigatório")
        @Schema(description = "Nome do usuário", example = "nome")
        String name,

        @Email(message = "Email inválido")
        @NotBlank(message = "Email é obrigatório")
        @Schema(description = "Email do usuário", example = "email@email.com")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        @Schema(description = "Senha do usuário", example = "123456")
        String password,

        @Schema(description = "Tipo de usuário", example = "USER")
        Role role
) {
}