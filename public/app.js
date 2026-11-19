const rotulosCategoria = {
  buraco: "Buraco na via",
  iluminacao: "Iluminação pública",
  residuos: "Descarte de resíduos",
  acessibilidade: "Acessibilidade",
  outro: "Outro problema urbano",
};

const rotulosPrioridade = {
  baixa: "Prioridade baixa",
  media: "Prioridade média",
  alta: "Prioridade alta",
};

const formulario = document.querySelector("#form-ocorrencia");
const botaoEnviar = document.querySelector("#botao-enviar");
const mensagemFormulario = document.querySelector("#mensagem-formulario");
const mensagemLista = document.querySelector("#mensagem-lista");
const listaOcorrencias = document.querySelector("#lista-ocorrencias");
const totalOcorrencias = document.querySelector("#total-ocorrencias");
const resumoCategorias = document.querySelector("#resumo-categorias");
const quantidadeLista = document.querySelector("#quantidade-lista");
const avisoModo = document.querySelector("#aviso-modo");

function mostrarModoArmazenamento(modo) {
  if (modo === "mock") {
    avisoModo.textContent =
      "Modo de demonstração: os registros ficam apenas na memória e serão apagados quando o servidor reiniciar.";
    avisoModo.hidden = false;
  } else {
    avisoModo.hidden = true;
  }
}

function mostrarMensagem(elemento, texto, tipo = "") {
  elemento.textContent = texto;
  elemento.className = tipo ? `mensagem ${tipo}` : "mensagem";
}

function criarItemResumo(rotulo, quantidade) {
  const item = document.createElement("li");
  const nome = document.createElement("span");
  const valor = document.createElement("strong");

  nome.textContent = rotulo;
  valor.textContent = String(quantidade);
  item.append(nome, valor);
  return item;
}

function renderizarIndicadores(indicadores) {
  totalOcorrencias.textContent = String(indicadores.total);
  resumoCategorias.replaceChildren(
    criarItemResumo("Buracos", indicadores.porCategoria.buraco),
    criarItemResumo("Iluminação", indicadores.porCategoria.iluminacao),
    criarItemResumo("Resíduos", indicadores.porCategoria.residuos),
    criarItemResumo(
      "Acessibilidade",
      indicadores.porCategoria.acessibilidade,
    ),
    criarItemResumo("Outros", indicadores.porCategoria.outro),
  );
}

function criarCartaoOcorrencia(ocorrencia) {
  const cartao = document.createElement("article");
  cartao.className = "ocorrencia";

  const topo = document.createElement("div");
  topo.className = "ocorrencia-topo";

  const titulo = document.createElement("h3");
  titulo.className = "ocorrencia-titulo";
  titulo.textContent = rotulosCategoria[ocorrencia.categoria] || "Ocorrência";

  const prioridade = document.createElement("span");
  prioridade.className = `prioridade prioridade-${ocorrencia.prioridade}`;
  prioridade.textContent =
    rotulosPrioridade[ocorrencia.prioridade] || "Prioridade não informada";
  topo.append(titulo, prioridade);

  const descricao = document.createElement("p");
  descricao.className = "ocorrencia-descricao";
  descricao.textContent = ocorrencia.descricao;

  const detalhes = document.createElement("div");
  detalhes.className = "ocorrencia-detalhes";

  const local = document.createElement("span");
  local.textContent = ocorrencia.local;

  const data = document.createElement("time");
  const dataOcorrencia = new Date(ocorrencia.criadoEm);
  if (!Number.isNaN(dataOcorrencia.getTime())) {
    data.dateTime = dataOcorrencia.toISOString();
    data.textContent = dataOcorrencia.toLocaleString("pt-BR");
  } else {
    data.textContent = "Data indisponível";
  }

  detalhes.append(local, data);
  cartao.append(topo, descricao, detalhes);
  return cartao;
}

function renderizarRegistros(registros) {
  listaOcorrencias.replaceChildren(
    ...registros.map(criarCartaoOcorrencia),
  );
  quantidadeLista.textContent =
    registros.length === 1 ? "1 registro" : `${registros.length} registros`;
  mensagemLista.textContent =
    registros.length === 0
      ? "Ainda não há ocorrências. Seja a primeira pessoa a registrar uma."
      : "";
}

async function carregarOcorrencias() {
  const resposta = await fetch("/api/ocorrencias");
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Não foi possível carregar as ocorrências.");
  }

  mostrarModoArmazenamento(dados.modo);
  renderizarIndicadores(dados.indicadores);
  renderizarRegistros(dados.registros);
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mostrarMensagem(mensagemFormulario, "");
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = "Enviando…";

  const dadosFormulario = new FormData(formulario);
  const ocorrencia = Object.fromEntries(dadosFormulario.entries());

  try {
    const resposta = await fetch("/api/ocorrencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ocorrencia),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Não foi possível registrar a ocorrência.");
    }

    formulario.reset();
    mostrarMensagem(
      mensagemFormulario,
      dados.mensagem || "Ocorrência registrada com sucesso.",
      "sucesso",
    );
    await carregarOcorrencias();
  } catch (erro) {
    mostrarMensagem(
      mensagemFormulario,
      erro.message || "Falha de comunicação. Tente novamente.",
      "erro",
    );
  } finally {
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = "Registrar ocorrência";
  }
});

carregarOcorrencias().catch((erro) => {
  mensagemLista.textContent =
    erro.message || "Não foi possível carregar as ocorrências.";
  quantidadeLista.textContent = "Indisponível";
  resumoCategorias.replaceChildren(
    criarItemResumo("Indicadores", "indisponíveis"),
  );
});
