<template>

    <BaseNavbar
      v-model:drawerValue="drawer"
      :menu-items="meusLinks"
      title="BookFly"
      color="primary"
      @toggle-drawer="drawer = !drawer"
      @menu-click="navegar"
    />


</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseNavbar from '@/components/ComponentNavBar.vue'
import type { MenuItem } from '@/components/ComponentNavBar.vue'

const router = useRouter()
const drawer = ref(false)

const meusLinks: MenuItem[] = [
  { title: 'Home', value: 'home', icon: 'mdi-home' },
]

function navegar(destino: string) {
  router.push({ name: destino })
}
</script>