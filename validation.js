const categoriasPermitidas = [
  "buraco",
  "iluminacao",
  "residuos",
  "acessibilidade",
  "outro",
];

const prioridadesPermitidas = ["baixa", "media", "alta"];

function criarOcorrenciaValida(dados) {
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return { erro: "Envie os dados da ocorrência em um objeto." };
  }

  const { categoria, local, descricao, prioridade } = dados;

  if (
    typeof categoria !== "string" ||
    !categoriasPermitidas.includes(categoria)
  ) {
    return { erro: "Selecione uma categoria válida." };
  }

  if (typeof local !== "string" || !local.trim()) {
    return { erro: "Informe o bairro ou local da ocorrência." };
  }

  if (local.trim().length > 120) {
    return { erro: "O local deve ter no máximo 120 caracteres." };
  }

  if (typeof descricao !== "string" || !descricao.trim()) {
    return { erro: "Descreva o problema encontrado." };
  }

  if (descricao.trim().length > 500) {
    return { erro: "A descrição deve ter no máximo 500 caracteres." };
  }

  if (
    typeof prioridade !== "string" ||
    !prioridadesPermitidas.includes(prioridade)
  ) {
    return { erro: "Selecione uma prioridade válida." };
  }

  return {
    ocorrencia: {
      categoria,
      local: local.trim(),
      descricao: descricao.trim(),
      prioridade,
      criadoEm: new Date(),
    },
  };
}

module.exports = {
  categoriasPermitidas,
  criarOcorrenciaValida,
};
