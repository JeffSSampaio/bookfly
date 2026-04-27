package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.moviment.MovimentQtdRequest;
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
    public Moviment doMoviment(MovimentQtdRequest request){


        Stock stock = stockService.getStock();

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Livro não esta registrado"));

        StockBook bookOnStock = stockBookRepository.findByStockAndBook(stock, book)
                .orElseThrow(() -> new RuntimeException("Livro não existe no estoque"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("Usuário não existe"));

       int delta = request.qtd();

       int newQtd = bookOnStock.getQtd() + delta;



       if(delta < 0){

           if (newQtd < 0){
               throw new RuntimeException("Quantidade insuficiente no Estoque");
           }
           bookOnStock.setQtd(newQtd);
           Moviment moviment = new Moviment();
           moviment.setStockBook(bookOnStock);
           moviment.setUser(user);
           moviment.setTypeItem(TypeMoviment.SAIDA);
           moviment.setQtdMoviment(newQtd);
           moviment.setCreatedDate(LocalDate.now());
           stockBookRepository.save(bookOnStock);
           return movimentRepository.save(moviment);
       } else if (delta > 0){
           bookOnStock.setQtd(newQtd);
           Moviment moviment = new Moviment();
           moviment.setStockBook(bookOnStock);
           moviment.setUser(user);
           moviment.setTypeItem(TypeMoviment.ENTRADA);
           moviment.setQtdMoviment(newQtd);
           moviment.setCreatedDate(LocalDate.now());
           stockBookRepository.save(bookOnStock);
           return movimentRepository.save(moviment);

        } else {
           throw new RuntimeException("Não foi possivel fazer movimentação");
       }



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
                .orElseThrow(() -> new RuntimeException("Movimentação inexistente no estoque"));

        StockBook stockBook = oldMoviment.getStockBook();


        boolean wasOutput = oldMoviment.getTypeItem() == TypeMoviment.SAIDA;

        if (wasOutput) {
            stockBook.setQtd(stockBook.getQtd() + oldMoviment.getQtdMoviment());
        } else {
            if (stockBook.getQtd() < oldMoviment.getQtdMoviment()) {
                throw new RuntimeException("Erro ao reverter movimentação antiga");
            }
            stockBook.setQtd(stockBook.getQtd() - oldMoviment.getQtdMoviment());
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

        User user = userRepository.findById(request.userId())
                .orElseThrow( ()-> new RuntimeException("Usuario não existe"));

        oldMoviment.setUser(user);
        oldMoviment.setTypeItem(request.typeItem());
        oldMoviment.setQtdMoviment(request.qtd());

        return movimentRepository.save(oldMoviment);
    }

    @Transactional
    public void deleteMoviment(Long id){

        Moviment moviment = movimentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimentação não encontrada"));

        StockBook stockBook = moviment.getStockBook();

        boolean isOutput = moviment.getTypeItem() == TypeMoviment.SAIDA;


        if (isOutput) {
            stockBook.setQtd(stockBook.getQtd() + moviment.getQtdMoviment());
        } else {
            if (stockBook.getQtd() < moviment.getQtdMoviment()) {
                throw new RuntimeException("Erro ao reverter movimentação");
            }
            stockBook.setQtd(stockBook.getQtd() - moviment.getQtdMoviment());
        }

        stockBookRepository.save(stockBook);

        movimentRepository.delete(moviment);
    }

}
