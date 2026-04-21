package com.jefferson.bookfly_api.repository;

import com.jefferson.bookfly_api.models.Estoque;
import com.jefferson.bookfly_api.models.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque,Long> {

}
