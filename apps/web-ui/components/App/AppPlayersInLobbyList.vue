<template>
  <div>
    <p>{{ $t('players') + '(' + playersInLobby.length + '/4)' }} :</p>
    <ul>
      <li
        v-for="(player, idx) in activePlayers"
        :key="idx"
        :style="{ color: player.team }"
      >
        {{ player.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    playersInLobby: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    activePlayers() {
      return (this.playersInLobby || [])
        .filter((player) => player.name)
        .map((player) => ({
          name: player.name,
          team: parseInt(player.id) % 2 === 0 ? 'red' : 'blue',
        }));
    },
  },
};
</script>

<style>
</style>