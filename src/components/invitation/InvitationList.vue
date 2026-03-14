<template>
  <div class="bt-invitation-list">
    <slot name="header" />
    <div
      v-if="loading"
      class="bt-invitation-list__loading"
    >
      <slot name="loading">
        <div class="text-center p-4 text-muted">
          {{ t('bt.invitations.loading') }}
        </div>
      </slot>
    </div>
    <div
      v-else-if="!invitations.length"
      class="bt-invitation-list__empty"
    >
      <slot name="empty">
        <div class="text-center p-4 text-muted">
          {{ t('bt.invitations.list_empty') }}
        </div>
      </slot>
    </div>
    <template v-else>
      <slot
        v-for="(invitation, index) in invitations"
        :key="invitation.id"
        name="item"
        :item="invitation"
        :index="index"
      >
        <InvitationCard
          :invitation="invitation"
          class="mb-3"
          @view="$emit('view', invitation)"
        />
      </slot>
    </template>
    <slot name="footer" />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import InvitationCard from './InvitationCard.vue'
const { t } = useI18n()
defineProps({
  invitations: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
