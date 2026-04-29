package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.loan.LoanRequest;
import com.jefferson.bookfly_api.dto.loan.LoanSummary;
import com.jefferson.bookfly_api.dto.loan.LoanUserBookSumary;
import com.jefferson.bookfly_api.dto.loan.LoanByUserBooksSumary;
import com.jefferson.bookfly_api.dto.user.UserOnlyRequest;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;


    @GetMapping("/list")
    public ResponseEntity<List<LoanSummary>> getAllLoans(){
        List<Loan> allLoans = loanService.getAllLoans();
        return ResponseEntity.ok()
                .body(
                        allLoans.stream()
                                .map(LoanSummary::from)
                                .toList()
                );
    }

    @PostMapping("/create")
    public ResponseEntity<LoanSummary> createLoan(@RequestBody LoanRequest request){
        Loan loaned= loanService.doLoanBook(request);
        return ResponseEntity
                .ok()
                .body(LoanSummary.from(loaned));

    }

    @GetMapping("/list-loans-user")
    public ResponseEntity<List<LoanByUserBooksSumary>> getAllLoansByUser(UserOnlyRequest userOnlyRequest){
       List<Loan> existLoan =  loanService.findAllLoansByUser(userOnlyRequest.userId());
        return ResponseEntity.ok()
                .body(
                        existLoan.stream()
                                .map(LoanByUserBooksSumary::from)
                                .toList()
                );
    }

}
