# Cidade em Foco

Cidade em Foco é um MVP acadêmico de CitizenTech para registrar e acompanhar problemas urbanos que afetam a qualidade de vida da comunidade. A aplicação permite cadastrar ocorrências como buracos, iluminação pública inadequada, descarte irregular de resíduos e problemas de acessibilidade, além de visualizar os registros e indicadores gerais.

## Problema

A cidade enfrenta diversos problemas urbanos que, quando não são registrados e acompanhados, tornam mais difícil a organização de ações comunitárias e a priorização de melhorias. Pequenos problemas cotidianos, como postes apagados, buracos em vias e descarte irregular de resíduos, podem impactar diretamente a mobilidade, a segurança e a acessibilidade.

## Público-alvo

A aplicação é voltada para moradores, comunidades locais e agentes públicos que precisam visualizar e organizar ocorrências urbanas em uma região.

## Objetivo

Facilitar o registro e a consulta de problemas urbanos para que a comunidade tenha uma visão mais clara de situações que exigem atenção e solução.

## Vídeo

[Assista ao vídeo da apresentação](https://youtu.be/GiT_wYfpHss?si=T5BuMWVCLqe5IGHH)

## Integrantes

- Pedro Lisboa - RM565722
- Bruna Queiroz - RM565648

## ODS relacionado

Este projeto está alinhado ao ODS 11: Cidades e Comunidades Sustentáveis.

## Funcionalidades

- Cadastro de ocorrências com categoria, local, descrição e prioridade
- Validação básica no servidor
- Persistência em banco MongoDB
- Modo de demonstração em memória para testes rápidos
- Listagem das ocorrências cadastradas
- Indicadores:
  - total de ocorrências
  - quantidade por categoria

## Tecnologias

- HTML
- CSS
- JavaScript
- Node.js
- Express
- MongoDB

## Estrutura do projeto

- `server.js` — servidor Express e rotas da API
- `validation.js` — validação das ocorrências
- `mock-store.js` — armazenamento em memória para demonstração
- `public/` — frontend em HTML, CSS e JavaScript
- `test/` — testes automatizados
- `.env.example` — exemplo de variáveis de ambiente

## Requisitos

- Node.js 20 ou superior
- MongoDB local ou acessível pela rede

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` com base no exemplo:

   ```bash
   cp .env.example .env
   ```

3. Configure o modo de armazenamento:

   - Para demonstração:

   ```env
   STORAGE_MODE=mock
   ```

   - Para usar MongoDB:

   ```env
   STORAGE_MODE=mongodb
   MONGODB_URI=mongodb://127.0.0.1:27017
   MONGODB_DB=cidade_em_foco
   PORT=3000
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

5. Acesse a aplicação em:

   ```text
   http://localhost:3000
   ```

## API

### GET /api/ocorrencias

Retorna:
- lista de ocorrências
- total de registros
- contagem por categoria
- modo de armazenamento ativo

### POST /api/ocorrencias

Cria uma nova ocorrência com os campos:
- categoria
- local
- descricao
- prioridade

## Indicadores

A aplicação calcula:

1. Total de ocorrências cadastradas
2. Quantidade de registros por categoria

Esses indicadores ajudam a visualizar quais tipos de problema aparecem com maior frequência e dão suporte à análise da comunidade e de gestores locais.

## Validação

Os dados são validados no servidor para garantir que:
- categoria seja válida
- local e descrição não fiquem vazios
- textos respeitem limites de tamanho
- prioridade seja válida

## Observações

- O modo `mock` é útil para demonstração e testes, mas os dados são temporários e desaparecem ao reiniciar o servidor.
- O arquivo `.env` não deve ser enviado junto ao ZIP da entrega final.
- A pasta `node_modules` também deve ser removida do pacote final.

## Como testar

```bash
npm test
```

## Licença

Projeto acadêmico para a disciplina de Application Development.
