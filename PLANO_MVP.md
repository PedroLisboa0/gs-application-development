# Plano passo a passo — MVP CitizenTech

## 1. Objetivo do MVP

Construir uma aplicação web simples para registrar problemas urbanos e consultar os relatos cadastrados. O exemplo deste plano usa ocorrências de **buracos, iluminação inadequada, descarte irregular de resíduos e falta de acessibilidade**.

- **Público beneficiado:** moradores e comunidades que precisam organizar informações sobre problemas locais.
- **Objetivo:** facilitar o registro e a visualização de ocorrências urbanas.
- **ODS relacionado:** ODS 11 — Cidades e Comunidades Sustentáveis.
- **Stack exigida:** HTML, CSS, JavaScript, Node.js, Express e MongoDB.

O foco é completar o fluxo essencial: **preencher formulário → validar → salvar no MongoDB → consultar → mostrar lista e indicadores**. O pitch não faz parte deste plano.

## 2. Escopo e limites

### Incluído

- Uma página web com formulário e listagem.
- Servidor Express com rotas GET e POST.
- Validação básica no servidor.
- Persistência em uma coleção MongoDB.
- Mensagem de sucesso ou erro para o usuário.
- Tratamento de rota inexistente (404).
- Dois indicadores:
  1. Total de ocorrências cadastradas.
  2. Quantidade de ocorrências por categoria.
- README com instruções de execução e explicação dos indicadores.

### Fora do MVP

- Login ou cadastro de usuários.
- Upload de imagens, mapas ou geolocalização.
- Integrações com APIs externas, inteligência artificial ou notificações.
- Edição e exclusão de ocorrências.
- Hospedagem e publicação online.

Se o tempo apertar, priorizem salvar, consultar, listar e calcular os dois indicadores antes de adicionar qualquer melhoria visual.

## 3. Modelo de dados

Cada documento da coleção `ocorrencias` deve conter:

| Campo | Tipo | Regra sugerida |
|---|---|---|
| `categoria` | texto | Obrigatório; `buraco`, `iluminacao`, `residuos`, `acessibilidade` ou `outro` |
| `local` | texto | Obrigatório; bairro, rua ou referência curta |
| `descricao` | texto | Obrigatório; descrição do problema |
| `prioridade` | texto | Obrigatório; `baixa`, `media` ou `alta` |
| `criadoEm` | data | Gerado pelo servidor no cadastro |

O MongoDB também cria um identificador `_id` para cada documento. Use valores internos consistentes, como `iluminacao`, e rótulos legíveis na página, como “Iluminação”.

## 4. Estrutura sugerida

```text
projeto/
├── server.js
├── validation.js
├── mock-store.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── README.md
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── test/
    ├── api.test.js
    └── validation.test.js
```

Mantenham o `.env` local e fora do arquivo ZIP se ele contiver credenciais. O `.env.example` deve indicar o nome da variável necessária, sem incluir usuário ou senha reais.

## 5. Etapas de implementação

### Etapa 1 — Fechar o problema e as regras (10–15 min)

1. Confirmem que o protótipo tratará de problemas urbanos.
2. Definam as opções de categoria e prioridade usando as listas do modelo de dados.
3. Confirmem que `local` representa bairro, rua ou referência e que `descricao` explica o problema.
4. Anotem o público, o objetivo e o ODS 11 para reutilizar na introdução da página e no README.
5. Não aumentem o escopo com recursos que não são necessários para demonstrar o fluxo principal.

**Concluído quando:** todos sabem quais campos existem, quais valores são aceitos e quais indicadores serão apresentados.

### Etapa 2 — Criar e preparar o projeto (15–20 min)

1. Criem a pasta do projeto e inicializem o `package.json`.
2. Instalem Express, o driver oficial do MongoDB e o pacote `dotenv` para carregar variáveis locais.
3. Criem os arquivos da estrutura sugerida.
4. Adicionem `node_modules/` e `.env` ao `.gitignore`.
5. Criem `.env.example` com o nome da variável de conexão, por exemplo `MONGODB_URI=`.
6. Adicionem scripts no `package.json` para iniciar o servidor e, se desejarem, reiniciá-lo durante o desenvolvimento.

