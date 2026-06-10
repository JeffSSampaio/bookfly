package com.jefferson.bookfly_api.controllers;

import com.jefferson.bookfly_api.dto.loan.*;
import com.jefferson.bookfly_api.dto.user.UserOnlyRequest;
import com.jefferson.bookfly_api.models.Loan;
import com.jefferson.bookfly_api.models.Moviment;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.service.LoanService;
import com.jefferson.bookfly_api.service.PdfService;
import com.jefferson.bookfly_api.strategy.pdf.LoanPdfStrategy;
import com.jefferson.bookfly_api.strategy.pdf.MovimentPdfStrategy;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Tag(name = "Empréstimos", description = "Gerenciamento de empréstimos de livros")
public class LoanController {

    private final LoanService loanService;
    private final PdfService pdfService;

    @Operation(summary = "Listar todos os empréstimos")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/list/all")
    public ResponseEntity<List<LoanSummary>> getAllLoans() {
        List<Loan> allLoans = loanService.getAllLoans();
        return ResponseEntity.ok()
                .body(
                        allLoans.stream()
                                .map(LoanSummary::from)
                                .toList()
                );
    }



    @Operation(summary = "Listar todos os empréstimos ativos")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/list")
    public ResponseEntity<List<LoanSummary>> getAllActive() {
        List<Loan> allLoans = loanService.getAllLoansActive();
        return ResponseEntity.ok()
                .body(
                        allLoans.stream()
                                .map(LoanSummary::from)
                                .toList()
                );
    }


    @Operation(summary = "Listar um Livro emprestado a um usuário")
    @ApiResponse(responseCode = "200", description = "Livro retornada com sucesso")
    @GetMapping("/list/user/{userId}/book/{bookId}")
    public ResponseEntity<LoanSummary> getBookByLoanForUser(@PathVariable Long userId, @PathVariable Long bookId) {
        Loan loanExist = loanService.findByBookOnLoanForUser(userId,bookId);
        return ResponseEntity.ok()
                .body(
                       LoanSummary.from(loanExist)
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
                request.userId()
        );
        return ResponseEntity.ok().body(LoanSummary.from(loaned));
    }

    @Operation(summary = "Devolver livro")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro devolvido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Empréstimo não encontrado")
    })
    @PutMapping("/return/{loanId}")
    public ResponseEntity<LoanSummary> returnBook(@PathVariable long loanId) {
        Loan loanReturned = loanService.returnBook(loanId);
        return ResponseEntity.ok().body(LoanSummary.from(loanReturned));
    }
    @Operation(summary = "Editar Emprestimo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Empréstimo Editado com Sucesso!"),
            @ApiResponse(responseCode = "404", description = "Empréstimo não encontrado")
    })
    @PutMapping("/edit/{loanId}")
    public ResponseEntity<LoanSummary> updateLoan(@PathVariable long loanId, @RequestBody LoanUpdateRequest request) {
        Loan newLoan = new Loan();
        newLoan.setId(loanId);

        if (request.stockBookId() != null) {
            StockBook stockBook = new StockBook();
            stockBook.setId(request.stockBookId());
            newLoan.setStockBook(stockBook);
        }

        if (request.userId() != null) {
            User user = new User();
            user.setId(request.userId());
            newLoan.setUser(user);
        }

        newLoan.setStatus(request.status());
        newLoan.setReturnDate(request.returnDate());
        newLoan.setLoanDate(request.loanDate());

        return ResponseEntity.ok().body(LoanSummary.from(loanService.updateLoan(loanId, newLoan)));
    }


    @Operation(summary = "Cancelar Emprestimo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Emprestimo de livro cancelado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Empréstimo não encontrado")
    })
    @PutMapping("/cancel/{loanId}")
    public ResponseEntity<CancelLoanResponse> cancelLoan(@PathVariable long loanId) {
       Moviment loanCanceled = loanService.cancelLoan(loanId);
        return ResponseEntity.ok().body(CancelLoanResponse.from(loanId,loanCanceled));
    }

    @Operation(summary = "Listar empréstimos por usuário")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @GetMapping("/list-loans-user/{userId}")
    public ResponseEntity<List<LoanByUserBooksSumary>> getAllLoansByUser(@PathVariable Long userId) {
        List<Loan> existLoan = loanService.findAllLoansByUser(userId);
        return ResponseEntity.ok()
                .body(
                        existLoan.stream()
                                .map(LoanByUserBooksSumary::from)
                                .toList()
                );
    }

    @Operation(summary = "Ativar Emprestimo")
    @ApiResponses({
            @ApiResponse(responseCode = "200",description = "Empréstimo Ativado!"),
            @ApiResponse(responseCode = "404",description = "Não Encontrado")
    })
    @PutMapping("/activate/loan/{loanId}/user/{userId}")
    public ResponseEntity<Map<String, String>>activateLoan(@PathVariable Long loanId,@PathVariable Long userId){
        loanService.activateLoanBook(loanId,userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Empréstimo ativado com sucesso!");

        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Deletar Emprestimo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Emrpestimo deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Emprestimo não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id, Long userId){
        loanService.removeLoan(id,userId);
        return ResponseEntity.noContent().build();
    }



    @Operation(summary = "Exportar PDF")
    @ApiResponse(
            responseCode = "200",
            description = "PDF gerado com sucesso"
    )
    @GetMapping(
            value = "/pdf",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public void exportPDF(HttpServletResponse response)
            throws IOException {
        response.setContentType("application/pdf");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=relatorioEmprestimos.pdf"
        );
        List<Loan> loans = loanService.getAllLoans();

        LoanPdfStrategy strategy = new LoanPdfStrategy();

        pdfService.export(
                response,
                loans,
                strategy
        );


    }
}