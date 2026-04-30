package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.book.BookDetail;
import com.jefferson.bookfly_api.dto.book.BookRequest;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "API para gerenciamento de livros")
public class BookController {
    private final BookService bookService;

    @Operation(summary = "Criar um novo livro")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Livro criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping("/create")
    public ResponseEntity<BookDetail> createBook(@RequestBody @Valid BookRequest request){
        Book book = new Book();
        book.setTitle(request.title());

        book.setCover(request.cover());

        List<Author> authors = request.authors().stream()
                .map(name ->{
                            Author author = new Author();
                            author.setName(name);
                            return author;
                        })
                .toList();

        book.setAuthors(authors);

        book.setGenders(request.genders());

        Book saved = bookService.createBook(book);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BookDetail.from(saved));
    }


    @Operation(summary = "Listar todos os livros")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/list")
    public ResponseEntity<List<BookDetail>> getAllBooks(){
        return ResponseEntity.ok(
                bookService.findAll()
                        .stream()
                        .map(book -> BookDetail.from(book))
                        .toList()
        );


    }
    @Operation(summary = "Buscar livro por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Livro encontrado"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado"),
            @ApiResponse(responseCode = "500", description = "Livro não Existe no Estoque")
    })
    @GetMapping("/{id}")
    public ResponseEntity<BookDetail> getBook(@PathVariable Long id){
            return ResponseEntity.ok(
                    BookDetail.from(bookService.findById(id))
            );
    }

    @Operation(summary = "Atualizar livro")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Livro atualizado"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<BookDetail> updateBook(@PathVariable Long id, @RequestBody @Valid BookRequest request){

       Book bookEdit = new Book();
       bookEdit.setCover(request.cover());
       List<Author> authors = request.authors().stream()
               .map(name -> {
                           Author author = new Author();
                           author.setName(name);
                           return author;
                       }
               ).toList();
       bookEdit.setAuthors(authors);
       bookEdit.setTitle(request.title());
       bookEdit.setGenders(request.genders());

       Book updatedBook = bookService.updateBook(id, bookEdit);

       return ResponseEntity.ok(BookDetail.from(updatedBook));
    }

    @Operation(summary = "Deletar livro")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Livro deletado"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletedBook(@PathVariable Long id){
        bookService.removeBook(id);
        return ResponseEntity.noContent().build();
    }

}
