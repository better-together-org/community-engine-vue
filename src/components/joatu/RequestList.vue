<template>
  <div class="bt-request-list">
    <slot name="header" />
    <div v-if="loading" class="bt-request-list__loading">
      <slot name="loading"><div class="text-center p-4 text-muted">Loading requests…</div></slot>
    </div>
    <div v-else-if="!requests.length" class="bt-request-list__empty">
      <slot name="empty"><div class="text-center p-4 text-muted">No requests yet.</div></slot>
    </div>
    <template v-else>
      <slot
        v-for="(request, index) in requests"
        :key="request.id"
        name="item"
        :item="request"
        :index="index"
      >
        <RequestCard
          :request="request"
          class="mb-3"
          @view="$emit('view', request)"
        />
      </slot>
    </template>
    <slot name="footer" />
  </div>
</template>
<script setup>
import RequestCard from './RequestCard.vue'
defineProps({
  requests: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
