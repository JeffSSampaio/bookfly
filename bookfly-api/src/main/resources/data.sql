-- =========================================================
-- USUÁRIOS
-- =========================================================

INSERT INTO usuario (
    name,
    email,
    password,
    role,
    record_status_value,
    status_date_time
)
SELECT *
FROM (
         VALUES
             (
                 'user',
                 'user@gmail.com',
                 'us',
                 'USER',
                 'ACTIVE',
                 NOW()
             ),
             (
                 'admin',
                 'admin@gmail.com',
                 'ad',
                 'ADMIN',
                 'ACTIVE',
                 NOW()
             ),
             (
                 'Bibliotecario',
                 'bibliotecario@gmail.com',
                 'bb',
                 'BIBLIOTECARIO',
                 'ACTIVE',
                 NOW()
             )

     ) AS v(
            name,
            email,
            password,
            role,
            record_status_value,
            status_date_time
    )
WHERE NOT EXISTS (
    SELECT 1 FROM usuario
);



-- =========================================================
-- ESTOQUE
-- =========================================================

INSERT INTO estoque (
    id
)
SELECT *
FROM (
         VALUES
             (1)
     ) AS v(id)
WHERE NOT EXISTS (
    SELECT 1 FROM estoque
);



-- =========================================================
-- AUTORES
-- =========================================================

INSERT INTO autor (
    name,
    record_status_value,
    status_date_time,
    status_user_id
)
SELECT *
FROM (
         VALUES
             (
                 'J. R. R. Tolkien',
                 'ACTIVE',
                 NOW(),
                 2

             ),
             (
                 'Stephen King',
                 'ACTIVE',
                 NOW(),
                 2
             ),
             (
                 'Edgar Allan Poe',
                 'ACTIVE',
                 NOW(),
                 2
             )
     ) AS v(
            name,
            record_status_value,
            status_date_time,
            status_user_id
    )
WHERE NOT EXISTS (
    SELECT 1 FROM autor
);



-- =========================================================
-- LIVROS
-- =========================================================

INSERT INTO livro (
    title,
    cover,
    summary,
    record_status_value,
    status_date_time,
    status_user_id
)
SELECT *
FROM (
         VALUES

             (
                 'O Hobbit',
                 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHmkcR1BUTUEMz3gtzlkRM2Lb73oWVcU7S0A&s',
                 'O livro narra a jornada de Bilbo Bolseiro, um hobbit pacato que é arrastado para uma aventura pelo mago Gandalf e treze anões.',
                 'ACTIVE',
                 NOW(),
                 2
             ),

             (
                 'O Senhor dos Anéis: A Sociedade do Anel',
                 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHB8qZ_YJcBCgxXcnR6GhGMoA4IxKtlZnAoQ&s',
                 'O Um Anel passa para as mãos de Frodo Bolseiro.',
                 'ACTIVE',
                 NOW(),
                 2
             ),

             (
                 'It: A Coisa',
                 'https://m.media-amazon.com/images/I/91g9Dvtf+jL._UF1000,1000_QL80_.jpg',
                 'Grupo de amigos enfrenta Pennywise na cidade de Derry.',
                 'ACTIVE',
                 NOW(),
                 2
             ),

             (
                 'Histórias Extraordinárias',
                 'https://m.media-amazon.com/images/I/91J4ze7NJlL._AC_UF1000,1000_QL80_.jpg',
                 'Coletânea com os contos mais famosos de Edgar Allan Poe.',
                 'ACTIVE',
                 NOW(),
                 2
             )

     ) AS v(
            title,
            cover,
            summary,
            record_status_value,
            status_date_time,
            status_user_id
    )
WHERE NOT EXISTS (
    SELECT 1 FROM livro
);



-- =========================================================
-- ESTOQUE_LIVRO
-- =========================================================

INSERT INTO estoque_livro (
    qtd,
    estoque_id,
    livro_id,
    record_status_value,
    status_date_time,
    status_user_id
)
SELECT *
FROM (
         VALUES
             (
                 10,
                 1,
                 1,
                 'ACTIVE',
                 NOW(),
                 2
             ),
             (
                 5,
                 1,
                 2,
                 'ACTIVE',
                 NOW(),
                 2
             ),
             (
                 7,
                 1,
                 3,
                 'ACTIVE',
                 NOW(),
                 2
             ),
             (
                 3,
                 1,
                 4,
                 'ACTIVE',
                 NOW(),
                 2
             )
     ) AS v(
            qtd,
            estoque_id,
            livro_id,
            record_status_value,
            status_date_time,
            status_user_id
    )
WHERE NOT EXISTS (
    SELECT 1 FROM estoque_livro
);



-- =========================================================
-- LIVRO_AUTOR
-- =========================================================

INSERT INTO livro_author (
    livro_id,
    autor_id
)
SELECT *
FROM (
         VALUES
             (1, 1),
             (2, 1),
             (3, 2),
             (4, 3)
     ) AS v(
            livro_id,
            autor_id
    )
WHERE NOT EXISTS (
    SELECT 1 FROM livro_author
);



-- =========================================================
-- LIVRO_GENERO
-- =========================================================

INSERT INTO livro_genero (
    livro_id,
    genders
)
SELECT *
FROM (
         VALUES
             (1, 'FANTASIA'),
             (2, 'FANTASIA'),
             (2, 'ACAO'),
             (3, 'TERROR'),
             (4, 'TERROR')
     ) AS v(
            livro_id,
            genders
    )
WHERE NOT EXISTS (
    SELECT 1 FROM livro_genero
);



-- =========================================================
-- EMPRÉSTIMOS
-- =========================================================

INSERT INTO emprestimo (
    usuario_id,
    livro_id,
    loan_date,
    return_date,
    loan_status,
    record_status_value,
    status_date_time
)
SELECT *
FROM (
         VALUES
             (
                 1,
                 1,
                 TIMESTAMP '2026-04-01 09:00:00',
                 TIMESTAMP '2026-04-15 09:00:00',
                 'ATRASADO',
                 'ACTIVE',
                 NOW()
             )
     ) AS v(
            usuario_id,
            livro_id,
            loan_date,
            return_date,
            loan_status,
            record_status_value,
            status_date_time
    )
WHERE NOT EXISTS (
    SELECT 1 FROM emprestimo
);



-- =========================================================
-- MULTAS
-- =========================================================

INSERT INTO multa (
    emprestimo_id,
    penalty_date,
    amount,
    penalty_status,
    paid,
    record_status_value,
    status_date_time
)
SELECT *
FROM (
         VALUES
             (
                 1,
                 TIMESTAMP '2026-04-16 09:00:00',
                 22.50,
                 'PENDENTE',
                 false,
                 'ACTIVE',
                 NOW()
             )
     ) AS v(
            emprestimo_id,
            penalty_date,
            amount,
            penalty_status,
            paid,
            record_status_value,
            status_date_time
    )
WHERE NOT EXISTS (
    SELECT 1 FROM multa
);