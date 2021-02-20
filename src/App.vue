<template>
    <h1 class="title">
      Dominó.
    </h1>
    <game style="padding-bottom:200px"/>
    <score-board style="position:fixed;top:10px;right:20px"/>
    <player-tiles style="position:fixed;bottom:0;"/>
</template>

<script setup>
import Game from './components/Game.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import PlayerTiles from './components/PlayerTiles.vue'

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app{
  height: 100%;
  width:100%;
  position:relative;
}
html, body {
  background-color: black;
  height: 100%;
  width:100%;
}
.title{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    color: white;
    font-size: 30px;
    margin: 20px 10px
}
</style>