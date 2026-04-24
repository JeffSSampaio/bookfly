package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.repository.StockRepository;
import com.jefferson.bookfly_api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockService {

    private static final Long ESTOQUE_ID = 1L;
    private final StockRepository stockRepository;
    
    public Stock getStock() {
        return stockRepository.findById(ESTOQUE_ID)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado"));
   }



}
