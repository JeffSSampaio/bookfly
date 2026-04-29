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

        User existUser = userRepository.findById(request.userId())
                .orElseThrow(()-> new RuntimeException("Usuário não existe"));


        Loan loanedUser = loanRepository.findById(existUser.getId())
                .orElseThrow(()-> new RuntimeException("Emprestimo inexistente"));

        Optional<Penalty> existPenalty = penaltyRepository.findByLoan(loanedUser);

        if (existPenalty.isPresent()){
            throw new RuntimeException("Essa multa já existe");
        }


        Boolean isPassedReturnDate = loanedUser.getReturnDate().isAfter(ChronoLocalDate.from(LocalDateTime.now()));


        if(isPassedReturnDate){
            Penalty penalty = new Penalty();
            penalty.setPenaltyDate(LocalDateTime.now());
            penalty.setPaid(false);
            penalty.setLoan(loanedUser);
            penalty.setAmount(penalty.getPaymentAmount(loanedUser.getLoanDate(),loanedUser.getReturnDate()));
            penalty.setStatus(StatusPenalty.PENDENTE);
            loanedUser.setStatus(StatusLoan.ATRASADO);
            loanRepository.save(loanedUser);
            return penaltyRepository.save(penalty);
        } else {
            throw new RuntimeException("Não foi possível criar Multa");
        }

    }


}
