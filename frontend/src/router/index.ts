import { createRouter, createWebHistory } from 'vue-router'
import FormularioMatricula from '../components/FormularioMatricula.vue'
import PainelAdmin from '../components/PainelAdmin.vue'
import LoginAdmin from '../components/LoginAdmin.vue'

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
    },
    {
      path: '/login',
      component: LoginAdmin
    }
  ],
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token")
    
    if (to.path === "/admin" && !token) {
        next("/login")
    } else {
        next()
    }
})

export default router