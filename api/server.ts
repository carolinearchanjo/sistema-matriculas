import dotenv from "dotenv";
dotenv.config();

import pool from "./database";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

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

app.get("/matriculas", async function (req, res) {
  try {
    let resultado;

    if (req.query.curso) {
      resultado = await pool.query(
        "SELECT * FROM matriculas WHERE curso ILIKE $1",
        [req.query.curso],
      );
    } else if (req.query.nome) {
      resultado = await pool.query(
        "SELECT * FROM matriculas WHERE nome ILIKE $1",
        [`%${req.query.nome}%`],
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

app.delete("/matricula/:id", async function (req, res) {
    
  try {
        await pool.query(
            "DELETE FROM matriculas WHERE id = $1",
            [req.params.id]
        )
        res.json({ mensagem: "Matrícula deletada com sucesso!" })
    } catch (erro) {
        console.error(erro)
        res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
})

app.put("/matricula/:id", async function (req, res) {
  
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
