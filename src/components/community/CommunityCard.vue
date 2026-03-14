<template>
  <BCard class="bt-community-card">
    <template #header>
      <slot name="header">
        <div class="bt-community-card__cover" :style="coverStyle">
          <slot name="sync-badge"><SyncBadge :item="community" /></slot>
        </div>
      </slot>
    </template>

    <BCardBody>
      <slot name="title">
        <h5 class="bt-community-card__name">{{ community.name }}</h5>
      </slot>

      <slot name="meta">
        <div class="bt-community-card__meta">
          <BBadge :variant="privacyVariant" class="me-1">{{ community.privacy }}</BBadge>
        </div>
      </slot>

      <slot name="body">
        <BCardText class="bt-community-card__description">
          {{ truncatedDescription }}
        </BCardText>
      </slot>
    </BCardBody>

    <template #footer>
      <slot name="footer">
        <div class="bt-community-card__actions">
          <BButton variant="outline-primary" size="sm" @click="$emit('view', community)">
            View Community
          </BButton>
          <ExtensionSlot target="CommunityCard" slot="footer" :context="{ item: community }" />
        </div>
      </slot>
    </template>
  </BCard>
</template>

<script setup>
import { computed } from 'vue'
import { BCard, BCardBody, BCardText, BBadge, BButton } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'

const props = defineProps({
  community: { type: Object, required: true },
})
defineEmits(['view'])

const coverStyle = computed(() => {
  if (props.community.cover_image_url) {
    return {
      backgroundImage: `url(${props.community.cover_image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { backgroundColor: 'var(--bt-primary, #4f46e5)' }
})

const privacyVariant = computed(() => ({
  public: 'success', private: 'danger', protected: 'warning',
}[props.community.privacy] ?? 'secondary'))

const truncatedDescription = computed(() => {
  const desc = props.community.description || ''
  return desc.length > 120 ? desc.slice(0, 120) + '…' : desc
})
</script>

<style scoped lang="scss">
.bt-community-card__cover {
  height: 120px;
  position: relative;
  border-radius: 4px 4px 0 0;

  .sync-badge {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
.bt-community-card__name { font-weight: 600; margin-bottom: 0.25rem; }
.bt-community-card__meta { margin-bottom: 0.5rem; }
.bt-community-card__description { font-size: 0.875rem; color: #6b7280; }
.bt-community-card__actions { display: flex; gap: 0.5rem; align-items: center; }
</style>
