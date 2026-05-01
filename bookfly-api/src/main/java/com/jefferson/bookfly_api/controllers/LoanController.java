package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.loan.LoanRequest;
import com.jefferson.bookfly_api.dto.loan.LoanSummary;
import com.jefferson.bookfly_api.dto.loan.LoanByUserBooksSumary;
import com.jefferson.bookfly_api.dto.user.UserOnlyRequest;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.service.LoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Tag(name = "Empréstimos", description = "Gerenciamento de empréstimos de livros")
public class LoanController {

    private final LoanService loanService;

    @Operation(summary = "Listar todos os empréstimos")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/list")
    public ResponseEntity<List<LoanSummary>> getAllLoans() {
        List<Loan> allLoans = loanService.getAllLoans();
        return ResponseEntity.ok()
                .body(
                        allLoans.stream()
                                .map(LoanSummary::from)
                                .toList()
                );
    }

    @Operation(summary = "Criar empréstimo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Empréstimo criado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Livro ou usuário não encontrado")
    })
    @PostMapping("/create")
    public ResponseEntity<LoanSummary> createLoan(@RequestBody LoanRequest request) {
        Loan loaned = loanService.doLoanBook(
                request.bookId(),
                request.userId(),
                request.returnDateBook()
        );
        return ResponseEntity.ok().body(LoanSummary.from(loaned));
    }

    @Operation(summary = "Devolver livro")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro devolvido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Empréstimo não encontrado")
    })
    @PutMapping("/return/{loanId}")
    public ResponseEntity<LoanSummary> updateLoan(@PathVariable long loanId) {
        Loan loanReturned = loanService.returnBook(loanId);
        return ResponseEntity.ok().body(LoanSummary.from(loanReturned));
    }

    @Operation(summary = "Listar empréstimos por usuário")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @GetMapping("/list-loans-user")
    public ResponseEntity<List<LoanByUserBooksSumary>> getAllLoansByUser(@RequestBody UserOnlyRequest userOnlyRequest) {
        List<Loan> existLoan = loanService.findAllLoansByUser(userOnlyRequest.userId());
        return ResponseEntity.ok()
                .body(
                        existLoan.stream()
                                .map(LoanByUserBooksSumary::from)
                                .toList()
                );
    }
}