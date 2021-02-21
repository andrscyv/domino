<template>
  <div>
    <div class="game">
      <domino
        v-for="(tile,idx) in tilesPlayed"
        :key="idx"
        :tile="tile"
        :isHighlighted="idx===27"
      />
    </div>
  </div>
</template>

<script>
import Domino from './Domino.vue'
export default {
  components:{
    Domino
  },
  data () {
    return {
    }
  },
  computed: {
    tilesPlayed () {
      const tiles = []
      for (let i = 0; i < 7; i++) {
        for( let k = i; k < 7; k++)
          tiles.push([i, k])
      }
      return tiles
    },
  }

}
</script>

<style scoped>
.game{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
</style>
