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

## Configurando o administrador

O sistema possui um único administrador configurado via variáveis de ambiente. No arquivo `.env`, defina:
```
ADMIN_USER=admin
ADMIN_PASSWORD=seu_hash_aqui
JWT_SECRET=sua_chave_secreta
```

A senha deve ser armazenada como um hash gerado pelo bcrypt. Para gerar o hash da sua senha, crie um arquivo temporário `gerar-hash.ts` na pasta `api` com o seguinte conteúdo:
```typescript
import bcrypt from 'bcryptjs'
const senha = "sua_senha_aqui"
const hash = bcrypt.hashSync(senha, 10)
console.log(hash)
```

Execute com `npx ts-node gerar-hash.ts` e copie o hash gerado para o `.env`. Após isso, o arquivo pode ser deletado.

## Como acessar

- **Formulário de matrícula:** http://localhost:5173
- **Login do administrador:** http://localhost:5173/login
- **Painel administrativo:** http://localhost:5173/admin *(requer autenticação)*

## Documentação da API

A API roda em `http://localhost:3000`. Abaixo estão as rotas disponíveis:

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/login` | Autentica o administrador e retorna um token JWT |

### Cursos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cursos` | Retorna a lista de cursos disponíveis |

### Matrículas
| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/matricula` | Cria uma nova matrícula | Não |
| GET | `/matriculas` | Retorna todas as matrículas | ✅ Sim |
| GET | `/matriculas?nome=João` | Filtra matrículas por nome | ✅ Sim |
| GET | `/matriculas?curso=Engenharia de Software` | Filtra matrículas por curso | ✅ Sim |
| GET | `/matriculas?nome=João&curso=Engenharia de Software` | Filtra por nome e curso combinados | ✅ Sim |
| PUT | `/matricula/:id` | Atualiza os dados de uma matrícula | ✅ Sim |
| DELETE | `/matricula/:id` | Remove uma matrícula | ✅ Sim |

### Exemplo de body para POST /login
```json
{
    "usuario": "admin",
    "senha": "sua_senha_aqui"
}
```

### Exemplo de body para POST e PUT /matricula
```json
{
    "nome": "Caroline Mota Archanjo",
    "email": "caroline@gmail.com",
    "curso": "Análise e Desenvolvimento de Sistemas"
}
```

### Autenticação nas rotas protegidas

As rotas marcadas com ✅ exigem um token JWT no header da requisição:
```
Authorization: Bearer seu_token_aqui
```

O token é obtido através da rota `POST /login` e expira em 8 horas.