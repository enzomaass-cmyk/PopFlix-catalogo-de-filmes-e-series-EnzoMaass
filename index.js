const fs = require("fs");
const readline = require("readline");

const FILE = "catalogo.json";

// Carregar catálogo do arquivo
function carregarCatalogo() {
    if (fs.existsSync(FILE)) {
        return JSON.parse(fs.readFileSync(FILE, "utf-8"));
    }
    return [];
}

// Salvar catálogo no arquivo
function salvarCatalogo() {
    fs.writeFileSync(FILE, JSON.stringify(catalogo, null, 2), "utf-8");
    console.log("💾 Catálogo salvo com sucesso!\n");
}

// Catálogo em memória
let catalogo = carregarCatalogo();

// Interface readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Funções do sistema
function cadastrarMidia() {
    rl.question("Título: ", (titulo) => {
        if (!titulo) return console.log("⚠️ Título não pode ser vazio."), menu();
        rl.question("Tipo (filme/série): ", (tipo) => {
            tipo = tipo.toLowerCase();
            if (!["filme","série"].includes(tipo)) return console.log("⚠️ Tipo inválido."), menu();
            rl.question("Gênero: ", (genero) => {
                rl.question("Ano: ", (ano) => {
                    if (isNaN(ano) || ano < 1900) return console.log("⚠️ Ano inválido."), menu();
                    rl.question("Plataforma: ", (plataforma) => {
                        let novo = {
                            id: Date.now(),
                            titulo,
                            tipo,
                            genero,
                            ano: parseInt(ano),
                            plataforma,
                            status: "quero_assistir",
                            duracaoMinutos: tipo === "filme" ? null : null, // para filmes
                            temporadas: tipo === "série" ? 0 : null,
                            episodiosTotal: tipo === "série" ? 0 : null,
                            episodiosAssistidos: tipo === "série" ? 0 : null,
                            nota: null,
                            dataInicio: null
                        };
                        if(tipo === "filme"){
                            rl.question("Duração (minutos): ", (duracao) => {
                                if(isNaN(duracao) || duracao <=0) return console.log("⚠️ Duração inválida."), menu();
                                novo.duracaoMinutos = parseInt(duracao);
                                catalogo.push(novo);
                                salvarCatalogo();
                                console.log("✅ Filme cadastrado com sucesso!");
                                menu();
                            });
                        } else {
                            rl.question("Total de temporadas: ", (temp) => {
                                if(isNaN(temp) || temp<0) return console.log("⚠️ Valor inválido."), menu();
                                novo.temporadas = parseInt(temp);
                                rl.question("Total de episódios: ", (ep) => {
                                    if(isNaN(ep) || ep<0) return console.log("⚠️ Valor inválido."), menu();
                                    novo.episodiosTotal = parseInt(ep);
                                    catalogo.push(novo);
                                    salvarCatalogo();
                                    console.log("✅ Série cadastrada com sucesso!");
                                    menu();
                                });
                            });
                        }
                    });
                });
            });
        });
    });
}

function listarItens() {
    console.log("\n=== 🎬 CATÁLOGO COMPLETO ===");
    if(catalogo.length===0) console.log("⚠️ Catálogo vazio!");
    catalogo.forEach(m => {
        console.log(`
ID: ${m.id}
Título: ${m.titulo}
Tipo: ${m.tipo}
Gênero: ${m.genero}
Ano: ${m.ano}
Plataforma: ${m.plataforma}
Status: ${m.status}
Nota: ${m.nota ?? "Ainda não avaliado"}
${m.tipo === "filme" ? `Duração: ${m.duracaoMinutos} min` : `Temporadas: ${m.temporadas} | Episódios: ${m.episodiosAssistidos}/${m.episodiosTotal}`}
-----------------------------------
        `);
    });
    menu();
}

function marcarAssistido() {
    rl.question("ID da mídia para marcar como assistido: ", (id) => {
        const item = catalogo.find(m => m.id==id);
        if(!item) return console.log("❌ Item não encontrado."), menu();
        item.status = "assistido";
        rl.question("Nota (1-10): ", (nota) => {
            if(isNaN(nota) || nota<1 || nota>10) return console.log("⚠️ Nota inválida."), menu();
            item.nota = parseInt(nota);
            salvarCatalogo();
            console.log("✅ Status e nota atualizados!");
            menu();
        });
    });
}

