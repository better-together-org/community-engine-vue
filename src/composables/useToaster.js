import { useToastController } from 'bootstrap-vue-next'

export function useToaster() {
  const { show } = useToastController()

  function toast(msg, type = null, opts = {}) {
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
  }

  return { toast }
}
