// catalogoMenu.js
const fs = require("fs");
const readline = require("readline");

const FILE = "catalogo.json";

// 🔹 Carregar catálogo do arquivo JSON
function carregarCatalogo() {
    if (fs.existsSync(FILE)) {
        return JSON.parse(fs.readFileSync(FILE, "utf-8"));
    }
    return [];
}

// 🔹 Salvar catálogo no arquivo JSON
function salvarCatalogo() {
    fs.writeFileSync(FILE, JSON.stringify(catalogo, null, 2), "utf-8");
    console.log("💾 Catálogo salvo com sucesso!\n");
}

// Catálogo em memória
let catalogo = carregarCatalogo();

// 🔹 Funções do sistema
function cadastrarItem() {
    rl.question("Título: ", (titulo) => {
        if (!titulo) {
            console.log("⚠️ Título não pode ser vazio!");
            return menu();
        }

        rl.question("Tipo (filme/série): ", (tipo) => {
            if (!["filme", "série"].includes(tipo.toLowerCase())) {
                console.log("⚠️ Tipo inválido!");
                return menu();
            }

            rl.question("Gênero: ", (genero) => {
                rl.question("Ano: ", (ano) => {
                    if (isNaN(ano) || ano < 1900) {
                        console.log("⚠️ Ano inválido!");
                        return menu();
                    }

                    const novo = {
                        id: Date.now(),
                        titulo,
                        tipo,
                        genero,
                        ano: parseInt(ano),
                        plataforma: null,
                        status: "quero_assistir",
                        temporadas: tipo === "série" ? 0 : null,
                        episodiosTotal: tipo === "série" ? 0 : null,
                        episodiosAssistidos: tipo === "série" ? 0 : null,
                        nota: null,
                        dataInicio: null
                    };

                    catalogo.push(novo);
                    salvarCatalogo();
                    console.log("✅ Item cadastrado com sucesso!");
                    menu();
                });
            });
        });
    });
}

function listarItens() {
    console.log("\n=== 🎬 CATÁLOGO ===");
    catalogo.forEach(m => {
        console.log(`
ID: ${m.id}
Título: ${m.titulo}
Tipo: ${m.tipo}
Gênero: ${m.genero}
Ano: ${m.ano}
Status: ${m.status}
Nota: ${m.nota ?? "Ainda não avaliado"}
-----------------------------------
        `);
    });
    if (catalogo.length === 0) console.log("⚠️ Catálogo vazio!");
    menu();
}

function atualizarStatus() {
    rl.question("Digite o ID do item: ", (id) => {
        const item = catalogo.find(m => m.id == id);
        if (!item) {
            console.log("❌ Item não encontrado.");
            return menu();
        }
        rl.question("Novo status (quero_assistir/assistindo/assistido): ", (status) => {
            if (!["quero_assistir", "assistindo", "assistido"].includes(status)) {
                console.log("⚠️ Status inválido!");
                return menu();
            }
            item.status = status;
            salvarCatalogo();
            console.log("✅ Status atualizado!");
            menu();
        });
    });
}

function filtrarItens() {
    rl.question("Filtrar por (status/categoria): ", (op) => {
        if (op === "status") {
            rl.question("Digite o status: ", (status) => {
                const filtrados = catalogo.filter(m => m.status === status);
                console.log(filtrados.length ? filtrados : "⚠️ Nenhum encontrado.");
                menu();
            });
        } else if (op === "categoria") {
            rl.question("Digite o tipo (filme/série): ", (tipo) => {
                const filtrados = catalogo.filter(m => m.tipo === tipo);
                console.log(filtrados.length ? filtrados : "⚠️ Nenhum encontrado.");
                menu();
            });
        } else {
            console.log("⚠️ Opção inválida.");
            menu();
        }
    });
}

function deletarItem() {
    rl.question("Digite o ID do item a deletar: ", (id) => {
        const index = catalogo.findIndex(m => m.id == id);
        if (index === -1) {
            console.log("❌ Item não encontrado.");
        } else {
            catalogo.splice(index, 1);
            salvarCatalogo();
            console.log("🗑️ Item deletado com sucesso!");
        }
        menu();
    });
}

function sair() {
    console.log("\n👋 Saindo do sistema...");
    rl.close();
}

// 🔹 Menu interativo
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    console.log(`
=== 📺 MENU CATÁLOGO ===
1 - Cadastrar item
2 - Listar itens
3 - Atualizar status
4 - Filtrar por status/categoria
5 - Deletar item
6 - Salvar catálogo manualmente
7 - Sair
    `);

    rl.question("Escolha uma opção: ", (opcao) => {
        switch(opcao) {
            case "1": cadastrarItem(); break;
            case "2": listarItens(); break;
            case "3": atualizarStatus(); break;
            case "4": filtrarItens(); break;
            case "5": deletarItem(); break;
            case "6": salvarCatalogo(); menu(); break;
            case "7": sair(); break;
            default:
                console.log("❌ Opção inválida.");
                menu();
        }
    });
}

menu();
