package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.StockBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockBookRepository extends JpaRepository<StockBook, Long> {

    Optional<StockBook> findByStockAndBook(Stock stock, Book book);

    Optional<StockBook> findByStockAndBookId(Stock stock, Long bookId);

    void removeStockBookByBook(Book book);

    List<StockBook> findByStock(Stock stock);

    List<StockBook> findByBook(Book book);

    @Query("SELECT sb FROM StockBook sb WHERE sb.stock = :stock AND sb.recordStatus.status = 'ACTIVE'")
    List<StockBook> findActiveByStock(Stock stock);

    @Query("SELECT sb FROM StockBook sb WHERE sb.stock = :stock AND sb.book = :book AND sb.recordStatus.status = 'ACTIVE'")
    Optional<StockBook> findActiveByStockAndBook(Stock stock, Book book);
}