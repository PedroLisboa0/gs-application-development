require("dotenv").config();

const express = require("express");
const path = require("node:path");
const { MongoClient } = require("mongodb");
const {
  categoriasPermitidas,
  criarOcorrenciaValida,
} = require("./validation");
const { criarMockStore } = require("./mock-store");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/ocorrencias", async (req, res) => {
  const collection = req.app.locals.ocorrencias;

  const [registros, total, contagens] = await Promise.all([
    collection.find({}).sort({ criadoEm: -1 }).toArray(),
    collection.countDocuments(),
    collection
      .aggregate([
        { $group: { _id: "$categoria", quantidade: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const quantidadesPorCategoria = Object.fromEntries(
    categoriasPermitidas.map((categoria) => [categoria, 0]),
  );

  for (const contagem of contagens) {
    if (Object.hasOwn(quantidadesPorCategoria, contagem._id)) {
      quantidadesPorCategoria[contagem._id] = contagem.quantidade;
    }
  }

  res.json({
    modo: req.app.locals.storageMode,
    registros,
    indicadores: {
      total,
      porCategoria: quantidadesPorCategoria,
    },
  });
});

app.post("/api/ocorrencias", async (req, res) => {
  const resultado = criarOcorrenciaValida(req.body);

  if (resultado.erro) {
    return res.status(400).json({ erro: resultado.erro });
  }

  const collection = req.app.locals.ocorrencias;
  const insercao = await collection.insertOne(resultado.ocorrencia);

  res.status(201).json({
    mensagem: "Ocorrência registrada com sucesso.",
    modo: req.app.locals.storageMode,
    ocorrencia: {
      ...resultado.ocorrencia,
      _id: insercao.insertedId,
    },
  });
});

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ erro: "Rota não encontrada." });
  }

  res.status(404).send("Página não encontrada.");
});

app.use((erro, req, res, next) => {
  const status =
    Number.isInteger(erro.status) && erro.status >= 400 && erro.status < 500
      ? erro.status
      : 500;

  if (status >= 500) {
    console.error("Erro ao processar a requisição:", erro);
  }

  if (req.path.startsWith("/api/")) {
    return res.status(status).json({
      erro:
        status === 400
          ? "Não foi possível interpretar os dados enviados."
          : "Não foi possível concluir a solicitação.",
    });
  }

  res.status(status).send("Não foi possível concluir a solicitação.");
});

async function iniciarServidor() {
  const modo = (process.env.STORAGE_MODE || "mongodb").toLowerCase();

  if (modo === "mock") {
    app.locals.ocorrencias = criarMockStore();
    app.locals.storageMode = "mock";
    app.listen(port, () => {
      console.log(
        `Cidade em Foco disponível em http://localhost:${port} (modo mock; dados temporários)`,
      );
    });
    return;
  }

  if (modo !== "mongodb") {
    throw new Error('STORAGE_MODE deve ser "mock" ou "mongodb".');
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'Defina STORAGE_MODE=mock para demonstração ou configure MONGODB_URI para usar MongoDB.',
    );
  }

  const cliente = new MongoClient(uri);

  try {
    await cliente.connect();
    const banco = cliente.db(process.env.MONGODB_DB || "cidade_em_foco");
    app.locals.ocorrencias = banco.collection("ocorrencias");
    app.locals.storageMode = "mongodb";

    app.listen(port, () => {
      console.log(`Cidade em Foco disponível em http://localhost:${port}`);
    });
  } catch (erro) {
    await cliente.close();
    throw erro;
  }
}

if (require.main === module) {
  iniciarServidor().catch((erro) => {
    console.error("Não foi possível iniciar o servidor:", erro.message);
    process.exitCode = 1;
  });
}

module.exports = { app, iniciarServidor };
