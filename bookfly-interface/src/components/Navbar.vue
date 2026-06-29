<template>

    <BaseNavbar
      v-model:drawerValue="drawer"
      :menu-items="menuItems"
      title="BookFly"
      color="primary"
      @toggle-drawer="drawer = !drawer"
      @menu-click="navigate"
    />


</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseNavbar from '@/components/ComponentNavBar.vue'
import type { MenuItem } from '@/components/ComponentNavBar.vue'
import { useNavbar } from '@/composable/useNavbar'
const router = useRouter()
const drawer = ref(false)

const {menuItems} = useNavbar()

function navigate(d: string) {
  router.push({ name: d })
}
</script>