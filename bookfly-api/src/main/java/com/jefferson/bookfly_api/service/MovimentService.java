package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Stock;
import com.jefferson.bookfly_api.models.Moviment;
import com.jefferson.bookfly_api.repository.MovimentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentService {

    private final MovimentRepository movimentRepository;


    public List<Moviment> getAllMoviments() {
        return movimentRepository.findAll();
    }

    public void addMoviment(Stock stock, Loan loan, TypeMoviment tipo) {
        Moviment moviment = new Moviment();
        moviment.setStock(stock);
        moviment.setLoan(loan);
        moviment.setQtd(1);
        moviment.setTypeItem(tipo);
        moviment.setCreatedDate(LocalDate.now());
        movimentRepository.save(moviment);
    }

    public Moviment getMovimentById(Long id) {
        return movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada"));
    }


    public List<Moviment> getMovimentByStock(Stock stock) {
        return movimentRepository.findByStock(stock);
    }


    public List<Moviment> getMovimentsByLoan(Loan loan) {
        return movimentRepository.findByLoan(loan);
    }

}