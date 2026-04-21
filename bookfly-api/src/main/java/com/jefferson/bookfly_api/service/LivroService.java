package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.models.Livro;
import com.jefferson.bookfly_api.repository.LivroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LivroService {

    private final LivroRepository livroRepository;

    public Livro findById(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
    }

    public List<Livro> findAll() {
        return livroRepository.findAll();
    }

    public List<Livro> findByAutor(Long autorId) {
        return livroRepository.findByAutorId(autorId);
    }

    public List<Livro> findAvailable() {
        return livroRepository.findByQtdGreaterThan(0);
    }

    public List<Livro> findByTitle(String title) {
        return livroRepository.findByTitleContainingIgnoreCase(title);
    }
}
