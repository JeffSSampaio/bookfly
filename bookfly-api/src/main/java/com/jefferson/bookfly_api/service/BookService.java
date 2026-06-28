package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.config.AuditContext;
import com.jefferson.bookfly_api.dto.book.BookDetail;
import com.jefferson.bookfly_api.dto.book.BookRequest;
import com.jefferson.bookfly_api.enums.Gender;
import com.jefferson.bookfly_api.enums.ItemEventAction;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.events.ItemEvent;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.AuthorRepository;
import com.jefferson.bookfly_api.repository.BookRepository;
import com.jefferson.bookfly_api.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    @Auditable(
            action = "REGISTRAR_LIVRO",
            details = "REGISTRADO LIVRO NO SISTEMA"
    )
    public Book createBook(Book book){
   ;
//        Book existBookDeleted = bookRepository.findById(book.getId())
//                .orElseThrow(() -> new NotFoundException("Esse Livro nâo existe no sistema"));
//        if (existBookDeleted.getRecordStatus().getRecordStatusValue().equals(RecordStatusValue.DELETED) &&
//                existBookDeleted.getId().equals(book.getId())
//        ){
//            existBookDeleted.getRecordStatus().setRecordStatusValue(RecordStatusValue.ACTIVE);
//            existBookDeleted.getRecordStatus().setDateTime(LocalDateTime.now());
//            return bookRepository.save(existBookDeleted);
//        }

        List<Author> authors = new ArrayList<>();

        for (Author author : book.getAuthors()) {

            Author authorExist = authorRepository
                    .findByNameIgnoreCase(author.getName())
                    .orElse(null);

            if (authorExist != null) {
                authors.add(authorExist);
            } else {
                Author newAuthor = new Author();
                newAuthor.setName(author.getName());

                Author savedAuthor = authorRepository.save(newAuthor);
                authors.add(savedAuthor);
            }
        }
        List<Gender> genders = book.getGenders()
                .stream()
                .distinct()
                .toList();

        String sumaryExists  = book.getSummary() !=null ? book.getSummary() : "Sem sumario";

        Book bookToSave = new Book();
        bookToSave.setTitle(book.getTitle());
        bookToSave.setCover(book.getCover());
        bookToSave.setSummary(sumaryExists);
        bookToSave.setAuthors(authors);
        bookToSave.setGenders(genders);

        boolean existBook = bookRepository
                .existsActiveByTitleAndAuthors(bookToSave.getTitle(), authors);

        if (existBook){
            throw new NotFoundException("Livro já cadastrado");
        }

        System.out.println("\nLivro cadastrado " + book);
        eventPublisher.publishEvent(new ItemEvent("books", ItemEventAction.CREATED));
        return bookRepository.save(bookToSave);
    }

    @Auditable(
            action = "REGISTRAR_LIVRO",
            details = "REGISTROU LIVRO POR ID°{bookId} E POR USUÁRIO ID°{userId} "
    )
    public Book createBook(Long userId,Book book){
        User user= userRepository.findById(userId)
                .orElseThrow(()-> new NotFoundException("Este Usuario não existe no sistema"));
        Book existBookDeleted = bookRepository.findById(book.getId())
                .orElseThrow(() -> new NotFoundException("Esse Livro nâo existe no sistema"));
        if (existBookDeleted.getRecordStatus().getRecordStatusValue().equals(RecordStatusValue.DELETED) &&
            existBookDeleted.getId().equals(book.getId())
        ){
            existBookDeleted.getRecordStatus().active(user);
            return bookRepository.save(existBookDeleted);
        }
        AuditContext.capture("bookId",book.getId());

        List<Author> authors = new ArrayList<>();



        for (Author author : book.getAuthors()) {

            Author authorExist = authorRepository
                    .findByNameIgnoreCase(author.getName())
                    .orElse(null);

            if (authorExist != null) {
                authors.add(authorExist);
            } else {
                Author newAuthor = new Author();
                newAuthor.setName(author.getName());

                Author savedAuthor = authorRepository.save(newAuthor);
                authors.add(savedAuthor);
            }
        }
        List<Gender> genders = book.getGenders()
                .stream()
                .distinct()
                .toList();

        String sumaryExists  = book.getSummary() !=null ? book.getSummary() : "Sem sumario";

        Book bookToSave = new Book();
        bookToSave.setTitle(book.getTitle());
        bookToSave.setCover(book.getCover());
        bookToSave.setSummary(sumaryExists);
        bookToSave.setAuthors(authors);
        bookToSave.setGenders(genders);

        boolean existBook = bookRepository
                .existsActiveByTitleAndAuthors(bookToSave.getTitle(), authors);

        if (existBook){
            throw new NotFoundException("Livro já cadastrado");
        }

        System.out.println("\nLivro cadastrado " + book);
        eventPublisher.publishEvent(new ItemEvent("books", ItemEventAction.CREATED));
        return bookRepository.save(bookToSave);
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Livro não encontrado"));
    }
