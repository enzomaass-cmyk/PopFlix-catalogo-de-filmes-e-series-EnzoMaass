const { input, select } = require('@inquirer/prompts');

console.log("=== 📱Sistema de Metas Pessoais ===");
console.log("Bem-vindo ao sistema de metas pessoais!");

let metas = []

async function mostrarMenu() {
    const opcao = await select({
        message: "O que você gostaria de fazer?",
        choices: [
            { name: "Adicionar nova meta", value: "adicionar" },
            { name: "Mostrar todas as metas", value: "mostrar" },
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
        case "sair":
            console.log("Saindo do sistema. Até mais! 👋🏽");
            break;
        default:
            console.log("Opção inválida. Tente novamente. ❌");
    }
}

async function iniciar() {
    while (true) {
        const opcao = await mostrarMenu();

        if (opcao === "sair") {
            await executarAcao(opcao);
            break;
        }

        await executarAcao(opcao);
    }
}

async function adicionarMeta() {
  let novaMeta = await input({
    message: "Digite sua nova meta pessoal:"
  });

  if (novaMeta.length === 0) {
    console.log("❌ Meta inválida. Tente novamente.");
    return;
  }

  metas.push(novaMeta);

  console.log("✅ Meta adicionada com sucesso!");
}

async function mostrarMetas() {
    console.log("Suas Metas Pessoais:");
    metas.forEach((meta, index) => {
      console.log(`${index + 1}. ${meta}`);
    });
}

iniciar();
/*async function main() {
  await adicionarMeta();
  await mostrarMetas();
}

main();
*/
