<template>
  <div class="nav">
    <RouterLink to="/login">Painel Admin</RouterLink>
  </div>
  <div class="container" v-if="!matriculaRealizada">
    <h1>Faça sua matrícula!</h1>
    <form @submit.prevent="enviarMatricula">
      <input
        type="text"
        name="nome"
        placeholder="Nome Completo"
        v-model="nome"
      />
      <p v-if="faltaNome" class="erro-campo">{{ faltaNome }}</p>
      <input type="text" name="email" placeholder="E-mail" v-model="email" />
      <p v-if="formatoEmail" class="erro-campo">{{ formatoEmail }}</p>

      <select v-model="curso">
        <option value="" disabled selected hidden>Selecione uma opção</option>
        <option v-for="curso in listaCursos" :key="curso" :value="curso">
          {{ curso }}
        </option>
      </select>
      <p v-if="faltaCurso" class="erro-campo">{{ faltaCurso }}</p>

      <button type="submit" id="botaoMatricula">Matricular</button>
    </form>
  </div>

  <div v-else class="sucesso-container">
    <h2>✅ Matrícula realizada com sucesso!</h2>
    <p>Seu nome: {{ nome }}</p>
    <p>Seu e-mail: {{ email }}</p>
    <p>Curso selecionado: {{ curso }}</p>

    <button @click="novaMatricula">Realizar nova matrícula</button>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
  setup() {
    const nome = ref("");
    const email = ref("");
    const curso = ref("");
    const mensagem = ref("");
    const tipomensagem = ref("");
    const listaCursos = ref([]);
    let matriculaRealizada = ref(false);
    let formatoEmail = ref("");
    let faltaNome = ref("");
    let faltaCurso = ref("");

    async function enviarMatricula() {
      faltaNome.value = "";
      formatoEmail.value = "";
      faltaCurso.value = "";

      let temErro = false;

      if (!nome.value) {
        faltaNome.value = "O nome completo é obrigatório";
        temErro = true;
      }

      if (!curso.value) {
        faltaCurso.value = "A seleção de um curso é obrigatória";
        temErro = true;
      }

      if (!email.value) {
        formatoEmail.value = "O e-mail é obrigatório";
        temErro = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        formatoEmail.value = "O e-mail digitado é inválido";
        temErro = true;
      }

      if (temErro) return;

      const dadosMatricula = {
        nome: nome.value,
        email: email.value,
        curso: curso.value,
      };

      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/matricula`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosMatricula),
        },
      );

      if (resposta.ok) {
        matriculaRealizada.value = true;
        mensagem.value = "Matrícula realizada com sucesso!";
        tipomensagem.value = "sucesso";
      } else {
        mensagem.value = "Erro ao realizar matrícula. Tente novamente.";
        tipomensagem.value = "erro";
      }
    }
    function novaMatricula() {
      nome.value = "";
      email.value = "";
      curso.value = "";
      matriculaRealizada.value = false;
    }

    onMounted(async () => {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/cursos`);
      const dados = await resposta.json();
      listaCursos.value = dados;
    });

    return {
      nome,
      email,
      curso,
      listaCursos,
      mensagem,
      tipomensagem,
      enviarMatricula,
      matriculaRealizada,
      novaMatricula,
      formatoEmail,
      faltaNome,
      faltaCurso,
    };
  },
};
</script>

<style scoped>
form {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem 1rem;
  border: 2px solid #e0d0f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  width: 100%;
  box-sizing: border-box;
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid #e0d0f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  width: 100%;
  box-sizing: border-box;

  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239b59b6' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
}

input:focus,
select:focus {
  border-color: #9b59b6;
}

button {
  background: #9b59b6;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

button:hover {
  background: #7d3f9e;
}

.sucesso {
  color: #2e7d32;
  background: #e8f5e9;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
}

.erro {
  color: #c62828;
  background: #ffebee;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
}

h1 {
  text-align: center;
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-shadow:
    0 2px 6px rgba(0, 0, 0, 0.3),
    0 6px 20px rgba(0, 0, 0, 0.4);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
}

.sucesso-container {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
  box-sizing: border-box;
}

.sucesso-container h2 {
  color: #2d1b69;
  margin: 0;
  font-size: 1.5rem;
  text-shadow: 0 2px 8px rgba(45, 27, 105, 0.2);
}

.erro-campo {
  color: #c62828;
  font-size: 0.8rem;
  margin: -0.5rem 0 0 0.25rem;
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

@media (max-width: 768px) {
  .container {
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  form {
    border-radius: 12px;
  }

  h1 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .nav {
    top: 0.5rem;
    right: 0.5rem;
  }

  .nav a {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }

  .sucesso-container {
    width: 100%;
    box-sizing: border-box;
    padding: 1.5rem 1rem;
  }
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
  padding: 1rem;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  body {
    align-items: center;
    min-height: 100dvh;
  }
}
</style>
