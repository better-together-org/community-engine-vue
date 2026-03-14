<template>
  <div class="bt-community-members">
    <h2>{{ t('bt.navigation.members') }}</h2>
    <MemberList
      :members="items"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useMembers } from '../../composables/useMembers'
import MemberList from '../../components/person/MemberList.vue'

const { t } = useI18n()

const route = useRoute()
const { items, loading, listActive } = useMembers(route.params.communitySlug)
onMounted(() => listActive())
</script>
