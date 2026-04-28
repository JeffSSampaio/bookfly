package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan,Long> {


    List<Loan> findByStatus(StatusLoan statusLoan);

    List<Loan> findByStatusAndReturnDateBefore(StatusLoan statusLoan, LocalDate now);

    List<Loan> findByUser(User user);


    Optional<Loan> findByUserAndStockBook(User user, StockBook book);
}
