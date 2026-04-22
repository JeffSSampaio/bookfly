package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Bookcase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookcaseRepository extends JpaRepository<Bookcase,Long> {
}
