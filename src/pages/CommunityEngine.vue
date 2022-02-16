<template>
  <div
    id="community-engine"
    class=""
  >
    <section
      name="introduction"
    >
      <h1>The Community Engine</h1>
      <p>
        The Community Engine platform allows you to connect with others like never before!
      </p>
    </section>

    <section name="community-engine-info">
      <h3>Platform Information</h3>
      Current Version {{ version }}
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CommunityEngine',
  computed: {
    ...mapGetters('CommunityEngine', ['version']),
  },
}
</script>

<style scoped lang="scss">
  h2 {
    margin-bottom: 1.5rem;
  }
</style>
