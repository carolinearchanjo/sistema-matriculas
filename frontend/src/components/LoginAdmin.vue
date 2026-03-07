<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="fazerLogin">
      <input type="text" placeholder="Usuário" v-model="usuario"/>
      <input type="password" placeholder="Senha" v-model="senha"/>
      <p v-if="erro" class="erro-campo">{{ erro }}</p>
      <button type="submit">Fazer Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const usuario = ref("")
        const senha = ref("")
        const erro = ref("")
        const router = useRouter()

        async function fazerLogin() {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario: usuario.value, senha: senha.value })
            })

            if (resposta.ok) {
                const dados = await resposta.json()
                localStorage.setItem("token", dados.token)
                router.push("/admin")
            } else {
                erro.value = "Usuário ou senha incorretos"
            }
        }

        return { usuario, senha, erro, fazerLogin }
    }
}
</script>

<style scoped>
.container {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

h1 {
  color: #2d1b69;
  margin-bottom: 0.5rem;
}

form {
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

input:focus {
  border-color: #9b59b6;
}

button {
  background: #9b59b6;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background: #7d3f9e;
}

.erro-campo {
  color: #c62828;
  font-size: 0.8rem;
  margin: -0.5rem 0 0 0.25rem;
}

@media (max-width: 768px) {
  .container {
    margin: 1rem;
    width: calc(100% - 2rem);
    box-sizing: border-box;
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
}

@media (max-width: 768px) {
  body {
    align-items: flex-start;
    padding-top: 2rem;
  }
}

</style>