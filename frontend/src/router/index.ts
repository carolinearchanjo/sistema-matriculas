import { createRouter, createWebHistory } from 'vue-router'
import FormularioMatricula from '../components/FormularioMatricula.vue'
import PainelAdmin from '../components/PainelAdmin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: FormularioMatricula
    },
    {
      path: '/admin',
      component: PainelAdmin
    }
  ],
})

export default router
