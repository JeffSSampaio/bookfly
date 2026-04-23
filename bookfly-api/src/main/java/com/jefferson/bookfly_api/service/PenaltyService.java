package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.StatusPenalty;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Penalty;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.PenaltyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PenaltyService {

//    private final PenaltyRepository penaltyRepository;
//
//    public List<Penalty> getAllPenaltys() {
//        return penaltyRepository.findAll();
//    }
//
//    public Penalty getPenaltyById(Long id) {
//        return penaltyRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Multa não encontrada"));
//    }
//
//
//    public Optional<Penalty> getPenaltiesByLoan(Loan loan) {
//        return penaltyRepository.findByLoan(loan);
//    }
//    public Double calcValuePenaltyByDayPassed(Loan loan) {
//        long daysLate = ChronoUnit.DAYS.between(
//                loan.getReturnDate(),
//                LocalDate.now()
//        );
//
//        return daysLate * 1.50;
//    }
//
//    public Double getValuePenalty(Loan loan){
//        return calcValuePenaltyByDayPassed(loan);
//    }
//
//    public boolean isPenaltyPaid(Loan loan) {
//        Optional<Penalty> multa = penaltyRepository.findByLoan(loan);
//
//        if (multa.isEmpty()) {
//            return false;
//        }
//
//        return multa.get().getPayed();
//    }
//
//    public void generatePenaltyIfLate(Loan loan) {
//        if (!LocalDate.now().isAfter(loan.getReturnDate())) {
//            return;
//        }
//
//        if (isPenaltyPaid(loan)) {
//            return;
//        }
//
//        Penalty penalty = new Penalty();
//        penalty.setLoan(loan);
//        penalty.setPayed(false);
//        penalty.setPenaltyDate(LocalDate.now());
//        penalty.setStatus(StatusPenalty.PENDENTE);
//        penalty.setValuePenalty(getValuePenalty(loan));
//        penaltyRepository.save(penalty);
//    }
//    public void payPenalty(Long id) {
//        Penalty penalty = getPenaltyById(id);
//
//        if (penalty.getPayed()) {
//            throw new RuntimeException("Multa já foi paga");
//        }
//
//        penalty.setPayed(true);
//        penalty.setPayedDate(LocalDate.now());
//        penalty.setStatus(StatusPenalty.PAGO);
//        penaltyRepository.save(penalty);
//    }
//
//    //public Optional<Penalty> getPenaltiesByUser(User user){
//    //    return penaltyRepository.findByPenaltyByUser(user);
//    //}

}
