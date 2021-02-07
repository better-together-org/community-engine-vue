import toaster from './toaster'

export default {
  mixins: [
    toaster,
  ],
  methods: {
    $handleResponseError(response) {
      const { status } = response
      let message = ''

      switch (status) {
      case 401:
        message = response.data.error
        break
      case 500:
        message = 'Sorry, there was a server error. Please try again.'
        break
      default:
        message = 'Sorry, there was an error'
      }

      this.$toaster(message, 'danger')
    },
  },
}
