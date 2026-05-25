package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Author;
import com.jefferson.bookfly_api.models.Book;
import com.jefferson.bookfly_api.models.StockBook;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.AuthorRepository;
import com.jefferson.bookfly_api.repository.BookRepository;
import com.jefferson.bookfly_api.repository.StockBookRepository;
import com.jefferson.bookfly_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final StockBookRepository stockBookRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;


    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Author createAuthor(Author author) {
        if (author.getId() != null && authorRepository.existsById(author.getId())) {
            throw new RuntimeException("Esse Author já existe no sistema com o ID: " + author.getId());
        }
        return authorRepository.save(author);
    }

    @Transactional
    public Author editAuthor(Long id, Author newAuthor) {
        Author existAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Esse Author não existe no sistema"));

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
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

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

    @Transactional
    public void deleteAuthor(Long id, Long userId) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor não encontrado para deleção"));
        User existUser = userRepository.findById(userId)
                .orElseThrow( () -> new RuntimeException("Este Usuário não existe para executar essa ação"));
        List<Book> booksWithAuthor = bookRepository.findActiveByAuthorsId(id);
        for (Book book : booksWithAuthor) {

            if (book.getAuthors().size() == 1) {
                throw new RuntimeException("Não é possível remover o único autor do livro: " + book.getTitle());
            }
            
            book.getAuthors().removeIf(a -> a.getId().equals(id));
            bookRepository.save(book);
        }

        author.getRecordStatus().delete(existUser);

        authorRepository.save(author);
    }
}