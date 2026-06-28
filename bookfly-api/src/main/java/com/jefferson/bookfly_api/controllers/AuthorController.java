package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.author.AuthorDetail;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
@Tag(name = "Autores", description = "Gerenciamento de autores")
public class AuthorController {

    private final AuthorService authorService;

    @Operation(summary = "Listar todos os autores")
    @ApiResponse(responseCode = "200", description = "Autores retornados com sucesso")
    @GetMapping("/list-all")
    public ResponseEntity<List<Author>> getAllAuthors() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    @Operation(summary = "Listar todos os autores")
    @ApiResponse(responseCode = "200", description = "Autores retornados com sucesso")
    @GetMapping("/list")
    public ResponseEntity<Page<AuthorDetail>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search
    ) {

        Sort.Direction dir = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sort));

        Page<Author> authors = authorService.findAll(search, pageable);

        Page<AuthorDetail> response = authors.map(AuthorDetail::from);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Criar um novo autor")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Autor criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping("/create")
    public ResponseEntity<Author> createAuthor(@RequestBody Author author) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authorService.createAuthor(author));
    }

    @Operation(summary = "Editar autor")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Autor atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Autor não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Author> editAuthor(@PathVariable Long id, @RequestBody Author author) {
        return ResponseEntity.ok(authorService.editAuthor(id, author));
    }

    @Operation(summary = "Associar autor a um livro")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Autor associado ao livro com sucesso"),
            @ApiResponse(responseCode = "404", description = "Autor ou livro não encontrado")
    })
    @PostMapping("/{authorId}/books/{bookId}")
    public ResponseEntity<Book> addAuthorToBook(@PathVariable Long authorId, @PathVariable Long bookId) {
        return ResponseEntity.ok(authorService.addAuthorToBook(authorId, bookId));
    }

    @Operation(summary = "Deletar autor")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Autor deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Autor não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }
}