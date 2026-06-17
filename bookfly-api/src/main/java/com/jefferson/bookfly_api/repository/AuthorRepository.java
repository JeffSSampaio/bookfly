package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Author;
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
}