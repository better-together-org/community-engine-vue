<template>
  <BCard class="bt-page-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-page-card__title mb-0">{{ page.title }}</h5>
          <slot name="sync-badge"><SyncBadge :item="page" /></slot>
        </div>
      </slot>
      <slot name="meta">
        <small class="text-muted" v-if="page.published_at">{{ formattedDate }}</small>
      </slot>
      <slot name="body">
        <BCardText>{{ excerpt }}</BCardText>
      </slot>
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <div class="d-flex align-items-center gap-2">
          <BButton variant="outline-primary" size="sm" @click="$emit('view', page)">Read</BButton>
          <ExtensionSlot target="PageCard" slot="footer" :context="{ item: page }" />
        </div>
      </slot>
    </template>
  </BCard>
</template>
<script setup>
import { computed } from 'vue'
import { BCard, BCardBody, BCardText, BButton } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'
const props = defineProps({ page: { type: Object, required: true } })
defineEmits(['view'])
const excerpt = computed(() => { const c = props.page.content || ''; return c.length > 200 ? c.slice(0, 200) + '…' : c })
const formattedDate = computed(() => new Date(props.page.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }))
</script>
