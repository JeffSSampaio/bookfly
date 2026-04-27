package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.StockBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockBookRepository extends JpaRepository<StockBook, Long> {
    Optional<StockBook> findByStockAndBook(Stock stock, Book book);
    Optional<StockBook> findByStockAndBookId(Stock stock, Long bookId);
    void removeStockBookByBook(Book book);
    List<StockBook> findByStock(Stock stock);
}
