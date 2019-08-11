<template lang="pug">
  v-flex(mb-5 v-if="existsAddress" v-bind:id="navTargetId")
    v-card
      v-card-title
        span.title Current Linked Public Key
      v-card-text
        p(v-if="linkedAccountKey === null")
        p(v-else).ellipsis {{ linkedAccountKey }}
      v-card-actions
        v-btn(
          @click="reload"
          :disabled="isLoading")
          v-icon cached
        v-progress-circular(indeterminate v-if="isLoading").ml-3
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountLinkInfo',
  props: {
    navTargetId: {
      type: String,
      default () {
        return 'accountLinkInfo'
      }
    }
  },
  data () {
    return {
      isLoading: null
    }
  },
  computed: {
    ...mapGetters('wallet', [
      'existsAddress'
    ]),
    ...mapGetters('accountLink', [
      'linkedAccountKey'
    ])
  },
  methods: {
    async reload (event) {
      this.isLoading = true
      await this.$store.dispatch('accountLink/update')
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
