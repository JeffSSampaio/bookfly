package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.moviment.MovimentRequest;
import com.jefferson.bookfly_api.enums.TypeMoviment;
import com.jefferson.bookfly_api.models.*;
import com.jefferson.bookfly_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentService {

    private final MovimentRepository movimentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
 
    private final StockBookRepository stockBookRepository;
    private final StockService stockService;

    @Transactional
    public Moviment doMoviment(MovimentRequest request){


        if (request.qtd() <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }

        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Livro não existe no estoque"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não existe no estoque"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("Usuário não existe"));



        boolean isOutput= request.typeItem() == TypeMoviment.SAIDA;

        if (isOutput) {
            if (bookOnStock.getQtd() < request.qtd()) {
                throw new RuntimeException("Estoque insuficiente");
            }
            bookOnStock.setQtd(bookOnStock.getQtd() - request.qtd());
        } else {
            bookOnStock.setQtd(bookOnStock.getQtd() + request.qtd());
        }

        stockBookRepository.save(bookOnStock);

        Moviment moviment = new Moviment();
        moviment.setStockBook(bookOnStock);
        moviment.setUser(user);
        moviment.setTypeItem(request.typeItem());
        moviment.setQtd(request.qtd());
        moviment.setCreatedDate(LocalDate.now());

        return movimentRepository.save(moviment);
    }

    public List<Moviment> getAllMoviments(){
        return movimentRepository.findAll();
    }

    public Moviment getMoviment(Long id){
        return  movimentRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Movimentação inexistente no estoque") );
    }

    @Transactional
    public Moviment updateMoviment(Long id, MovimentRequest request){

        Moviment oldMoviment = movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada"));

        StockBook stockBook = oldMoviment.getStockBook();


        boolean wasOutput = oldMoviment.getTypeItem() == TypeMoviment.SAIDA;

        if (wasOutput) {
            stockBook.setQtd(stockBook.getQtd() + oldMoviment.getQtd());
        } else {
            if (stockBook.getQtd() < oldMoviment.getQtd()) {
                throw new RuntimeException("Erro ao reverter movimentação antiga");
            }
            stockBook.setQtd(stockBook.getQtd() - oldMoviment.getQtd());
        }

        if (request.qtd() <= 0) {
            throw new RuntimeException("Quantidade inválida");
        }

        boolean isNewOutput = request.typeItem() == TypeMoviment.SAIDA;

        if (isNewOutput) {
            if (stockBook.getQtd() < request.qtd()) {
                throw new RuntimeException("Estoque insuficiente");
            }
            stockBook.setQtd(stockBook.getQtd() - request.qtd());
        } else {
            stockBook.setQtd(stockBook.getQtd() + request.qtd());
        }

        stockBookRepository.save(stockBook);


        oldMoviment.setTypeItem(request.typeItem());
        oldMoviment.setQtd(request.qtd());

        return movimentRepository.save(oldMoviment);
    }

    @Transactional
    public void deleteMoviment(Long id){

        Moviment moviment = movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada"));

        StockBook stockBook = moviment.getStockBook();

        boolean isOutput = moviment.getTypeItem() == TypeMoviment.SAIDA;


        if (isOutput) {
            stockBook.setQtd(stockBook.getQtd() + moviment.getQtd());
        } else {
            if (stockBook.getQtd() < moviment.getQtd()) {
                throw new RuntimeException("Erro ao reverter movimentação");
            }
            stockBook.setQtd(stockBook.getQtd() - moviment.getQtd());
        }

        stockBookRepository.save(stockBook);

        movimentRepository.delete(moviment);
    }

}
