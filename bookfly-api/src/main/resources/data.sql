INSERT INTO usuario (name, email, password, role)
SELECT * FROM (VALUES
                   ('user', 'user@gmail.com', 'us', 'USER'),
                   ('admin', 'admin@gmail.com', 'ad', 'ADMIN')
              ) AS v(name, email, password, role)
WHERE NOT EXISTS (SELECT 1 FROM usuario LIMIT 1);


INSERT INTO autor (name)
SELECT * FROM (VALUES
                   ('J. R. R. Tolkien'),
                   ('Stephen King'),
                   ('Edgar Allan Poe')
              ) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM autor LIMIT 1);


INSERT INTO estoque (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM estoque LIMIT 1);


INSERT INTO livro (title, cover, summary)
SELECT * FROM (VALUES
                   ('O Hobbit',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHmkcR1BUTUEMz3gtzlkRM2Lb73oWVcU7S0A&s',
                    'O livro narra a jornada de Bilbo Bolseiro, um hobbit pacato que é arrastado para uma aventura pelo mago Gandalf e treze anões. O objetivo é retomar o Reino de Erebor e seu tesouro das garras do dragão Smaug. É nesta história que Bilbo encontra o ''um anel'' e enfrenta criaturas como trolls, lobos e o icônico Gollum.'),
                   ('O Senhor dos Anéis: A Sociedade do Anel',
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHB8qZ_YJcBCgxXcnR6GhGMoA4IxKtlZnAoQ&s',
                    'Anos após os eventos de O Hobbit, o Um Anel passa para as mãos de Frodo Bolseiro. Ao descobrir que o artefato pertence ao Lorde das Trevas, Sauron, Frodo precisa deixar o Condado para destruí-lo na Montanha da Perdição. Ele é acompanhado pela Sociedade do Anel, formada por representantes das diferentes raças da Terra Média.'),
                   ('It: A Coisa',
                    'https://m.media-amazon.com/images/I/91g9Dvtf+jL._UF1000,1000_QL80_.jpg',
                    'Ambientado na cidade de Derry, o livro acompanha um grupo de sete amigos conhecidos como ''O Clube dos Otários''. Eles enfrentam uma entidade milenar e metamórfica que assume a forma dos medos mais profundos das crianças — frequentemente personificada como o palhaço Pennywise.'),
                   ('Histórias Extraordinárias',
                    'https://m.media-amazon.com/images/I/91J4ze7NJlL._AC_UF1000,1000_QL80_.jpg',
                    'Esta é uma coletânea que reúne os contos mais famosos de Poe, o mestre do mistério e do macabro. Inclui clássicos como O Gato Preto, O Coração Delator, A Queda da Casa de Usher e Os Assassinatos na Rua Morgue.')
              ) AS v(title, cover, summary)
WHERE NOT EXISTS (SELECT 1 FROM livro LIMIT 1);


INSERT INTO livro_author (livro_id, autor_id)
SELECT * FROM (VALUES
                   (1, 1),
                   (2, 1),
                   (3, 2),
                   (4, 3)
              ) AS v(livro_id, autor_id)
WHERE NOT EXISTS (SELECT 1 FROM livro_author LIMIT 1);


INSERT INTO livro_genero (livro_id, genders)
SELECT * FROM (VALUES
                   (1, 'FANTASIA'),
                   (2, 'FANTASIA'),
                   (2, 'ACAO'),
                   (3, 'TERROR')
              ) AS v(livro_id, genders)
WHERE NOT EXISTS (SELECT 1 FROM livro_genero LIMIT 1);


INSERT INTO estoque_livro (estoque_id, livro_id, qtd)
SELECT * FROM (VALUES
                   (1, 1, 10),
                   (1, 2, 8),
                   (1, 3, 5),
                   (1, 4, 6)
              ) AS v(estoque_id, livro_id, qtd)
WHERE NOT EXISTS (SELECT 1 FROM estoque_livro LIMIT 1);


INSERT INTO movimentacoes (usuario_id, estoque_livro_id, type_item, qtd_moviment, created_time, description)
SELECT * FROM (VALUES
                   (2, 1, 'ENTRADA_ADMIN', 10, TIMESTAMP '2026-01-10 10:00:00', 'Entrada inicial de estoque do livro O Hobbit'),
                   (2, 2, 'ENTRADA_ADMIN', 8,  TIMESTAMP '2026-01-10 10:00:00', 'Entrada inicial de estoque do livro O Senhor dos Anéis'),
                   (2, 3, 'ENTRADA_ADMIN', 5,  TIMESTAMP '2026-01-10 10:00:00', 'Entrada inicial de estoque do livro It: A Coisa'),
                   (2, 4, 'ENTRADA_ADMIN', 6,  TIMESTAMP '2026-01-10 10:00:00', 'Entrada inicial de estoque do livro Histórias Extraordinárias')
              ) AS v(usuario_id, estoque_livro_id, type_item, qtd_moviment, created_time, description)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes LIMIT 1);