package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.dto.penalty.PenaltyDetail;
import com.jefferson.bookfly_api.enums.ItemEventAction;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.enums.StatusLoan;
import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.events.ItemEvent;
import com.jefferson.bookfly_api.exceptions.DependencyViolationException;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PenaltyService {

    private final PenaltyRepository penaltyRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final ApplicationEventPublisher eventPublisher;
    public List<Penalty> getAllPenaltys() {
        return penaltyRepository.findAll();
    }

    @Auditable(
            action = "CRIACAO_MULTA",
            details = "USUARIO {userId} FOi MULTADO"
    )
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
            eventPublisher.publishEvent(new ItemEvent("penalties", ItemEventAction.CREATED));
            return penaltyRepository.save(penalty);
        } else {
            throw new DependencyViolationException("Não foi possível criar multa: o prazo de devolução ainda não venceu");
        }
    }

    public Penalty findById(Long id){
        return penaltyRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("não existe essa multa"));
    }

    @Transactional
    @Auditable(
            action = "EDICAO_MULTA",
            details = "MULTA ID°{penaltyId} FOI ATUALIZADA"
    )
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
            Loan loan = existingPenalty.getLoan();


            if (updatedData.getAmount() == null) {
                existingPenalty.setAmount(existingPenalty.getPaymentAmount(loan.getReturnDate(), LocalDateTime.now()));
            }

            if (updatedData.getStatus() == StatusPenalty.PAGO) {
                existingPenalty.setPaid(true);
                existingPenalty.setPayedDate(LocalDateTime.now());

                if (loan != null) {
                    loan.setStatus(StatusLoan.FINALIZADO);
                    loanRepository.save(loan);
                }
            }

            if (updatedData.getStatus() == StatusPenalty.PENDENTE) {
                existingPenalty.setPaid(false);
                existingPenalty.setPayedDate(null);


                if (updatedData.getAmount() == null) {
                    existingPenalty.setAmount(BigDecimal.valueOf(0.0));
                }

                if (loan != null) {
                    loan.setStatus(StatusLoan.ATRASADO);
                    loanRepository.save(loan);
                }
            }

            if (updatedData.getStatus() == StatusPenalty.ANALISE) {
                existingPenalty.setPaid(false);
                existingPenalty.setPayedDate(null);


                if (updatedData.getAmount() == null) {
                    existingPenalty.setAmount(BigDecimal.valueOf(0.0));
                }

                if (loan != null) {
                    loan.setStatus(StatusLoan.ANALISE);
                    loanRepository.save(loan);
                }
            }
        }

        if (updatedData.getLoan() != null) {
            existingPenalty.setLoan(updatedData.getLoan());
        }
        penaltyRepository.save(existingPenalty);
        eventPublisher.publishEvent(new ItemEvent("penalties", ItemEventAction.UPDATED));
        return existingPenalty;
    }
    @Auditable(
            action = "REMOCAO_MULTA",
            details = "MULTA ID°{id} DE USUÁRIO {userId} FOI DELETADO "

    )
    public void removePenalty(Long id,Long userId){
            Penalty penaltyExist = penaltyRepository.findById(id)
                    .orElseThrow(()-> new NotFoundException("Essa multa não existe no sistema"));
            User userExist = userRepository.findById(userId)
                    .orElseThrow(()-> new NotFoundException("Esse Usuário não existe no sistema"));

            if (penaltyExist.getStatus() == StatusPenalty.ANALISE){
                throw new DependencyViolationException("Não é Possível Remover uma Multa em Análise");
            }

            penaltyExist.getRecordStatus().delete(userExist);
            eventPublisher.publishEvent(new ItemEvent("penalties", ItemEventAction.DELETED));
            penaltyRepository.save(penaltyExist);
    }


    public Penalty removePenalty(Long id){
        Penalty penaltyExist = penaltyRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Essa multa não existe no sistema"));


        if (penaltyExist.getStatus() == StatusPenalty.ANALISE){
            throw new DependencyViolationException("Não é Possível Remover uma Multa em Análise");
        }

        penaltyExist.getRecordStatus().setRecordStatusValue(RecordStatusValue.DELETED);
        penaltyExist.getRecordStatus().setDateTime(LocalDateTime.now());
        penaltyRepository.save(penaltyExist);
        eventPublisher.publishEvent(new ItemEvent("penalties", ItemEventAction.DELETED));
        return penaltyExist;
    }

    public Page<Penalty> findAll(String search,Pageable pageable){
        if (search == null || search.isBlank()){
            return penaltyRepository.findAll(pageable);
        }

        return penaltyRepository.search(
                search,
                pageable);
    }
    public Page<Penalty> findAll(Pageable pageable){
        return penaltyRepository.findAll(pageable);
    }


}