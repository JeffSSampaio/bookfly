package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.StockResponseDTO;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.service.StockService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {
    private StockService stockService;

//    @Operation(description = "Pega todos os livros")
//    @GetMapping("/books")
//    public List<Book> getAllBooksFromStock(){
//        return stockService.getStock().getBooks();
//
//    }
//
//    @Operation(description = "Adicionar Livro do Estoque")
//    @PostMapping("/books")
//    public Book addBookOnStock(@RequestBody Book book){
//        return stockService.addBookOnStock(book);
//    }
}
