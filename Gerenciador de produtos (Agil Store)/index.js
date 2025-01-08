const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




//funcao para adicionar os produtos (conforme pedido)

const adicionarProduto = () => {
    rl.question('Digite o nome do produto: ', (nome) => {
        rl.question('Digite a categoria do produto: ', (categoria) => {
            rl.question('Digite a quantidade em estoque: ', (quantidade) => {
                rl.question('Digite o preço do produto: ', (preco) => {
                    const produtos = lerProdutos();
                    const novoProduto = {
                        id: produtos.length,
                        nome,
                        categoria,
                        quantidade: parseInt(quantidade),
                        preco: parseFloat(preco)
                    };
                    produtos.push(novoProduto);
                    salvarProdutos(produtos);
                    console.log('Produto adicionado com sucesso!');
                    perguntarProximoPassoAdicao(); // Pergunta o próximo passo após adicionar o produto
                });
            });
        });
    });
};

// função para perguntar o próximo passo após adicionar um produto (o que evita do 'funcionário' ser sempre redirecionado ao menu principal quando não há necessidade)
const perguntarProximoPassoAdicao = () => {
    console.log('\nEscolha uma opção:');
    console.log('1 - Adicionar mais um produto');
    console.log('2 - Voltar ao menu inicial');
    console.log('3 - Encerrar a aplicação');

    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case '1':
                adicionarProduto();
                break;
            case '2':
                mostrarOpcoes();
                break;
            case '3':
                console.log('Saindo...');
                rl.close();
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
                perguntarProximoPassoAdicao();
                break;
        }
    });
};



// função para exibir os produtos já cadastrados no json de produtos
const verProdutos = () => {
    const produtos = lerProdutos();

    if (produtos.length === 0) {
        console.log('Nenhum produto registrado.');
        mostrarOpcoes();
        return;
    }

    console.log('=== Lista de Produtos ===');
    produtos.forEach(produto => {
        console.log(`ID: ${produto.id} | Nome: ${produto.nome} | Categoria: ${produto.categoria} | Quantidade: ${produto.quantidade} | Preço: R$ ${produto.preco.toFixed(2)}`);
    });

    mostrarOpcoes();
};


// função  para ler os produtos do arquivo json
const lerProdutos = () => {
    const dados = fs.readFileSync('produtos.json', 'utf8');
    if (dados) {
        return JSON.parse(dados);
    }
    return [];
};


// Função para escrever os produtos no arquivo JSON
const salvarProdutos = (produtos) => {
    fs.writeFileSync('produtos.json', JSON.stringify(produtos, null, 2), 'utf8');
};




// função para atualizar produto já salvo
const atualizarProduto = () => {
    rl.question('Digite o ID do produto que deseja atualizar: ', (idInput) => {
        const id = parseInt(idInput);
        const produtos = lerProdutos();
        const produto = produtos.find(produto => produto.id === id);

        if (!produto) {
            console.log('Produto não encontrado.');
            mostrarOpcoes();
            return;
        }

        console.log('Produto encontrado. O que você deseja atualizar?');
        rl.question('Digite 1 para Nome, 2 para Categoria, 3 para Quantidade, 4 para Preço: ', (opcao) => {
            switch (opcao) {
                case '1':
                    rl.question('Digite o novo nome: ', (novoNome) => {
                        produto.nome = novoNome;
                        salvarProdutos(produtos);
                        console.log('Produto atualizado com sucesso!');
                        mostrarOpcoes();
                    });
                    break;
                case '2':
                    rl.question('Digite a nova categoria: ', (novaCategoria) => {
                        produto.categoria = novaCategoria;
                        salvarProdutos(produtos);
                        console.log('Produto atualizado com sucesso!');
                        mostrarOpcoes();
                    });
                    break;
                case '3':
                    rl.question('Digite a nova quantidade: ', (novaQuantidade) => {
                        produto.quantidade = parseInt(novaQuantidade);
                        salvarProdutos(produtos);
                        console.log('Produto atualizado com sucesso!');
                        mostrarOpcoes();
                    });
                    break;
                case '4':
                    rl.question('Digite o novo preço: ', (novoPreco) => {
                        produto.preco = parseFloat(novoPreco);
                        salvarProdutos(produtos);
                        console.log('Produto atualizado com sucesso!');
                        mostrarOpcoes();
                    });
                    break;
                default:
                    console.log('Opção inválida.');
                    atualizarProduto();
            }
        });
    });
};

