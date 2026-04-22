package com.jefferson.bookfly_api.dto;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.Bookcase;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Schema(name = "UserDTO")
public record UserDTO(
        Long id,
        @Schema(description = "nome do usuario")
        String name,
        @Schema(description = "Email do Usuario")
        String email,
        @Schema(description = "Senha do Usuario")
        String password,
        @Schema(description = "Papel do Usuario")
        Role role
        // @Schema(description = "Estantes")
        // List<Map<Integer,String>> bookcases
) {
}
