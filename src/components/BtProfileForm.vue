<template>
  <vue-form-generator
    tag="div"
    :schema="schema"
    :model="localModel"
    rows="3"
    max-rows="6"
    :is-new-model="true"
  />
</template>

<script>
import VueFormGenerator from 'vue-form-generator'
import BtProfileFormSchema from '../forms/BtProfileFormSchema'

export default {
  name: 'BtProfileForm',
  components: {
    'vue-form-generator': VueFormGenerator.component,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      schema: BtProfileFormSchema,
      name: '',
      description: '',
    }
  },
  computed: {
    localModel: {
      get() { return this.model },
      set(model) { this.$emit('input', model) },
    },
  },
}
</script>

<style scoped lang="scss">

</style>
