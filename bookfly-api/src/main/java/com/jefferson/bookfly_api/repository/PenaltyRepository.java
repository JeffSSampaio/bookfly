package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Penalty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PenaltyRepository extends JpaRepository<Penalty,Long> {
    Optional<Penalty> findByLoan(Loan loan);
}