//    @Transactional
//    @Auditable(
//            action = "ATUALIZAR_LIVRO",
//            details = "USUÁRIO {userId} ATUALIZOU LIVRO ID°{bookId}"
//    )
//    public Book updateBook(Long id,Long userId, Book book){
//        Book existBook = bookRepository.findById(id)
//                .orElseThrow(() -> new NotFoundException("Livro não existe"));
//
//            if (existBook.getRecordStatus().getRecordStatusValue() == RecordStatusValue.DELETED){
//                User currentUser = userRepository.findById(userId)
//                        .orElseThrow(()-> new NotFoundException("Este Usuario não existe para executar essa ação"));
//                existBook.getRecordStatus().active(currentUser);
//            }
//        String sumaryExists  = book.getSummary() !=null ? book.getSummary() : "Sem sumario";
//
//        if (book.getTitle() != null) existBook.setTitle(book.getTitle());
//        if (book.getCover() != null) existBook.setCover(book.getCover());
//        if (book.getGenders() != null) existBook.setGenders(book.getGenders());
//        if (book.getSummary() != null) existBook.setSummary(sumaryExists);
//
//
//        if (book.getAuthors() != null) {
//            List<Author> updatedAuthors = new ArrayList<>();
//
//            for (Author author : book.getAuthors()) {
//                Author managedAuthor = authorRepository.findByName(author.getName())
//                        .orElseGet(() -> {
//                            Author newAuthor = new Author();
//                            newAuthor.setName(author.getName());
//                            return authorRepository.save(newAuthor);
//                        });
//                updatedAuthors.add(managedAuthor);
//            }
//            existBook.setAuthors(updatedAuthors);
//        }
//        AuditContext.capture("bookId",existBook.getId());
//        eventPublisher.publishEvent(new ItemEvent("books", ItemEventAction.UPDATED));
//        return bookRepository.save(existBook);
//    }



    @Transactional
    @Auditable(
            action = "ATUALIZAR_LIVRO",
            details = "USUÁRIO {userId} ATUALIZOU LIVRO ID°{bookId}"
    )
    public Book updateBook(Long id, Book book){
        Book existBook = bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Livro não existe"));

        String sumaryExists  = book.getSummary() !=null ? book.getSummary() : "Sem sumario";

        if (book.getTitle() != null) existBook.setTitle(book.getTitle());
        if (book.getCover() != null) existBook.setCover(book.getCover());
        if (book.getGenders() != null) existBook.setGenders(book.getGenders());
        if (book.getSummary() != null) existBook.setSummary(sumaryExists);


        if (book.getAuthors() != null) {
            List<Author> updatedAuthors = new ArrayList<>();

            for (Author author : book.getAuthors()) {
                Author managedAuthor = authorRepository.findByName(author.getName())
                        .orElseGet(() -> {
                            Author newAuthor = new Author();
                            newAuthor.setName(author.getName());
                            return authorRepository.save(newAuthor);
                        });
                updatedAuthors.add(managedAuthor);
            }
            existBook.setAuthors(updatedAuthors);
        }
        AuditContext.capture("bookId",existBook.getId());
        eventPublisher.publishEvent(new ItemEvent("books", ItemEventAction.UPDATED));
        return bookRepository.save(existBook);
    }
    @Auditable(
            action = "LISTAR_LIVROS",
            details = "LISTAR TODOS OS LIVROS"
    )
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Auditable(
            action = "lISTAR_lIVROS_ATIVOS",
            details = "LISTAR TODOS OS LIVROS ATIVOS"
    )
    public List<Book> findAllBooksActive(){
        return bookRepository.findAll()
                .stream()
                .filter( book -> book.getRecordStatus().getRecordStatusValue() == RecordStatusValue.ACTIVE)
                .sorted(Comparator.comparing(Book::getId))
                .toList();
    }

    public List<Book> findBookByAutor(Long autorId) {
        return bookRepository.findActiveByAuthorsId(autorId);
    }

    public void activeBook(Long id, User currentUser){
        Book book = bookRepository.findById(id)
                .filter( b -> b.getRecordStatus().getRecordStatusValue() == RecordStatusValue.DELETED)
                .orElseThrow(()-> new NotFoundException("Livro nâo Encontrado"));
        userRepository.findById(currentUser.getId())
                .orElseThrow(()-> new NotFoundException("Este Usuário não existe para realizar a ação de deletar."));
        book.getRecordStatus().active(currentUser);
        bookRepository.save(book);
        eventPublisher.publishEvent(new ItemEvent("books", ItemEventAction.UPDATED));
    }

//    @Transactional
//    @Auditable(
//            action = "REMOVER_LIVRO",
//            details = "USUARIO {userId} REMOVEU LIVRO ID°{bookId}"
//    )
//    public void removeBook(Long id, Long userId){
//        Book book = bookRepository.findById(id).orElseThrow(()-> new NotFoundException("Livro Não EnContrado"));
//        User existUser = userRepository.findById(userId)
//                 .orElseThrow(()-> new NotFoundException("Este Usuário não existe para realizar a ação de deletar."));
//        book.getRecordStatus().delete(existUser);
//        AuditContext.capture("bookId",book.getId());
//        bookRepository.save(book);
//        eventPublisher.publishEvent(new ItemEvent("books", ItemEventAction.DELETED));
//    }


    @Auditable(
            action = "REMOVER_LIVRO",
            details = "USUARIO {userId} REMOVEU LIVRO ID°{bookId}"
    )
    public Book removeBook(Long id){
        Book book = bookRepository.findById(id).orElseThrow(()-> new NotFoundException("Livro Não EnContrado"));

        book.getRecordStatus().setRecordStatusValue(RecordStatusValue.DELETED);
        book.getRecordStatus().setDateTime(LocalDateTime.now());
        AuditContext.capture("bookId",book.getId());
        bookRepository.save(book);
        eventPublisher.publishEvent(new ItemEvent("books", ItemEventAction.DELETED));
        return book;
    }


    public List<Book> findByTitle(String title) {
        return bookRepository.findActiveByTitleContaining(title);
    }

    public Page<Book> findAll(String search, Pageable pageable) {

        if (search == null || search.isBlank()) {
            return bookRepository.findAll(pageable);
        }

        return bookRepository.search(
                search,
                pageable
        );
    }

    public Page<Book> findAll(Pageable pageable){
        return bookRepository.findAll(pageable);
    }
}
