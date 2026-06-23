package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    Optional<Author> findByName(String name);

    Optional<Author> findByNameIgnoreCase(String name);

    @Query("SELECT a FROM Author a WHERE a.recordStatus.recordStatusValue = 'ACTIVE'")
    List<Author> findAllActive();

    @Query("SELECT a FROM Author a WHERE a.recordStatus.recordStatusValue = 'ACTIVE' AND LOWER(a.name) = LOWER(:name)")
    Optional<Author> findActiveByNameIgnoreCase(String name);

    @Query("SELECT a FROM Author a WHERE a.recordStatus.recordStatusValue = 'ACTIVE' AND LOWER(a.name) = LOWER(:name)")
    Optional<Author> findActiveByName(String name);

    @Query("""
    SELECT DISTINCT a
    FROM Author a
    LEFT JOIN a.books b
    WHERE CAST(a.id AS string)
          LIKE CONCAT('%', :search, '%')

       OR LOWER(a.name)
          LIKE LOWER(CONCAT('%', :search, '%'))

       OR LOWER(b.title)
          LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<Author> search(String search, Pageable pageable);
}