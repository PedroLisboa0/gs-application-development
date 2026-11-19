const test = require("node:test");
const assert = require("node:assert/strict");
const { criarOcorrenciaValida } = require("../validation");

test("aceita ocorrência válida, remove espaços e define a data no servidor", () => {
  const resultado = criarOcorrenciaValida({
    categoria: "buraco",
    local: "  Centro  ",
    descricao: "  Buraco próximo à praça.  ",
    prioridade: "alta",
  });

  assert.equal(resultado.erro, undefined);
  assert.equal(resultado.ocorrencia.local, "Centro");
  assert.equal(resultado.ocorrencia.descricao, "Buraco próximo à praça.");
  assert.ok(resultado.ocorrencia.criadoEm instanceof Date);
});

test("rejeita categoria não permitida", () => {
  const resultado = criarOcorrenciaValida({
    categoria: "qualquer-coisa",
    local: "Centro",
    descricao: "Relato",
    prioridade: "baixa",
  });

  assert.equal(resultado.erro, "Selecione uma categoria válida.");
});

test("rejeita campos obrigatórios vazios e textos acima do limite", () => {
  const camposVazios = criarOcorrenciaValida({
    categoria: "buraco",
    local: "   ",
    descricao: "Relato",
    prioridade: "baixa",
  });
  const localLongo = criarOcorrenciaValida({
    categoria: "buraco",
    local: "a".repeat(121),
    descricao: "Relato",
    prioridade: "baixa",
  });
  const descricaoLonga = criarOcorrenciaValida({
    categoria: "buraco",
    local: "Centro",
    descricao: "a".repeat(501),
    prioridade: "baixa",
  });

  assert.equal(camposVazios.erro, "Informe o bairro ou local da ocorrência.");
  assert.equal(localLongo.erro, "O local deve ter no máximo 120 caracteres.");
  assert.equal(
    descricaoLonga.erro,
    "A descrição deve ter no máximo 500 caracteres.",
  );
});

test("rejeita corpo que não seja um objeto", () => {
  assert.equal(
    criarOcorrenciaValida(null).erro,
    "Envie os dados da ocorrência em um objeto.",
  );
});
