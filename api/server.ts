import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "./database";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

function verificarToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ mensagem: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.usuario = decoded;
    next();
  } catch (erro) {
    res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
}

app.post("/login", async function (req, res) {
  const { usuario, senha } = req.body;

  if (usuario !== process.env.ADMIN_USER) {
    res.status(401).json({ mensagem: "Credenciais inválidas" });
    return;
  }

  const senhaCorreta = bcrypt.compareSync(senha, process.env.ADMIN_PASSWORD!);
  if (!senhaCorreta) {
    res.status(401).json({ mensagem: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign({ usuario }, process.env.JWT_SECRET!, {
    expiresIn: "8h",
  });

  res.json({ token });
});

interface Matricula {
  nome: string;
  email: string;
  curso: string;
}

app.get("/cursos", function (req, res) {
  const cursos = [
    "Engenharia de Software",
    "Análise e Desenvolvimento de Sistemas",
    "Ciência da Computação",
    "Sistemas de Informação",
  ];
  res.json(cursos);
});

app.post("/matricula", async function (req, res) {
  const dados: Matricula = req.body;

  if (!dados.nome || !dados.email || !dados.curso) {
    res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    return;
  }

  try {
    const forcar = req.query.forcar === "true";

    if (!forcar) {
      const existente = await pool.query(
        "SELECT id FROM matriculas WHERE email = $1",
        [dados.email],
      );

      if (existente.rows.length > 0) {
        res.status(409).json({ mensagem: "ja_existe" });
        return;
      }
    }

    const resultado = await pool.query(
      "INSERT INTO matriculas (nome, email, curso) VALUES ($1, $2, $3) RETURNING *",
      [dados.nome, dados.email, dados.curso],
    );
    res.status(201).json({
      mensagem: "Matrícula realizada com sucesso!",
      dados: resultado.rows[0],
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

app.get("/matriculas", verificarToken, async function (req, res) {
  try {
    let resultado;

    if (req.query.nome && req.query.curso) {
      resultado = await pool.query(
        "SELECT * FROM matriculas WHERE nome ILIKE $1 AND curso = $2",
        [`%${req.query.nome}%`, req.query.curso],
      );
    } else if (req.query.nome) {
      resultado = await pool.query(
        "SELECT * FROM matriculas WHERE nome ILIKE $1",
        [`%${req.query.nome}%`],
      );
    } else if (req.query.curso) {
      resultado = await pool.query(
        "SELECT * FROM matriculas WHERE curso = $1",
        [req.query.curso],
      );
    } else {
      resultado = await pool.query("SELECT * FROM matriculas");
    }

    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

app.delete("/matricula/:id", verificarToken, async function (req, res) {
  try {
    await pool.query("DELETE FROM matriculas WHERE id = $1", [req.params.id]);
    res.json({ mensagem: "Matrícula deletada com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

app.put("/matricula/:id", verificarToken, async function (req, res) {
  const dados: Matricula = req.body;

  if (!dados.nome || !dados.email || !dados.curso) {
    res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    return;
  }

  try {
    const atualizaDados = await pool.query(
      "UPDATE matriculas SET nome = $1, email = $2, curso = $3 WHERE id = $4 RETURNING *",
      [dados.nome, dados.email, dados.curso, req.params.id],
    );
    res.status(201).json({
      mensagem: "Matrícula atualizada com sucesso!",
      dados: atualizaDados.rows[0],
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

app.listen(3000, function () {
  console.log("Servidor rodando na porta 3000");
});
