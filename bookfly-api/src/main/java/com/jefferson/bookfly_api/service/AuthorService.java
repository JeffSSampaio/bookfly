package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.config.AuditContext;
import com.jefferson.bookfly_api.enums.ItemEventAction;
import com.jefferson.bookfly_api.enums.RecordStatusValue;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.repository.AuthorRepository;
import com.jefferson.bookfly_api.repository.BookRepository;
import com.jefferson.bookfly_api.repository.StockBookRepository;
import com.jefferson.bookfly_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final StockBookRepository stockBookRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    @Auditable(
            action = "CRIAR_AUTOR",
            details = "REGISTRADO NOVO AUTOR:{authorName}"
    )
    public Author createAuthor(Author author) {
        if (author.getId() != null && authorRepository.existsById(author.getId())) {
            throw new NotFoundException("Esse Autor já existe no sistema com o ID: " + author.getId());
        }
        AuditContext.capture("authorName",author.getName());
        return authorRepository.save(author);
    }

    @Transactional
    @Auditable(
            action = "EDITAR_AUTOR",
            details = "EDITADO USUARIO {id}"
    )
    public Author editAuthor(Long id, Author newAuthor) {
        Author existAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Esse Author não existe no sistema"));

        if (newAuthor.getName() != null) {
            existAuthor.setName(newAuthor.getName());
        }

        Author savedAuthor = authorRepository.save(existAuthor);

        List<Book> booksWithAuthor = bookRepository.findActiveByAuthorsId(id);
        for (Book book : booksWithAuthor) {
            List<Author> authors = book.getAuthors();
            for (int i = 0; i < authors.size(); i++) {
                if (authors.get(i).getId().equals(id)) {
                    authors.set(i, savedAuthor);
                    break;
                }
            }
            bookRepository.save(book);
        }
        return savedAuthor;
    }

    @Transactional
    public Book addAuthorToBook(Long authorId, Long bookId) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new NotFoundException("Autor não encontrado"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Livro não encontrado"));

        if (!book.getAuthors().contains(author)) {
            book.getAuthors().add(author);
        }

        Book savedBook = bookRepository.save(book);

        List<StockBook> stockBooks = stockBookRepository.findByBook(savedBook);
        for (StockBook stockBook : stockBooks) {
            stockBookRepository.save(stockBook);
        }

        return savedBook;
    }

//    @Transactional
//    @Auditable(
//            action = "DELETAR_AUTOR",
//            details = "DELETADO AUTOR ID°{id} POR USUÁRIO {userId}"
//    )
//    public void deleteAuthor(Long id, Long userId) {
//        Author author = authorRepository.findById(id)
//                .orElseThrow(() -> new NotFoundException("Autor não encontrado para deleção"));
//        User existUser = userRepository.findById(userId)
//                .orElseThrow( () -> new NotFoundException("Este Usuário não existe para executar essa ação"));
//        List<Book> booksWithAuthor = bookRepository.findActiveByAuthorsId(id);
//        for (Book book : booksWithAuthor) {
//
//            if (book.getAuthors().size() == 1) {
//                throw new NotFoundException("Não é possível remover o único autor do livro: " + book.getTitle());
//            }
//
//            book.getAuthors().removeIf(a -> a.getId().equals(id));
//            bookRepository.save(book);
//        }
//
//        author.getRecordStatus().delete(existUser);
//
//        authorRepository.save(author);
//    }

    @Transactional
    @Auditable(
            action = "DELETAR_AUTOR",
            details = "DELETADO AUTOR ID°{id} POR USUÁRIO {userId}"
    )
    public void deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Autor não encontrado para deleção"));

        List<Book> booksWithAuthor = bookRepository.findActiveByAuthorsId(id);
        for (Book book : booksWithAuthor) {

            if (book.getAuthors().size() == 1) {
                throw new NotFoundException("Não é possível remover o único autor do livro: " + book.getTitle());
            }

            book.getAuthors().removeIf(a -> a.getId().equals(id));
            bookRepository.save(book);
        }

        author.getRecordStatus().setRecordStatusValue(RecordStatusValue.DELETED);
        author.getRecordStatus().setDateTime(LocalDateTime.now());

        authorRepository.save(author);
    }



    public Page<Author> findAll(String search, Pageable pageable) {

        if (search == null || search.isBlank()) {
            return authorRepository.findAll(pageable);
        }

        return authorRepository.search(
                search,
                pageable
        );
    }

    public Page<Author> findAll( Pageable pageable){
        return authorRepository.findAll(pageable);
    }

}