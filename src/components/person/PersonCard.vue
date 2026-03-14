<template>
  <BCard class="bt-person-card">
    <BCardBody class="d-flex align-items-start gap-3">
      <slot name="avatar">
        <PersonAvatar :person="person" :size="48" />
      </slot>
      <div class="flex-grow-1">
        <slot name="title">
          <div class="d-flex align-items-center gap-2">
            <strong class="bt-person-card__name">{{ person.name }}</strong>
            <slot name="sync-badge"><SyncBadge :item="person" /></slot>
          </div>
        </slot>
        <slot name="meta">
          <small class="text-muted">@{{ person.handle || person.slug }}</small>
        </slot>
        <slot name="body" />
      </div>
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <ExtensionSlot target="PersonCard" slot="footer" :context="{ item: person }" />
      </slot>
    </template>
  </BCard>
</template>

<script setup>
import { BCard, BCardBody } from 'bootstrap-vue-next'
import PersonAvatar from './PersonAvatar.vue'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'

defineProps({
  person: { type: Object, required: true },
})
</script>
