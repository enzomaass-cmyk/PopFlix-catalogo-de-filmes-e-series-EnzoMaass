const { input, select, checkbox } = require('@inquirer/prompts');
const fs = require('fs').promises;


async function salvarMetas() {
    try {
        await fs.writeFile('metas.json', JSON.stringify(metas, null, 2));
        mostrarMensagem("✔️  Metas salvas com sucesso!");
    } catch (error) {
        mostrarMensagem("❌ Erro ao salvar metas: ",  error.mensagem);
    }
}

async function carregarMetas() {
    try {
        const dados = await fs.readFile('metas.json', 'utf-8');
        metas = JSON.parse(dados);
        mostrarMensagem("✔️  Metas carregadas com sucesso!");
    } catch (error) {
        metas = [];
        mostrarMensagem("⚠️  Nenhum arquivo de metas encontrado. Começando com uma lista vazia.");
    }
}

let metas = [];

function limparTela() {
    console.clear();
}

function definirMensagem(mensagem) {
    mensagemAtual = novaMensagem;
}

function mostrarMensagemAtual() {
    if (mensagemAtual) {
        console.log(`\n${mensagemAtual}\n`);
        mensagemAtual = "";
    }
}

async function mostrarMenu() {
    const opcao = await select({
        message: "O que você gostaria de fazer?",
        choices: [
            { name: "Adicionar nova meta", value: "adicionar" },
            { name: "Mostrar todas as metas", value: "mostrar" },
            { name: "Marcar metas como realizadas", value: "marcar" },
            { name: "Mostrar metas realizadas", value: "realizadas" },
            { name: "Mostrar metas abertas", value: "abertas" },
            { name: "Deletar metas", value: "deletar" },
            { name: "Sair", value: "sair" }
        ]
    });

    return opcao;
}

async function executarAcao(opcao) {
    switch (opcao) {
        case "adicionar": 
            await adicionarMeta();
            break;
        case "mostrar":
            await mostrarMetas();
            break;
        case "marcar":
            await marcarMetas();
            break;
        case "realizadas":
            await metasRealizadas();
            break; 
        case "abertas":
            await metasAbertas();
            break;
        case "deletar":
            await deletarMetas();
            break;           
        case "sair":
            break;
        default:
            definirMensagem("Opção inválida. Tente novamente. ❌");
    }
}

async function iniciar() {
    limparTela();
    await carregarMetas();
    definirMensagem("=== 📱Sistema de Metas Pessoais ===");

    while (true) {
        limparTela();
        mostrarMensagemAtual();
        const opcao = await mostrarMenu();

        if (opcao === "sair") {
            await executarAcao(opcao);
            console.log("Até mais! 👋🏽");
            break;
        }

        await executarAcao(opcao);
        await salvarMetas();
    }
}

async function adicionarMeta() {
  const descricao = await input({
    message: "📝 Digite sua nova meta pessoal:"
  });

  if (descricao.length === 0) {
    definirMensagem("❌ Meta inválida. Tente novamente.");
    return;
  }

  const novaMeta = {
    value: descricao,
    checked: false
  }

  metas.push(novaMeta);

  definirMensagem("✅ Meta adicionada com sucesso!");
}

async function mostrarMetas() {
    if (metas.length === 0) {
        definirMensagem(" ⛔ Não existem metas cadastradas!");
        return;
    }

    definirMensagem("📚 Suas Metas Pessoais:");
    metas.forEach((meta, index) => {
      const status = meta.checked ? "[x]" : "[ ]";  
      definirMensagem(`${status} ${index + 1}. ${meta.value}`);
    });
}


async function marcarMetas() {
    if (metas.length === 0) {
        definirMensagem(" ⛔ Não existem metas cadastradas!");
        return;
    }

    const metasSelecionadas = await checkbox({
        message: "📝 Selecione as metas que você já concluiu:",
        choices: metas.map(meta => 
            ({ name: meta.value, 
               value: meta.value, 
               checked: meta.checked 
            })),
    })

    metas.forEach(meta => meta.checked = false);

    metasSelecionadas.forEach(metaSelecionada => {
        const meta = metas.find(m => m.value === metaSelecionada);
        if (meta) {
            meta.checked = true;
        }
    });

    definirMensagem("✅ Metas atualizadas com sucesso!");
}

async function metasRealizadas() {
    const realizadas = metas.filter(meta => meta.checked);

    if (realizadas.length === 0) {
        definirMensagem("❌ Não existem metas realizadas!");
        return;
    }

    definirMensagem("✅ Metas Realizadas:");
    realizadas.forEach((meta, index) => {
        definirMensagem(`${index + 1}. ${meta.value}`);
    });

    definirMensagem(`Parabéns Você já concluiu ${realizadas.length} metas! 🎉`);

    
}

async function metasAbertas() {
    const abertas = metas.filter(meta => !meta.checked);

    if (abertas.length === 0) {
        definirMensagem("❌ Não existem metas abertas!");
        return;
    }

    console.log("📋 Metas Abertas:");
    abertas.forEach((meta, index) => {
        console.log(`${index + 1}. ${meta.value}`);
    });

    definirMensagem(`Você ainda tem ${abertas.length} metas para concluir. Vamos lá! 🚀`);
}

async function deletarMetas() {
    
    if (metas.length === 0) {
        definirMensagem("❌ Não existem metas cadastradas!");
        return;
    }

    const metasParaDeletar = await checkbox({
        message: "📝 Selecione as metas que deseja deletar:",
        choices: metas.map(meta => 
            ({ name: meta.value, 
               value: meta.value, 
               checked: false
            })),
    });

    if(metasParaDeletar.length === 0) {
        definirMensagem("‼️ Nenhuma meta foi selecionada para deletar")
        return;
    }

    metasParaDeletar.forEach(metaParaDeletar => {
        metas = metas.filter(meta => meta.value !== metaParaDeletar);
    })

    definirMensagem("✅ Metas deletadas com sucesso!");

}

iniciar();