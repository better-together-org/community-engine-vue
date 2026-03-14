import { useToastController } from 'bootstrap-vue-next'

// Legacy mixin — kept for Options API components still being migrated.
// New components should use useToaster() directly.
export default {
  methods: {
    $toaster(msg, type = null, opts = {}) {
      const { show } = useToastController()
      show({
        props: {
          body: msg,
          variant: type,
          solid: true,
          value: opts.autoHideDelay || 2000,
          title: opts.title,
          pos: 'top-end',
        },
      })
    },
  },
}
