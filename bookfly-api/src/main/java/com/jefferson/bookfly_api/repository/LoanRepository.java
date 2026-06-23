package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByStatus(StatusLoan statusLoan);

    List<Loan> findByStatusAndReturnDateBefore(StatusLoan statusLoan, LocalDate now);

    List<Loan> findByUser(User user);

    Optional<Loan> findByUserAndStockBook(User user, StockBook book);

    @Query("SELECT l FROM Loan l WHERE l.recordStatus.recordStatusValue = 'ACTIVE'")
    List<Loan> findAllActive();

    @Query("SELECT l FROM Loan l WHERE l.user = :user AND l.recordStatus.recordStatusValue = 'ACTIVE'")
    List<Loan> findActiveByUser(User user);

    @Query("SELECT l FROM Loan l WHERE l.user = :user AND l.stockBook = :stockBook AND l.recordStatus.recordStatusValue = 'ACTIVE'")
    Optional<Loan> findActiveByUserAndStockBook(User user, StockBook stockBook);
    @Query("""
    SELECT l
    FROM Loan l
    WHERE CAST(l.id AS string)
          LIKE CONCAT('%', :search, '%')

       OR LOWER(l.user.name)
          LIKE LOWER(CONCAT('%', :search, '%'))

       OR LOWER(CAST(l.status AS string))
          LIKE LOWER(CONCAT('%', :search, '%'))

       OR LOWER(l.stockBook.book.title)
          LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<Loan> search(String search, Pageable pageable);


}