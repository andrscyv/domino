<template>
  <div class="player-info" :class="{'player-info--active':isNextToPlay}">
      <span> {{name}}: {{tiles}}</span>
  </div>
</template>

<script>
export default {
    props:['name', 'tiles', 'isNextToPlay']

}
</script>

<style scoped>
.player-info{
    color:white;

}
.player-info--active{
    color:red
}

</style>