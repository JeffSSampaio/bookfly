package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Estante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstanteRepository extends JpaRepository<Estante,Long> {
}
