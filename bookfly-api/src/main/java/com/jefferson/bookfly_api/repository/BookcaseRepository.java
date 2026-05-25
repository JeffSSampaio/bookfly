package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Bookcase;
import com.jefferson.bookfly_api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookcaseRepository extends JpaRepository<Bookcase, Long> {

    List<Bookcase> findByUser(User user);

    List<Bookcase> findByStockBooksBookAuthorsId(Long authorId);

    @Query("SELECT bc FROM Bookcase bc WHERE bc.recordStatus.status = 'ACTIVE'")
    List<Bookcase> findAllActive();

    @Query("SELECT bc FROM Bookcase bc WHERE bc.user = :user AND bc.recordStatus.status = 'ACTIVE'")
    List<Bookcase> findActiveByUser(User user);

    @Query("SELECT bc FROM Bookcase bc JOIN bc.stockBooks sb JOIN sb.book b JOIN b.authors a WHERE a.id = :authorId AND bc.recordStatus.status = 'ACTIVE'")
    List<Bookcase> findActiveByStockBooksBookAuthorsId(Long authorId);
}