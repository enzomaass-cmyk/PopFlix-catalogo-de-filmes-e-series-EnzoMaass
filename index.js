console.log("=== Sistema de Metas Pessoais ===");
console.log("Bem-vindo ao sistema de metas pessoais!");

let metas = []

console.log("Metas Atuais:", metas);

function adicionarMeta() {
  let novaMeta = "Estudar JavaScript";
  metas.push(novaMeta);
  console.log("Meta Adicionada:", novaMeta);
  console.log("Metas Atualizadas:", metas.length);
}

adicionarMeta();
console.log("Metas Finais:", metas);