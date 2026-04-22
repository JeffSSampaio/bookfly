package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan,Long> {
    List<Loan> findByUsuario(User user);

    List<Loan> findByStatus(StatusLoan statusLoan);

    List<Loan> findByStatusAndReturnDateBefore(StatusLoan statusLoan, LocalDate now);
}
