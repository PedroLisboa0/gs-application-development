function criarMockStore(registrosIniciais = [
  {
    categoria: "buraco",
    local: "Rua das Palmeiras, Centro",
    descricao: "Buraco próximo à faixa de pedestres.",
    prioridade: "alta",
    criadoEm: new Date("2026-11-08T14:30:00.000Z"),
  },
  {
    categoria: "iluminacao",
    local: "Praça do Sol, Vila Nova",
    descricao: "Poste apagado na entrada da praça.",
    prioridade: "media",
    criadoEm: new Date("2026-11-07T18:15:00.000Z"),
  },
  {
    categoria: "residuos",
    local: "Avenida Central, Jardim",
    descricao: "Descarte irregular de resíduos ao lado do ponto de ônibus.",
    prioridade: "baixa",
    criadoEm: new Date("2026-11-06T10:00:00.000Z"),
  },
]) {
  let proximoId = 1;
  const registros = registrosIniciais.map((registro) => ({
    ...registro,
    _id: registro._id || `mock-${proximoId++}`,
  }));

  return {
    find() {
      return {
        sort(sortSpec) {
          const [campo, direcao] = Object.entries(sortSpec)[0] || [];
          if (campo) {
            registros.sort(
              (a, b) => (a[campo] - b[campo]) * direcao,
            );
          }
          return this;
        },
        async toArray() {
          return registros.map((registro) => ({ ...registro }));
        },
      };
    },
    async countDocuments() {
      return registros.length;
    },
    aggregate() {
      return {
        async toArray() {
          const quantidades = new Map();
          for (const registro of registros) {
            quantidades.set(
              registro.categoria,
              (quantidades.get(registro.categoria) || 0) + 1,
            );
          }
          return [...quantidades].map(([categoria, quantidade]) => ({
            _id: categoria,
            quantidade,
          }));
        },
      };
    },
    async insertOne(registro) {
      const insertedId = `mock-${proximoId++}`;
      registros.push({ ...registro, _id: insertedId });
      return { insertedId };
    },
  };
}

module.exports = { criarMockStore };
