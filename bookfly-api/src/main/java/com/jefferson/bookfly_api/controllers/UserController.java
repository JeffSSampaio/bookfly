package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.user.UserRequest;
import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Listar todos os usuários")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuários retornada com sucesso")
    })
    @GetMapping("/list")
    public ResponseEntity<List<UserSummary>> getALlUsers(){
        return ResponseEntity.ok(
                userService.getAllUsers()
                        .stream()
                        .map(UserSummary::from)
                        .toList()
        );
    }

    @Operation(summary = "Buscar usuário por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserSummary> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(UserSummary.from(userService.getUserById(id)));
    }

    @Operation(summary = "Criar novo usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping("/create")
    public ResponseEntity<UserSummary> createUser(
            @RequestBody @Valid UserRequest request){

        User user = new User();
        user.setPassword(request.password());
        user.setRole(request.role());
        user.setName(request.name());
        user.setEmail(request.email());

        return ResponseEntity.ok(
                UserSummary.from(userService.createUser(user))
        );
    }

    @Operation(summary = "Atualizar usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserSummary> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserRequest request){

       User user = new User();
       user.setEmail(request.email());
       user.setName(request.name());
       user.setPassword(request.password());

        return ResponseEntity.ok(
                UserSummary.from(userService.updateUser(user))
        );
    }

    @Operation(summary = "Deletar usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}