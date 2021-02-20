<template>
  <div 
    class="domino"
    :class="{
            'domino--vertical':isMule || vertical
        }"
    >
      <img 
        class="domino-img" 
        :src="`/${imageFilePath}.svg`" 
        alt=""
        :class="{ 
            'domino-img--inversed':isInversed && !vertical,
            'domino-img--vertical':isMule || vertical
            } "
        >
  </div>
</template>

<script>
export default {
    props: {
        tile:{
            type: Array,
            required:true
        },
        vertical: {
            type: Boolean,
            default: () => false
        }
    },
    computed:{
        imageFilePath(){
            if(this.tile[0] === this.tile[1])
                return this.tile[0]

            return [...this.tile].sort().join('-')
        },
        isInversed(){
            return this.tile[0] > this.tile[1]
        },
        isMule(){
            return this.tile[0] === this.tile[1]
        }
    }

}
</script>

<style scoped>
.domino{
    --dominoW:130px;
    --dominoH:64px;
    width: var(--dominoW);
    height:var(--dominoH);
    position:relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:20px 0px;
}
.domino--vertical{
    width:var(--dominoH);
    height:var(--dominoW);
}
.domino-img{
    width: var(--dominoH);
    height: var(--dominoW);
    transform-origin: center;
    transform: rotate(-90deg);
}
.domino-img--vertical{
    transform: unset;
}
.domino-img--inversed{
    transform: rotate(90deg);
}

</style>