# Sistema de Matrículas Online

Aplicação web para matrícula em cursos online, desenvolvida com Vue.js no frontend e Node.js + Express + TypeScript no backend, conectada ao banco de dados com PostgreSQL.

## Como rodar o projeto

### API
1. Abra um terminal e navegue até a pasta `api`
2. Rode `npm install` para instalar as dependências
3. Rode `npm start` para iniciar o servidor

### Frontend
1. Abra um segundo terminal e navegue até a pasta `frontend`
2. Rode `npm install` para instalar as dependências
3. Rode `npm run dev` para iniciar a aplicação

## Configurando o banco de dados

1. Baixe e instale o PostgreSQL em [postgresql.org/download](https://postgresql.org/download)

2. Acesse o PostgreSQL pelo terminal:
```sql
psql -U postgres
```

3. Crie o banco de dados:
```sql
CREATE DATABASE matriculas;
```

4. Conecte ao banco:
```sql
\c matriculas
```

5. Crie a tabela:
```sql
CREATE TABLE matriculas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    curso VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

6. Na pasta `api`, copie o arquivo `.env.example`, renomeie para `.env` e preencha com as credenciais do seu banco de dados.

## Como acessar

- **Formulário de matrícula:** http://localhost:5173
- **Painel administrativo:** http://localhost:5173/admin

## Documentação da API

A API roda em `http://localhost:3000`. Abaixo estão as rotas disponíveis:

### Cursos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cursos` | Retorna a lista de cursos disponíveis |

### Matrículas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/matriculas` | Retorna todas as matrículas |
| GET | `/matriculas?nome=João` | Filtra matrículas por nome |
| GET | `/matriculas?curso=Engenharia de Software` | Filtra matrículas por curso |
| GET | `/matriculas?nome=João&curso=Engenharia de Software` | Filtra por nome e curso combinados |
| POST | `/matricula` | Cria uma nova matrícula |
| PUT | `/matricula/:id` | Atualiza os dados de uma matrícula |
| DELETE | `/matricula/:id` | Remove uma matrícula |

### Exemplo de body para POST e PUT
```json
{
    "nome": "Caroline Mota Archanjo",
    "email": "caroline@gmail.com",
    "curso": "Análise e Desenvolvimento de Sistemas"
}
```