package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book,Long> {

    @Query("SELECT b FROM Book b JOIN b.authors a WHERE a.id = :autorId AND b.recordStatus.status = 'ACTIVE'")
    List<Book> findActiveByAuthorsId(Long autorId);


    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) AND b.recordStatus.status = 'ACTIVE'")
    List<Book> findActiveByTitleContaining(String title);


    @Query("SELECT COUNT(b) > 0 FROM Book b JOIN b.authors a WHERE LOWER(b.title) = LOWER(:title) AND a IN :authors AND b.recordStatus.status = 'ACTIVE'")
    boolean existsActiveByTitleAndAuthors(String title, List<Author> authors);


    @Query("SELECT b FROM Book b WHERE b.recordStatus.status = 'ACTIVE'")
    List<Book> findAllActive();


}
