package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Penalty;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.Moviment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentRepository extends JpaRepository<Moviment,Long> {




    Moviment getMovimentById(Long id);

    @Query("""
    SELECT m
    FROM Moviment m
    WHERE LOWER(CAST(m.typeItem AS string))
          LIKE LOWER(CONCAT('%', :search, '%'))

       OR CAST(m.id AS string)
          LIKE CONCAT('%', :search, '%')

       OR CAST(m.qtdMoviment AS string)
          LIKE CONCAT('%', :search, '%')

       OR LOWER(m.user.name)
          LIKE LOWER(CONCAT('%', :search, '%'))

       OR LOWER(m.description)
          LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<Moviment> search(String search, Pageable pageable);

}
