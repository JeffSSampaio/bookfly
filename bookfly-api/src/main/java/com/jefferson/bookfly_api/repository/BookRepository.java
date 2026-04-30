package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book,Long> {
    List<Book> findByAuthorsId(Long autorId);
    List<Book> findByTitleContainingIgnoreCase(String title);
    boolean existsByTitleIgnoreCaseAndAuthorsIn(String title, List<Author> authors);


}
