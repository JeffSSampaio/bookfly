package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque,Long> {
}
