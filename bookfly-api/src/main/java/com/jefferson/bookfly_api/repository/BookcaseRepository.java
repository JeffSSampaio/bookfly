package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Bookcase;
import com.jefferson.bookfly_api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookcaseRepository extends JpaRepository<Bookcase, Long> {

    List<Bookcase> findByUser(User user);

    List<Bookcase> findByStockBooksBookAuthorsId(Long authorId);

}