package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UserDTO")
public record UserResponseDTO(
        Long id,
        @Schema(description = "nome do usuario")
        String name,
        @Schema(description = "Email do Usuario")
        String email,
        @Schema(description = "Papel do Usuario")
        Role role
) {
}
