package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo,Long> {
}
