package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.StockBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT sb FROM StockBook sb WHERE sb.recordStatus.recordStatusValue = 'ACTIVE'")
    List<StockBook> findAllActive();

    @Query("SELECT sb FROM StockBook sb WHERE sb.stock = :stock AND sb.recordStatus.recordStatusValue = 'ACTIVE'")
    List<StockBook> findActiveByStock(Stock stock);

    @Query("SELECT sb FROM StockBook sb WHERE sb.stock = :stock AND sb.book = :book AND sb.recordStatus.recordStatusValue = 'ACTIVE'")
    Optional<StockBook> findActiveByStockAndBook(Stock stock, Book book);


    @Query("""
    SELECT sb
    FROM StockBook sb
    WHERE LOWER(sb.book.title) LIKE LOWER(CONCAT('%', :search, '%'))
       OR CAST(sb.id AS string) LIKE CONCAT('%', :search, '%')
       OR CAST(sb.qtd AS string) LIKE CONCAT('%', :search, '%')
""")
    Page<StockBook> search(
            @Param("search") String search,
            Pageable pageable
    );
}