package com.jefferson.bookfly_api.dto.user;

import com.jefferson.bookfly_api.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "DTO para criação de usuário")
public record UserRequestUpdate(

        @Schema(description = "Nome do usuário", example = "nome")
        String name,

        @Schema(description = "Email do usuário", example = "email@email.com")
        String email,

        @Schema(description = "Senha do usuário", example = "123456")
        String password,

        @Schema(description = "Tipo de usuário", example = "USER")
        Role role
) {
}