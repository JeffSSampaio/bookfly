package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Bookcase;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.repository.BookcaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookcaseService {



//    private final BookcaseRepository estanteRepository;
//
//    public List<Bookcase> getAllBookcases(){
//        return estanteRepository.findAll();
//    }
//
//    public void createBookcase(Bookcase bookcase){
//        estanteRepository.save(bookcase);
//    }
//
//    public void addBooksOnBookcase(List<Book> books, Bookcase bookcase){
//
//          List<Book> booksBookcase  = bookcase.getBooks();
//          books.forEach(b -> {
//              Optional<Book> existBooks = booksBookcase.stream()
//                      .filter(book -> book.getTitle().equalsIgnoreCase(b.getTitle()))
//                      .findFirst();
//
//              if (existBooks.isEmpty()){
//                   booksBookcase.add(b);
//                  estanteRepository.save(bookcase);
//              }
//
//          });
//
//    }
//
//
//    public void addBookOnBookcase(Book book, Bookcase bookcase) {
//
//        List<Book> booksBookcase = bookcase.getBooks();
//
//        Optional<Book> existBook = booksBookcase.stream()
//                .filter(b -> b.getTitle().equalsIgnoreCase(book.getTitle()))
//                .findFirst();
//
//        if (existBook.isEmpty()) {
//            booksBookcase.add(book);
//            estanteRepository.save(bookcase);
//        }
//    }
//
//    public void removeBookOnBookcase(Book book, Bookcase bookcase) {
//
//        List<Book> booksBookcase = bookcase.getBooks();
//
//        Optional<Book> existBook = booksBookcase.stream()
//                .filter(b -> b.getTitle().equalsIgnoreCase(book.getTitle()))
//                .findFirst();
//
//        if (existBook.isPresent()) {
//            booksBookcase.remove(existBook.get());
//            estanteRepository.save(bookcase);
//        }
//    }
//
//    public void removeBooksOnBookcase(ArrayList<Book> books, Bookcase bookcase) {
//
//        List<Book> booksBookcase = bookcase.getBooks();
//
//        books.forEach(book -> {
//            Optional<Book> existBook = booksBookcase.stream()
//                    .filter(b -> b.getTitle().equalsIgnoreCase(book.getTitle()))
//                    .findFirst();
//
//            if (existBook.isPresent()) {
//                booksBookcase.remove(existBook.get());
//                estanteRepository.save(bookcase);
//            }
//        });
//    }
//
//    public Bookcase getBookcaseById(Long id) {
//        return estanteRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Bookcase não encontrada"));
//    }
//
//
//    public void deleteBookcase(Long id) {
//        estanteRepository.deleteById(id);
//    }
}