**Concluído quando:** as dependências estão instaladas, os arquivos-base existem e segredos locais não serão incluídos na entrega.

### Etapa 3 — Conectar Express ao MongoDB (20–30 min)

1. Em `server.js`, carreguem as variáveis de ambiente.
2. Configurem o Express para servir os arquivos estáticos da pasta `public/`.
3. Configurem o middleware necessário para interpretar JSON enviado pelo navegador.
4. Criem a conexão com o MongoDB usando `MONGODB_URI`.
5. Selecionem um banco e uma coleção com nomes claros, por exemplo, banco `cidade_em_foco` e coleção `ocorrencias`.
6. Inicializem o servidor após a conexão ser estabelecida, para evitar que a aplicação pareça pronta sem acesso ao banco.
7. Se a conexão falhar, exibam o erro no terminal e interrompam a inicialização com falha explícita.

**Concluído quando:** o servidor inicia apenas quando consegue conectar ao MongoDB e serve a página principal.

### Etapa 4 — Montar o HTML e o CSS (25–35 min)

1. Criem no `index.html` um cabeçalho com o nome do projeto.
2. Adicionem uma introdução curta que explique o problema, o público e o objetivo.
3. Criem o formulário com:
   - seletor de categoria;
   - campo de local;
   - campo de descrição;
   - seletor de prioridade;
   - botão para registrar.
4. Marquem visualmente os campos obrigatórios e usem rótulos (`label`) associados aos controles.
5. Reservem espaços na página para:
   - mensagens de sucesso ou erro;
   - total de ocorrências;
   - resumo por categoria;
   - lista dos registros.
6. No CSS, priorizem legibilidade, contraste, espaçamento e adaptação para telas estreitas.
7. Mantenham a página funcional sem depender de bibliotecas ou serviços externos.

**Concluído quando:** é possível entender e preencher o formulário e identificar onde resultados e mensagens aparecerão.

### Etapa 5 — Implementar cadastro e validação no servidor (30–40 min)

Criem a rota `POST /api/ocorrencias`.

1. Leiam os campos recebidos no corpo da requisição.
2. Validem no servidor os quatro campos obrigatórios. A validação do navegador ajuda a UX, mas não substitui esta etapa.
3. Rejeitem categorias e prioridades fora das opções permitidas.
4. Removam espaços no início e no fim dos textos e rejeitem valores que fiquem vazios.
5. Definam `criadoEm` no servidor, em vez de confiar numa data enviada pelo navegador.
6. Salvem o documento na coleção `ocorrencias`.
7. Retornem uma resposta JSON com o registro salvo ou uma mensagem de validação clara.
8. Usem códigos HTTP apropriados: sucesso para cadastro concluído e erro de cliente para campos inválidos. Erros inesperados de banco devem ser registrados no servidor e responder com uma mensagem genérica, sem expor detalhes internos.

No `app.js`, enviem os dados do formulário à rota usando `fetch`. Mostrem a mensagem retornada e limpem o formulário somente depois de um cadastro bem-sucedido.

**Concluído quando:** um registro válido é persistido, dados inválidos são rejeitados e a página apresenta o resultado do envio.

### Etapa 6 — Implementar consulta, lista e indicadores (30–40 min)

Criem a rota `GET /api/ocorrencias`.

1. Consultem os documentos da coleção.
2. Calculem o total de registros.
3. Agrupem ou contem os registros por categoria. Categorias sem registros podem aparecer com valor zero, se isso deixar o resumo mais claro.
4. Retornem os registros e os indicadores em uma resposta JSON com formato consistente.
5. No `app.js`, chamem a rota ao carregar a página.
6. Atualizem o total e o resumo por categoria usando os dados recebidos.
7. Renderizem cada ocorrência com categoria, local, descrição, prioridade e data.
8. Mostrem uma mensagem apropriada quando ainda não houver registros.
9. Após um cadastro bem-sucedido, atualizem a lista e os indicadores chamando novamente a consulta.

