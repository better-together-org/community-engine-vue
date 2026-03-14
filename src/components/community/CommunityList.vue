<template>
  <div class="bt-community-list">
    <slot name="header" />
    <div
      v-if="loading"
      class="bt-community-list__loading"
    >
      <slot name="loading">
        <BSpinner :label="t('bt.communities.loading')" />
      </slot>
    </div>
    <div
      v-else-if="!communities.length"
      class="bt-community-list__empty"
    >
      <slot name="empty">
        <p class="text-muted">
          {{ t('bt.communities.list_empty') }}
        </p>
      </slot>
    </div>
    <BRow v-else>
      <BCol
        v-for="(community, index) in communities"
        :key="community.id"
        cols="12"
        md="6"
        lg="4"
        class="mb-4"
      >
        <slot
          name="item"
          :item="community"
          :index="index"
        >
          <CommunityCard
            :community="community"
            @view="$emit('view', community)"
          />
        </slot>
      </BCol>
    </BRow>
    <slot name="footer" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BRow, BCol, BSpinner } from 'bootstrap-vue-next'
import CommunityCard from './CommunityCard.vue'

const { t } = useI18n()

defineProps({
  communities: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
