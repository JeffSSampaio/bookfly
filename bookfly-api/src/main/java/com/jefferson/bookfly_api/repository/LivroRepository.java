package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro,Long> {
    List<Livro> findByAutorId(Long autorId);
    List<Livro> findByQtdGreaterThan(int qtd);
    List<Livro> findByTitleContainingIgnoreCase(String title);
}
