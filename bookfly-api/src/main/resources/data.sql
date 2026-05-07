
INSERT INTO usuario (name, email, password, role) VALUES
                                                      ('user', 'user@gmail.com', 'us', 'USER'),
                                                      ('admin', 'admin@gmail.com', 'ad', 'ADMIN');


INSERT INTO autor (name) VALUES
                             ('J. R. R. Tolkien'),
                             ('Stephen King'),
                             ('Edgar Allan Poe');


INSERT INTO estoque DEFAULT VALUES;


INSERT INTO livro (title, cover, summary) VALUES
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
                                               'Esta é uma coletânea que reúne os contos mais famosos de Poe, o mestre do mistério e do macabro. Inclui clássicos como O Gato Preto, O Coração Delator, A Queda da Casa de Usher e Os Assassinatos na Rua Morgue.');


INSERT INTO livro_author (livro_id, autor_id) VALUES
                                                  (1, 1), -- O Hobbit -> Tolkien
                                                  (2, 1), -- Sociedade do Anel -> Tolkien
                                                  (3, 2), -- It -> Stephen King
                                                  (4, 3); -- Histórias Extraordinárias -> Poe


INSERT INTO livro_genero (livro_id, genders) VALUES
                                                 (1, 'FANTASIA'),
                                                 (2, 'FANTASIA'),
                                                 (2, 'ACAO'),
                                                 (3, 'TERROR'),
                                                 (4, 'TERROR');


INSERT INTO estoque_livro (estoque_id, livro_id, qtd) VALUES
                                                          (1, 1, 10), -- O Hobbit: 10 unidades
                                                          (1, 2, 8),  -- Sociedade do Anel: 8 unidades
                                                          (1, 3, 5),  -- It: 5 unidades
                                                          (1, 4, 6);  -- Histórias Extraordinárias: 6 unidades


INSERT INTO movimentacoes (usuario_id, estoque_livro_id, type_item, qtd_moviment, created_date) VALUES
                                                                                                   (2, 1, 'ENTRADA_ADMIN', 10, '2026-01-10'),
                                                                                                   (2, 2, 'ENTRADA_ADMIN', 8,  '2026-01-10'),
                                                                                                   (2, 3, 'ENTRADA_ADMIN', 5,  '2026-01-10'),
                                                                                                   (2, 4, 'ENTRADA_ADMIN', 6,  '2026-01-10'),
                                                                    