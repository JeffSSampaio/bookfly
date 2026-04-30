package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.penalty.PenaltyDetail;
import com.jefferson.bookfly_api.dto.penalty.PenaltyRequest;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PenaltyService {

    private final PenaltyRepository penaltyRepository;
    private final UserRepository userRepository;
    private final MovimentRepository movimentRepository;
    private final LoanRepository loanRepository;
    private final StockBookRepository stockBookRepository;
    private final BookRepository bookRepository;
    private final StockService stockService;

    public List<Penalty> getAllPenaltys(){
        return penaltyRepository.findAll();
    }

    public Penalty createPenalty(PenaltyRequest request) {


        userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("Usuário não existe"));


        Loan loan = loanRepository.findById(request.loanId())
                .orElseThrow(() -> new RuntimeException("Empréstimo inexistente"));


        Optional<Penalty> existPenalty = penaltyRepository.findByLoan(loan);
        if (existPenalty.isPresent()) {
            throw new RuntimeException("Essa multa já existe");
        }


        boolean isOverdue = loan.getReturnDate().isBefore(LocalDateTime.now());

        if (isOverdue) {
            Penalty penalty = new Penalty();
            penalty.setPenaltyDate(LocalDateTime.now());
            penalty.setPaid(false);
            penalty.setLoan(loan);

            penalty.setAmount(penalty.getPaymentAmount(
                    loan.getReturnDate(),
                    LocalDateTime.now()
            ));

            penalty.setStatus(StatusPenalty.PENDENTE);

            loan.setStatus(StatusLoan.ATRASADO);
            loanRepository.save(loan);

            return penaltyRepository.save(penalty);
        } else {
            throw new RuntimeException("Não foi possível criar multa: o prazo de devolução ainda não venceu");
        }
    }


}
