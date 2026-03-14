<template>
  <div class="bt-member-list">
    <slot name="header" />
    <div v-if="loading">
      <slot name="loading">
        <BSpinner :label="t('bt.person.loading')" />
      </slot>
    </div>
    <div v-else-if="!members.length">
      <slot name="empty">
        <p class="text-muted">
          {{ t('bt.person.members_empty') }}
        </p>
      </slot>
    </div>
    <div
      v-else
      class="bt-member-list__items"
    >
      <div
        v-for="(member, index) in members"
        :key="member.id"
        class="bt-member-list__item"
      >
        <slot
          name="item"
          :item="member"
          :index="index"
        >
          <div class="d-flex align-items-center gap-2">
            <PersonAvatar
              :person="{ id: member.person_id, name: '' }"
              :size="32"
            />
            <span>{{ member.person_id }}</span>
            <BBadge
              v-if="member.role"
              variant="secondary"
            >
              {{ member.role }}
            </BBadge>
          </div>
        </slot>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BBadge, BSpinner } from 'bootstrap-vue-next'
import PersonAvatar from './PersonAvatar.vue'

const { t } = useI18n()

defineProps({
  members: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
</script>
