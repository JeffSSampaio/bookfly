package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PenaltyService {

    private final PenaltyRepository penaltyRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    public List<Penalty> getAllPenaltys() {
        return penaltyRepository.findAll();
    }

    public Penalty createPenalty(Long userId, Long loanId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuário não existe"));

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Empréstimo inexistente"));

        Optional<Penalty> existPenalty = penaltyRepository.findByLoan(loan);
        if (existPenalty.isPresent()) {
            throw new NotFoundException("Essa multa já existe");
        }

        boolean isOverdue = loan.getReturnDate().isBefore(LocalDateTime.now());

        if (isOverdue) {
            Penalty penalty = new Penalty();
            penalty.setPenaltyDate(LocalDateTime.now());
            penalty.setPaid(false);
            penalty.setLoan(loan);
            penalty.setAmount(penalty.getPaymentAmount(loan.getReturnDate(), LocalDateTime.now()));
            penalty.setStatus(StatusPenalty.PENDENTE);

            loan.setStatus(StatusLoan.ATRASADO);
            loanRepository.save(loan);

            return penaltyRepository.save(penalty);
        } else {
            throw new NotFoundException("Não foi possível criar multa: o prazo de devolução ainda não venceu");
        }
    }

    public Penalty findById(Long id){
        return penaltyRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("não existe essa multa"));
    }

    @Transactional
    public Penalty updatePenalty(Long penaltyId, Penalty updatedData) {
        Penalty existingPenalty = penaltyRepository.findById(penaltyId)
                .orElseThrow(() -> new NotFoundException("Multa não encontrada"));

        if (updatedData.getPenaltyDate() != null) {
            existingPenalty.setPenaltyDate(updatedData.getPenaltyDate());
        }

        if (updatedData.getPaid() != null) {
            existingPenalty.setPaid(updatedData.getPaid());
        }

        if (updatedData.getAmount() != null) {
            existingPenalty.setAmount(updatedData.getAmount());
        }

        if (updatedData.getStatus() != null) {
            existingPenalty.setStatus(updatedData.getStatus());


            if (updatedData.getStatus() == StatusPenalty.PAGO) {
                existingPenalty.setPaid(true);
                existingPenalty.setPayedDate(LocalDateTime.now());

                Loan loan = existingPenalty.getLoan();
                if (loan != null) {
                    loan.setStatus(StatusLoan.FINALIZADO);
                    loanRepository.save(loan);
                }
            }

            if (updatedData.getStatus() == StatusPenalty.PENDENTE) {
                existingPenalty.setPaid(false);
                existingPenalty.setPayedDate(null);

                Loan loan = existingPenalty.getLoan();
                if (loan != null) {
                    loan.setStatus(StatusLoan.ATRASADO);
                    loanRepository.save(loan);
                }
            }




        }

        if (updatedData.getLoan() != null) {
            existingPenalty.setLoan(updatedData.getLoan());
        }

        return penaltyRepository.save(existingPenalty);
    }

    public void removePenalty(Long id,Long userId){
            Penalty penaltyExist = penaltyRepository.findById(id)
                    .orElseThrow(()-> new NotFoundException("Essa multa não existe no sistema"));
            User userExist = userRepository.findById(userId)
                    .orElseThrow(()-> new NotFoundException("Esse Usuário não existe no sistema"));

            penaltyExist.getRecordStatus().delete(userExist);

            penaltyRepository.save(penaltyExist);
    }


}