package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.bookcase.BookcaseRequest;
import com.jefferson.bookfly_api.dto.bookcase.BookcaseResponse;
import com.jefferson.bookfly_api.dto.bookcase.BookcaseUpdateRequest;
import com.jefferson.bookfly_api.models.Bookcase;
import com.jefferson.bookfly_api.service.BookcaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookcases")
@RequiredArgsConstructor
@Tag(name = "Estantes", description = "Gerenciamento de estantes de livros")
public class BookcaseController {

    private final BookcaseService bookcaseService;


    @Operation(summary = "Criar nova estante")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estante criada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário ou livro não encontrado")
    })
    @PostMapping
    public ResponseEntity<BookcaseResponse> createBookcase(@RequestBody BookcaseRequest request) {

        Bookcase bookcase = bookcaseService.createBookcase(
                request.name(),
                request.userId()
        );

        return ResponseEntity.ok(BookcaseResponse.from(bookcase));
    }

    @Operation(summary = "Listar todas as estantes")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<BookcaseResponse>> findAll() {

        List<BookcaseResponse> response = bookcaseService.findAll()
                .stream()
                .map(BookcaseResponse::from)
                .toList();

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Buscar estante por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estante encontrada"),
            @ApiResponse(responseCode = "404", description = "Estante não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<BookcaseResponse> findById(@PathVariable Long id) {

        Bookcase bookcase = bookcaseService.findById(id);

        return ResponseEntity.ok(BookcaseResponse.from(bookcase));
    }

    @Operation(summary = "Listar estantes de um usuário")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookcaseResponse>> findByUser(@PathVariable Long userId) {

        List<BookcaseResponse> response = bookcaseService.findByUser(userId)
                .stream()
                .map(BookcaseResponse::from)
                .toList();

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar estantes que contêm livros de um autor")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<BookcaseResponse>> findByAuthor(@PathVariable Long authorId) {

        List<BookcaseResponse> response = bookcaseService.findByAuthor(authorId)
                .stream()
                .map(BookcaseResponse::from)
                .toList();

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Adicionar livro à estante")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro adicionado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Estante ou livro não encontrado")
    })
    @PostMapping("/{bookcaseId}/books/{stockBookId}")
    public ResponseEntity<BookcaseResponse> addBook(
            @PathVariable Long bookcaseId,
            @PathVariable Long stockBookId) {

        Bookcase bookcase = bookcaseService.addBookToBookcase(bookcaseId, stockBookId);

        return ResponseEntity.ok(BookcaseResponse.from(bookcase));
    }

    @Operation(summary = "Atualizar estante")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estante atualizada"),
            @ApiResponse(responseCode = "404", description = "Estante ou livro não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<BookcaseResponse> updateBookcase(
            @PathVariable Long id,
            @RequestBody BookcaseUpdateRequest request) {

        Bookcase bookcase = bookcaseService.updateBookcase(
                id,
                request.name(),
                request.stockBookId()
        );

        return ResponseEntity.ok(BookcaseResponse.from(bookcase));
    }


    @Operation(summary = "Remover livro da estante")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Estante ou livro não encontrado")
    })
    @DeleteMapping("/{bookcaseId}/books/{stockBookId}")
    public ResponseEntity<BookcaseResponse> removeBook(
            @PathVariable Long bookcaseId,
            @PathVariable Long stockBookId) {

        Bookcase bookcase = bookcaseService.removeBookFromBookcase(bookcaseId, stockBookId);

        return ResponseEntity.ok(BookcaseResponse.from(bookcase));
    }


    @Operation(summary = "Deletar estante")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Estante deletada"),
            @ApiResponse(responseCode = "404", description = "Estante não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookcase(@PathVariable Long id) {

        bookcaseService.deleteBookcase(id);

        return ResponseEntity.noContent().build();
    }
}