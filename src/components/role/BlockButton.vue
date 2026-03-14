<template>
  <BButton
    v-if="!isBlocked(personId)"
    variant="outline-danger"
    size="sm"
    :title="t('bt.person.block')"
    @click="handleBlock"
  >
    {{ t('bt.person.block') }}
  </BButton>
  <BButton
    v-else
    variant="outline-secondary"
    size="sm"
    :title="t('bt.person.unblock')"
    @click="handleUnblock"
  >
    {{ t('bt.person.unblock') }}
  </BButton>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BButton } from 'bootstrap-vue-next'
import { usePersonBlocks } from '../../composables/usePersonBlocks'

const props = defineProps({
  personId: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const { isBlocked, blockPerson, unblockPerson } = usePersonBlocks()

async function handleBlock() {
  await blockPerson(props.personId)
}

async function handleUnblock() {
  await unblockPerson(props.personId)
}
</script>
