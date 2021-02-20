<template>
  <div class="tiles">
      <domino v-for="(tile,idx) in tiles" :key="idx" :vertical="true" :tile="tile"/>
  </div>
</template>

<script>
import Domino from './Domino.vue'
export default {
    components:{
        Domino
    },
    data(){
        return {
            tiles:[
                [1,3],
                [3,3],
                [2,5],
                [2,1],
            ]
        }
    }

}
</script>

<style scoped>
.tiles{
    display: flex;
    width: 100%;
}

</style>