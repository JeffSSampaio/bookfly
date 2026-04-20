package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroRepository extends JpaRepository<Livro,Long> {
}
