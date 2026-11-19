const test = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("../server");
const { criarMockStore } = require("../mock-store");

let servidor;
let endereco;

test.before(async () => {
  app.locals.ocorrencias = criarMockStore([]);
  app.locals.storageMode = "mock";
  servidor = await new Promise((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  endereco = `http://127.0.0.1:${servidor.address().port}`;
});

test.beforeEach(() => {
  app.locals.ocorrencias = criarMockStore([]);
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    servidor.close((erro) => (erro ? reject(erro) : resolve()));
  });
});

test("GET retorna lista vazia e indicadores zerados", async () => {
  const resposta = await fetch(`${endereco}/api/ocorrencias`);
  const dados = await resposta.json();

  assert.equal(resposta.status, 200);
  assert.deepEqual(dados.registros, []);
  assert.equal(dados.modo, "mock");
  assert.equal(dados.indicadores.total, 0);
  assert.equal(dados.indicadores.porCategoria.buraco, 0);
});

test("servidor entrega a página e os arquivos estáticos", async () => {
  const pagina = await fetch(`${endereco}/`);
  const script = await fetch(`${endereco}/app.js`);

  assert.equal(pagina.status, 200);
  assert.match(pagina.headers.get("content-type"), /text\/html/);
  assert.equal(script.status, 200);
  assert.match(await script.text(), /form-ocorrencia/);
});

test("POST salva ocorrência e GET atualiza lista e indicadores", async () => {
  const respostaCadastro = await fetch(`${endereco}/api/ocorrencias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categoria: "buraco",
      local: "Centro",
      descricao: "Buraco na rua principal",
      prioridade: "alta",
    }),
  });
  const cadastro = await respostaCadastro.json();

  assert.equal(respostaCadastro.status, 201);
  assert.equal(cadastro.ocorrencia.local, "Centro");
  assert.ok(cadastro.ocorrencia._id);

  const respostaConsulta = await fetch(`${endereco}/api/ocorrencias`);
  const consulta = await respostaConsulta.json();
  assert.equal(consulta.registros.length, 1);
  assert.equal(consulta.modo, "mock");
  assert.equal(consulta.indicadores.total, 1);
  assert.equal(consulta.indicadores.porCategoria.buraco, 1);
});

test("POST rejeita dados inválidos sem persistir", async () => {
  const resposta = await fetch(`${endereco}/api/ocorrencias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categoria: "invalida",
      local: "Centro",
      descricao: "Relato",
      prioridade: "baixa",
    }),
  });

  assert.equal(resposta.status, 400);
  const consulta = await fetch(`${endereco}/api/ocorrencias`);
  assert.equal((await consulta.json()).indicadores.total, 0);
});

test("rota inexistente retorna 404", async () => {
  const resposta = await fetch(`${endereco}/api/nao-existe`);
  const paginaInexistente = await fetch(`${endereco}/pagina-inexistente`);

  assert.equal(resposta.status, 404);
  assert.deepEqual(await resposta.json(), { erro: "Rota não encontrada." });
  assert.equal(paginaInexistente.status, 404);
});