// Função para excluir um produto
const excluirProduto = () => {
    rl.question('Deseja excluir por ID ou por nome? (id/nome): ', (tipoBusca) => {
        if (tipoBusca.toLowerCase() === 'id') {
            rl.question('Digite o ID do produto que deseja excluir: ', (idInput) => {
                const id = parseInt(idInput);
                const produtos = lerProdutos();
                const produtoIndex = produtos.findIndex(produto => produto.id === id);

                if (produtoIndex === -1) {
                    console.log('Produto não encontrado.');
                    mostrarOpcoes();
                    return;
                }

                rl.question('Tem certeza que deseja excluir este produto? (s/n): ', (confirmacao) => {
                    if (confirmacao.toLowerCase() === 's') {
                        produtos.splice(produtoIndex, 1);
                        salvarProdutos(produtos);
                        console.log('Produto excluído com sucesso!');
                    } else {
                        console.log('Ação cancelada.');
                    }
                    perguntarProximoPasso();
                });
            });
        } else if (tipoBusca.toLowerCase() === 'nome') {
            rl.question('Digite o nome ou parte do nome do produto que deseja excluir: ', (nomeInput) => {
                const produtos = lerProdutos();
                const produtosEncontrados = produtos.filter(produto => produto.nome.toLowerCase().includes(nomeInput.toLowerCase()));

                if (produtosEncontrados.length === 0) {
                    console.log('Nenhum produto encontrado com esse nome.');
                    mostrarOpcoes();
                    return;
                }

                console.log('Produtos encontrados:');
                produtosEncontrados.forEach(produto => {
                    console.log(`ID: ${produto.id} | Nome: ${produto.nome}`);
                });

                rl.question('Digite o ID do produto que deseja excluir: ', (idInput) => {
                    const id = parseInt(idInput);
                    const produtoIndex = produtos.findIndex(produto => produto.id === id);

                    if (produtoIndex === -1) {
                        console.log('Produto não encontrado.');
                    } else {
                        rl.question('Tem certeza que deseja excluir este produto? (s/n): ', (confirmacao) => {
                            if (confirmacao.toLowerCase() === 's') {
                                produtos.splice(produtoIndex, 1);
                                salvarProdutos(produtos);
                                console.log('Produto excluído com sucesso!');
                            } else {
                                console.log('Ação cancelada.');
                            }
                        });
                    }
                    perguntarProximoPasso();
                });
            });
        } else {
            console.log('Opção inválida. Tente novamente.');
            excluirProduto();
        }
    });
};

// função para perguntar o próximo passo após excluir 1 produto
const perguntarProximoPasso = () => {
    console.log('\nEscolha uma opção:');
    console.log('1 - Voltar ao menu inicial');
    console.log('2 - Encerrar a aplicação');

    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case '1':
                mostrarOpcoes();
                break;
            case '2':
                console.log('Saindo...');
                rl.close();
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
                perguntarProximoPasso();
                break;
        }
    });
};


// Função para buscar um produto
const buscarProduto = () => {
    rl.question('Deseja buscar por ID ou por nome? (id/nome): ', (tipoBusca) => {
        if (tipoBusca.toLowerCase() === 'id') {
            rl.question('Digite o ID do produto que deseja buscar: ', (idInput) => {
                const id = parseInt(idInput);
                const produtos = lerProdutos();
                const produto = produtos.find(produto => produto.id === id);

                if (produto) {
                    console.log('=== Produto Encontrado ===');
                    console.log(`ID: ${produto.id}`);
                    console.log(`Nome: ${produto.nome}`);
                    console.log(`Categoria: ${produto.categoria}`);
                    console.log(`Quantidade em Estoque: ${produto.quantidade}`);
                    console.log(`Preço: R$ ${produto.preco.toFixed(2)}`);
                } else {
                    console.log('Produto não encontrado com esse ID.');
                }
                mostrarOpcoes(); // Retorna ao menu de opções
            });
        } else if (tipoBusca.toLowerCase() === 'nome') {
            rl.question('Digite o nome ou parte do nome do produto: ', (nomeInput) => {
                const produtos = lerProdutos();
                const produtosEncontrados = produtos.filter(produto => produto.nome.toLowerCase().includes(nomeInput.toLowerCase()));

                if (produtosEncontrados.length > 0) {
                    console.log('=== Produtos Encontrados ===');
                    produtosEncontrados.forEach(produto => {
                        console.log(`ID: ${produto.id}`);
                        console.log(`Nome: ${produto.nome}`);
                        console.log(`Categoria: ${produto.categoria}`);
                        console.log(`Quantidade em Estoque: ${produto.quantidade}`);
                        console.log(`Preço: R$ ${produto.preco.toFixed(2)}`);
                        console.log('-----------------------------');
                    });
                } else {
                    console.log('Nenhum produto encontrado com esse nome.');
                }
                mostrarOpcoes(); // Retorna ao menu de opções
            });
        } else {
            console.log('Opção inválida. Tente novamente.');
            buscarProduto(); // Repete a busca caso a opção seja inválida
        }
    });
};

// Função para exibir o menu de opções
const mostrarOpcoes = () => {
    console.log('=== Sistema Agil Store ===');
    console.log('Digite uma das opções:');
    console.log('1 - Adicionar produto');
    console.log('2 - Ver produtos');
    console.log('3 - Atualizar produto');
    console.log('4 - Excluir produto');
    console.log('5 - Buscar produto');
    console.log('6 - Sair');

    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case '1':
                adicionarProduto(); // chama a função para adicionar um produto
                break;
            case '2':
                verProdutos(); // chama a função para ver os produtos
                break;
            case '3':
                atualizarProduto(); // chama a função para atualizar um produto
                break;
            case '4':
                excluirProduto(); // chama a função para excluir um produto
                break;
            case '5':
                buscarProduto(); // chama a função para buscar um produto
                break;
            case '6':
                console.log('Saindo...');
                rl.close(); // Encerra a aplicação
                return;
            default:
                console.log('Opção inválida. Tente novamente.');
                mostrarOpcoes(); // exibe o menu novamente em caso de erro
        }
    });
};




mostrarOpcoes(); // é chamada a função responsável por mostrar o menu principal com as opções