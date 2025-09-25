const { input, select, checkbox } = require('@inquirer/prompts');

let metas = []

function limparTela() {
    console.clear();
}

function mostrarMensagem(mensagem) {
    console.log(`\n${mensagem}\n`);
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
        case "sair":
            break;
        default:
            console.log("Opção inválida. Tente novamente. ❌");
    }
}

async function iniciar() {
    limparTela();
    mostrarMensagem("=== 📱Sistema de Metas Pessoais ===");

    while (true) {
        const opcao = await mostrarMenu();

        if (opcao === "sair") {
            await executarAcao(opcao);
            limparTela();
            mostrarMensagem("Até mais! 👋🏽");
            break;
        }

        await executarAcao(opcao);
    }
}

async function adicionarMeta() {
  const descricao = await input({
    message: "📝 Digite sua nova meta pessoal:"
  });

  if (descricao.length === 0) {
    mostrarMensagem("❌ Meta inválida. Tente novamente.");
    return;
  }

  const novaMeta = {
    value: descricao,
    checked: false
  }

  metas.push(novaMeta);

  mostrarMensagem("✅ Meta adicionada com sucesso!");
}

async function mostrarMetas() {
    if (metas.length === 0) {
        mostrarMensagem(" ⛔ Não existem metas cadastradas!");
        return;
    }

    console.log("📚 Suas Metas Pessoais:");
    metas.forEach((meta, index) => {
      const status = meta.checked ? "[x]" : "[ ]";  
      console.log(`${status} ${index + 1}. ${meta.value}`);
    });
}


async function marcarMetas() {
    if (metas.length === 0) {
        mostrarMensagem(" ⛔ Não existem metas cadastradas!");
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

    mostrarMensagem("✅ Metas atualizadas com sucesso!");
}

async function metasRealizadas() {
    const realizadas = metas.filter(meta => meta.checked);

    if (realizadas.length === 0) {
        mostrarMensagem("❌ Não existem metas realizadas!");
        return;
    }

    console.log("✅ Metas Realizadas:");
    realizadas.forEach((meta, index) => {
        console.log(`${index + 1}. ${meta.value}`);
    });

    mostrarMensagem(`Parabéns Você já concluiu ${realizadas.length} metas! 🎉`);

    
}

async function metasAbertas() {
    const abertas = metas.filter(meta => !meta.checked);

    if (abertas.length === 0) {
        mostrarMensagem("❌ Não existem metas abertas!");
        return;
    }

    console.log("📋 Metas Abertas:");
    abertas.forEach((meta, index) => {
        console.log(`${index + 1}. ${meta.value}`);
    });

    mostrarMensagem(`Você ainda tem ${abertas.length} metas para concluir. Vamos lá! 🚀`);
}

iniciar();