function atualizarEpisodios() {
    rl.question("ID da série: ", (id) => {
        const item = catalogo.find(m => m.id==id && m.tipo==="série");
        if(!item) return console.log("❌ Série não encontrada."), menu();
        rl.question(`Episódios assistidos (atualmente ${item.episodiosAssistidos}): `, (ep) => {
            if(isNaN(ep) || ep<0 || ep>item.episodiosTotal) return console.log("⚠️ Valor inválido."), menu();
            item.episodiosAssistidos = parseInt(ep);
            if(item.episodiosAssistidos === item.episodiosTotal) item.status = "assistido";
            salvarCatalogo();
            console.log("✅ Episódios atualizados!");
            menu();
        });
    });
}

function filtrarItens() {
    rl.question("Filtrar por (status/gênero/plataforma): ", (op) => {
        let filtrados;
        switch(op){
            case "status":
                rl.question("Digite o status: ", (val) => {
                    filtrados = catalogo.filter(m => m.status===val);
                    console.log(filtrados.length?filtrados:"⚠️ Nenhum encontrado."); menu();
                }); break;
            case "gênero":
                rl.question("Digite o gênero: ", (val) => {
                    filtrados = catalogo.filter(m => m.genero.toLowerCase()===val.toLowerCase());
                    console.log(filtrados.length?filtrados:"⚠️ Nenhum encontrado."); menu();
                }); break;
            case "plataforma":
                rl.question("Digite a plataforma: ", (val) => {
                    filtrados = catalogo.filter(m => m.plataforma.toLowerCase()===val.toLowerCase());
                    console.log(filtrados.length?filtrados:"⚠️ Nenhum encontrado."); menu();
                }); break;
            default: console.log("⚠️ Opção inválida."); menu();
        }
    });
}

function deletarItem() {
    rl.question("ID do item a deletar: ", (id) => {
        const index = catalogo.findIndex(m => m.id==id);
        if(index===-1) console.log("❌ Item não encontrado.");
        else {
            catalogo.splice(index,1);
            salvarCatalogo();
            console.log("🗑️ Item deletado!");
        }
        menu();
    });
}

function watchlist() {
    const lista = catalogo.filter(m => m.status==="quero_assistir");
    console.log("\n=== 📌 Watchlist ===");
    lista.forEach(m => console.log(`- ${m.titulo} (${m.tipo})`));
    if(lista.length===0) console.log("✅ Nenhum item na lista.");
    menu();
}

function tempoTotalAssistido() {
    let totalMin = 0;
    catalogo.forEach(m=>{
        if(m.status==="assistido"){
            if(m.tipo==="filme") totalMin+=m.duracaoMinutos;
            else if(m.tipo==="série") totalMin+= m.episodiosAssistidos*50; // assumindo 50 min por episódio
        }
    });
    console.log(`\n⏱️ Tempo total assistido: ${totalMin} minutos (~${(totalMin/60).toFixed(1)} horas)`);
    menu();
}

// Menu interativo
function menu() {
    console.log(`
=== 📺 MENU CATÁLOGO ===
1 - Cadastrar mídia
2 - Listar itens
3 - Marcar como assistido com nota
4 - Atualizar episódios assistidos
5 - Filtrar por status/gênero/plataforma
6 - Deletar item
7 - Watchlist (quero assistir)
8 - Tempo total assistido
9 - Sair
    `);

    rl.question("Escolha uma opção: ", (op) => {
        switch(op){
            case "1": cadastrarMidia(); break;
            case "2": listarItens(); break;
            case "3": marcarAssistido(); break;
            case "4": atualizarEpisodios(); break;
            case "5": filtrarItens(); break;
            case "6": deletarItem(); break;
            case "7": watchlist(); break;
            case "8": tempoTotalAssistido(); break;
            case "9": console.log("👋 Saindo..."); rl.close(); break;
            default: console.log("❌ Opção inválida."); menu();
        }
    });
}

menu();
