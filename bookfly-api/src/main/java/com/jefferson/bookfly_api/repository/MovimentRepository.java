package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.Moviment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentRepository extends JpaRepository<Moviment,Long> {




    Moviment getMovimentById(Long id);
}
