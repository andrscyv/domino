<template>
  <div class="m-6 d-flex m-5 flex-column align-content-center">
    <p ref="container" class="text-center">
      {{ $t('link_message') }} <br />
      {{ matchUrl }}
    </p>
    <input
      type="button"
      :value="$t('clipboard')"
      style="margin: auto"
      @click="copy"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['matchUrl']),
  },
  methods: {
    copy() {
      const container = this.$refs.container;
      this.$copyText(this.matchUrl, container);
      alert('Link copied!');
    },
  },
};
</script>

<style>
</style>