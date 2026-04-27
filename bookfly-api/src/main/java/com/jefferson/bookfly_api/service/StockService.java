package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.repository.StockRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockService {
    private final StockRepository stockRepository;

    public Stock getStock() {
        return stockRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Stock não existe"));
    }


    @PostConstruct
    public void init() {
        if (stockRepository.count() == 0) {
            Stock stock = new Stock();
            stockRepository.save(stock);
        }
    }

}
