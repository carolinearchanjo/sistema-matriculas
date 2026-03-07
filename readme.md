# Sistema de Matrículas Online

Aplicação web para matrícula em cursos online, desenvolvida com Vue.js no frontend e Node.js + Express + TypeScript no backend, conectada ao banco de dados PostgreSQL. O projeto está hospedado online com a API no Railway e o frontend no Vercel.

## Acesse o projeto

- **Formulário de matrícula:** [sistema-matriculas-git-master-carolinearchanjos-projects.vercel.app](https://sistema-matriculas-git-master-carolinearchanjos-projects.vercel.app/)
- **Login do administrador:** [sistema-matriculas-git-master-carolinearchanjos-projects.vercel.app/login](https://sistema-matriculas-git-master-carolinearchanjos-projects.vercel.app/login)
- **Painel administrativo:** [sistema-matriculas-git-master-carolinearchanjos-projects.vercel.app/admin](https://sistema-matriculas-git-master-carolinearchanjos-projects.vercel.app/admin) *(requer autenticação)*

## Credenciais de demonstração

Para explorar o painel administrativo, utilize:

- **Usuário:** `admin`
- **Senha:** `admin123`

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado — baixe em [postgresql.org/download](https://postgresql.org/download)

### Configurando o banco de dados

1. Acesse o PostgreSQL pelo terminal:
```sql
psql -U postgres
```

2. Crie o banco de dados:
```sql
CREATE DATABASE matriculas;
```

3. Conecte ao banco:
```sql
\c matriculas
```

4. Crie a tabela:
```sql
CREATE TABLE matriculas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    curso VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Configurando as variáveis de ambiente

Na pasta `api`, copie o arquivo `.env.example`, renomeie para `.env` e preencha:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=matriculas
ADMIN_USER=admin
ADMIN_PASSWORD=seu_hash_aqui
JWT_SECRET=sua_chave_secreta
```

A senha do administrador deve ser armazenada como um hash gerado pelo bcrypt. Para gerar o hash, crie um arquivo temporário `gerar-hash.ts` na pasta `api`:
```typescript
import bcrypt from 'bcryptjs'
const senha = "sua_senha_aqui"
const hash = bcrypt.hashSync(senha, 10)
console.log(hash)
```

Execute com `npx ts-node gerar-hash.ts`, copie o hash gerado para o `.env` e delete o arquivo.

Na pasta `frontend`, copie o arquivo `.env.example`, renomeie para `.env` e preencha:
```
VITE_API_URL=http://localhost:3000
```

### Rodando o projeto

**API:**
1. Abra um terminal e navegue até a pasta `api`
2. Rode `npm install` para instalar as dependências
3. Rode `npm start` para iniciar o servidor

**Frontend:**
1. Abra um segundo terminal e navegue até a pasta `frontend`
2. Rode `npm install` para instalar as dependências
3. Rode `npm run dev` para iniciar a aplicação

**Acesse localmente em:** http://localhost:5173

## Documentação da API

A API de produção roda em `https://sistema-matriculas-production.up.railway.app`.

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