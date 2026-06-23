package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Penalty;
import com.jefferson.bookfly_api.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PenaltyRepository extends JpaRepository<Penalty,Long> {
    Optional<Penalty> findByLoan(Loan loan);

    @Query(
            """
        SELECT p
        FROM Penalty p
        WHERE LOWER(CAST(p.status AS string)) LIKE LOWER(CONCAT('%', :search, '%'))
       OR CAST(p.id AS string) LIKE CONCAT('%', :search, '%')
       OR CAST(p.amount AS string) LIKE CONCAT('%', :search, '%')
       OR CAST(p.loan.user.name AS string) LIKE CONCAT('%', :search, '%')
"""
    )
    Page<Penalty> search(String search, Pageable pageable);
}
