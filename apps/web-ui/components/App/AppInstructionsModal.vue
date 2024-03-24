<template>
  <div>
    <b-modal id="modal-instructions" :title="$t('welcome')" style="color:black" busy>
      <p class="my-4">
        <ol>
          <li>
            {{ $t('player_message') }}
          </li>
          <li>
            {{ $t('inst_1') }}
          </li>
          <li>
            {{ $t('inst_2') }}
          </li>
        </ol>
      </p>
      <slot name="modal-footer" />
      <template #modal-footer>
        <br>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  computed: {
    ...mapGetters(['matchUrl']),
    ...mapState(['playerId', 'currentPlayerId']),
  },
};
</script>

<style scoped>
li {
  margin: 30px 0;
}
</style>
