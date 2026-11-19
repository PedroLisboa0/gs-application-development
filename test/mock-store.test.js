const test = require("node:test");
const assert = require("node:assert/strict");
const { criarMockStore } = require("../mock-store");

test("mock começa com exemplos e calcula quantidade por categoria", async () => {
  const store = criarMockStore();
  const registros = await store.find({}).sort({ criadoEm: -1 }).toArray();
  const contagens = await store.aggregate([]).toArray();

  assert.equal(await store.countDocuments(), 3);
  assert.equal(registros[0].categoria, "buraco");
  assert.deepEqual(
    contagens.map(({ _id, quantidade }) => [_id, quantidade]),
    [
      ["buraco", 1],
      ["iluminacao", 1],
      ["residuos", 1],
    ],
  );
});

test("cadastro no mock permanece disponível durante a execução", async () => {
  const store = criarMockStore([]);
  const criadoEm = new Date();
  const resultado = await store.insertOne({
    categoria: "acessibilidade",
    local: "Centro",
    descricao: "Rampa bloqueada.",
    prioridade: "alta",
    criadoEm,
  });
  const registros = await store.find({}).toArray();

  assert.equal(resultado.insertedId, "mock-1");
  assert.equal(await store.countDocuments(), 1);
  assert.equal(registros[0].categoria, "acessibilidade");
});
