<template>
  <v-app-bar :elevation="elevation" :color="color">
    <v-app-bar-title class="font-weight-semibold text-headline-large">{{ title }}</v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <v-app-bar-nav-icon @click="emit('toggle-drawer')" class="text-headline-large"></v-app-bar-nav-icon>
  </v-app-bar>
  
  <v-navigation-drawer
    :model-value="drawerValue"
    @update:model-value="(val) => emit('update:drawerValue', val)"
    :location="location"
    :temporary="temporary"
    class="bg-darkGreen"
  >
   
    <slot>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :value="item.value"
          :prepend-icon="item.icon"
          @click="emit('menu-click', item.value)"
        >
         
          <template v-slot:title>
            <div class="text-white font-weight-semibold">
              <slot :name="item.value" :item="item">
                {{ item.title }}
              </slot>
            </div>
          </template>

              <!-- <template v-slot:icon>
            <div class="text-white font-weight-semibold">
              <slot :name="item.value" :item="item">
                {{ item.icon}}
              </slot>
            </div>
          </template> -->
        </v-list-item>
      </v-list>
    </slot>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

export interface MenuItem {
  title: string
  value: string
  icon?: string
}

defineProps({
  drawerValue: { type: Boolean, required: true },
  title: { type: String, default: 'Bookfly' },
  color: { type: String, default: 'primary' },
  elevation: { type: [Number, String], default: 2 },
  location: { type: String as PropType<'left' | 'right' | 'top' | 'bottom'>, default: 'right' },
  temporary: { type: Boolean, default: true },
  menuItems: { type: Array as PropType<MenuItem[]>, default: () => [] }
})

const emit = defineEmits<{
  'toggle-drawer': []
  'update:drawerValue': [value: boolean]
  'menu-click': [value: string]
}>()
</script>