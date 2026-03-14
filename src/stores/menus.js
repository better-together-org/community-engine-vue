import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('btMenus', () => {
  const headerMenuItems = ref([
    { id: 0, path: '/', label: 'Home', title: 'Home', url: '#', external: false, sortOrder: 0 },
  ])

  function setHeaderMenuItems(items) {
    headerMenuItems.value = items
  }

  return { headerMenuItems, setHeaderMenuItems }
}, { persist: false })