Ao inserir conteúdo de usuário na página, criem elementos DOM e preencham texto como texto, evitando interpretar descrições como HTML.

**Concluído quando:** o cadastro aparece na listagem e os dois indicadores correspondem aos registros realmente gravados.

### Etapa 7 — Tratar 404 e falhas (10–15 min)

1. Adicionem um tratamento final para URLs que não correspondam a nenhuma rota e retornem status HTTP 404.
2. Diferenciem uma lista vazia de um erro de consulta: lista vazia é um resultado válido; falha de banco deve ser comunicada como erro.
3. No navegador, tratem falhas de rede e respostas de erro sem deixar a tela em estado confuso.
4. Evitem mensagens de sucesso quando o salvamento ou a consulta falharam.

**Concluído quando:** uma rota inexistente retorna 404 e erros de envio/consulta são apresentados sem simular sucesso.

### Etapa 8 — Testar o fluxo completo (20–30 min)

Façam uma rodada manual cobrindo estes casos:

- Abrir a página e confirmar que ela carrega.
- Consultar quando ainda não existem ocorrências.
- Cadastrar um relato válido e confirmar que aparece na lista.
- Confirmar que o total aumenta após o cadastro.
- Cadastrar ocorrências de categorias diferentes e verificar o resumo por categoria.
- Tentar enviar campos obrigatórios vazios.
- Tentar enviar categoria ou prioridade inválidas.
- Abrir uma URL inexistente e confirmar o 404.
- Reiniciar o servidor e verificar que os registros continuam no MongoDB.

Corrijam primeiro falhas que impeçam o fluxo essencial. Depois, revisem rótulos, mensagens e apresentação visual.

**Concluído quando:** todos os casos acima funcionam e os dados permanecem após reiniciar o servidor.

### Etapa 9 — Documentar e preparar os arquivos (10–15 min)

No `README.md`, expliquem:

1. Qual problema a aplicação aborda.
2. Quem é o público beneficiado e qual ODS se relaciona ao projeto.
3. Quais tecnologias são usadas.
4. Como instalar as dependências e executar o servidor.
5. Como configurar `MONGODB_URI` usando `.env.example`.
6. O que significam os indicadores e como são calculados.

Antes de gerar o ZIP, confirmem que ele contém o código-fonte, `package.json`, README e arquivos necessários, mas não contém `node_modules/` nem credenciais em `.env`.

**Concluído quando:** outra pessoa consegue seguir o README, configurar o banco e executar o projeto sem depender de instruções verbais.

## 6. Cronograma sugerido

| Etapa | Tempo estimado |
|---|---:|
| 1. Escopo e regras | 10–15 min |
| 2. Preparação do projeto | 15–20 min |
| 3. Express e MongoDB | 20–30 min |
| 4. HTML e CSS | 25–35 min |
| 5. Cadastro e validação | 30–40 min |
| 6. Consulta e indicadores | 30–40 min |
| 7. Erros e 404 | 10–15 min |
| 8. Testes | 20–30 min |
| 9. README e arquivos | 10–15 min |

As estimativas somam aproximadamente **3h30 a 4h**. Se houver atraso, reduzam refinamentos visuais; não removam validação, persistência, consulta nem os indicadores, pois fazem parte dos requisitos centrais.

## 7. Critério final de MVP pronto

O MVP está pronto quando um usuário consegue registrar uma ocorrência válida, recebe confirmação, vê o registro salvo na listagem e observa o total e o resumo por categoria atualizados. Entradas inválidas são rejeitadas, rotas inexistentes retornam 404, os dados persistem no MongoDB e o README explica como executar o projeto.
