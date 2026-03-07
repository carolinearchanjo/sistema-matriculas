<template>
  <div class="nav"><RouterLink to="/">Voltar ao formulário</RouterLink></div>
  <div class="painel">
    <h1>Painel Administrativo</h1>
    <p v-if="mensagem" class="mensagem-feedback">{{ mensagem }}</p>
    <div v-if="!matriculaEditando">
      <div class="filtros">
        <input type="text" v-model="filtroNome" placeholder="Buscar por nome" />
        <select v-model="filtroCurso">
          <option value="">Todos os cursos</option>
          <option value="Engenharia de Software">Engenharia de Software</option>
          <option value="Análise e Desenvolvimento de Sistemas">
            Análise e Desenvolvimento de Sistemas
          </option>
          <option value="Ciência da Computação">Ciência da Computação</option>
          <option value="Sistemas de Informação">Sistemas de Informação</option>
        </select>
        <button class="btn-buscar" @click="buscarMatriculas">Buscar</button>
        <button class="btn-limpar" @click="limparFiltros">Limpar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Curso</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="matricula in listaMatriculas" :key="matricula.id">
            <td>{{ matricula.id }}</td>
            <td>{{ matricula.nome }}</td>
            <td>{{ matricula.email }}</td>
            <td>{{ matricula.curso }}</td>
            <td>{{ formatarData(matricula.created_at) }}</td>
            <td>
              <div class="coluna-acoes">
                <button class="btn-editar" @click="editarMatricula(matricula)">
                  Editar
                </button>
                <button
                  class="btn-deletar"
                  @click="deletarMatricula(matricula.id)"
                >
                  Deletar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="form-edicao">
      <h2>Editando matrícula</h2>
      <input type="text" v-model="matriculaEditando.nome" placeholder="Nome" />
      <input
        type="text"
        v-model="matriculaEditando.email"
        placeholder="E-mail"
      />
      <select v-model="matriculaEditando.curso">
        <option value="Engenharia de Software">Engenharia de Software</option>
        <option value="Análise e Desenvolvimento de Sistemas">
          Análise e Desenvolvimento de Sistemas
        </option>
        <option value="Ciência da Computação">Ciência da Computação</option>
        <option value="Sistemas de Informação">Sistemas de Informação</option>
      </select>
      <div class="acoes-edicao">
        <button class="btn-salvar" @click="salvarEdicao">Salvar</button>
        <button class="btn-cancelar" @click="matriculaEditando = null">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

interface Matricula {
  id: number;
  nome: string;
  email: string;
  curso: string;
  created_at: string;
}

export default {
  setup() {
    const listaMatriculas = ref<Matricula[]>([]);
    const filtroCurso = ref("");
    const filtroNome = ref("");
    const mensagem = ref("");
    const matriculaEditando = ref<Matricula | null>(null);

    async function deletarMatricula(id: number) {
    const token = localStorage.getItem("token");
    
    await fetch(`${import.meta.env.VITE_API_URL}/matricula/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    
    const matriculaDeletada = listaMatriculas.value.find((m) => m.id === id);
    
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/matriculas`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const dados = await resposta.json();

    if (matriculaDeletada) {
        mensagem.value = `Matrícula de ${matriculaDeletada.nome} deletada com sucesso!`
    } else {
        mensagem.value = "Matrícula deletada com sucesso!"
    }
    listaMatriculas.value = dados;

    setTimeout(() => {
        mensagem.value = "";
    }, 3000);
}


    function editarMatricula(matricula: Matricula) {
      matriculaEditando.value = matricula;
    }

    async function salvarEdicao() {
      if (!matriculaEditando.value) return;

      const token = localStorage.getItem("token");

      await fetch(
        `${import.meta.env.VITE_API_URL}/matricula/${matriculaEditando.value.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(matriculaEditando.value),
        },
      );

      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/matriculas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dados = await resposta.json();

      listaMatriculas.value = dados;
      matriculaEditando.value = null;
      mensagem.value = "Matrícula atualizada com sucesso!";

      setTimeout(() => {
        mensagem.value = "";
      }, 3000);
    }

    function formatarData(data: string) {
      return new Date(data).toLocaleString("pt-BR");
    }

    async function buscarMatriculas() {
    const token = localStorage.getItem("token");
    let url = `${import.meta.env.VITE_API_URL}/matriculas`;
    const params = [];

    if (filtroNome.value) params.push(`nome=${encodeURIComponent(filtroNome.value)}`);
    if (filtroCurso.value) params.push(`curso=${encodeURIComponent(filtroCurso.value)}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const resposta = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const dados = await resposta.json();
    listaMatriculas.value = dados;
}

    function limparFiltros() {
      filtroNome.value = "";
      filtroCurso.value = "";
      buscarMatriculas();
    }

    onMounted(async () => {
      const token = localStorage.getItem("token");
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/matriculas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store"
      });
      const dados = await resposta.json();
      listaMatriculas.value = dados;
    });

    return {
      listaMatriculas,
      filtroCurso,
      filtroNome,
      mensagem,
      deletarMatricula,
      matriculaEditando,
      editarMatricula,
      salvarEdicao,
      formatarData,
      buscarMatriculas,
      limparFiltros,
    };
  },
};
</script>

<style scoped>
.painel {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  width: 95%;
  max-width: 1100px;
  margin: 2rem auto;
}

h1 {
  color: #2d1b69;
  margin-bottom: 1.5rem;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #2d1b69;
  color: white;
  padding: 0.75rem 1rem;
  text-align: left;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0d0f0;
}

tr:hover {
  background: #f9f5ff;
}

.btn-editar {
  background: #9b59b6;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-deletar {
  background: #c62828;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-editar:hover {
  background: #7d3f9e;
}
.btn-deletar:hover {
  background: #a31515;
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0d0f0;
}

.coluna-acoes {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.form-edicao {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.form-edicao h2 {
  color: #2d1b69;
  text-align: center;
  margin-bottom: 0.5rem;
}

.form-edicao input,
.form-edicao select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0d0f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.form-edicao input:focus,
.form-edicao select:focus {
  border-color: #9b59b6;
}

.acoes-edicao {
  display: flex;
  gap: 1rem;
}

.btn-salvar {
  background: #9b59b6;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
}

.btn-cancelar {
  background: #e0d0f0;
  color: #2d1b69;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
}

.btn-salvar:hover {
  background: #7d3f9e;
}
.btn-cancelar:hover {
  background: #c9b8e8;
}

.mensagem-feedback {
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #e8f5e9;
  color: #2e7d32;
  margin-bottom: 1rem;
}

.filtros {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.filtros input {
  padding: 0.75rem 1rem;
  border: 2px solid #e0d0f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  flex: 1;
  box-sizing: border-box;
}

.filtros select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0d0f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  flex: 1;
  box-sizing: border-box;
}

.filtros input:focus,
.filtros select:focus {
  border-color: #9b59b6;
}

.btn-buscar {
  background: #2d1b69;
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-limpar {
  background: #e0d0f0;
  color: #2d1b69;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-buscar:hover {
  background: #1a0f3d;
}

.btn-limpar:hover {
  background: #c9b8e8;
}

.nav {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

.nav a {
  background: #2d1b69;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
}

.nav a:hover {
  background: #1a0f3d;
}
</style>

<style>
body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b69, #9b59b6, #d7aefb);
  font-family: "Segoe UI", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
