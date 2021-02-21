<template>
  <div class="tiles">
      <draggable
        :list="tiles"
        item-key="id"
      >
        <template #item={element}>
            <domino 
                :tile="element.pips" 
                :vertical="true" 
                @click="selectTile(element.id)"
                :class="{'tile--selected':element.isSelected}"
            />
        </template>
      </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Domino from './Domino.vue'
export default {
    components:{
        draggable,
        Domino
    },
    data(){
        return {
            tiles:[
                {
                    id:1,
                    pips:[1,2],
                    isSelected: false
                },
                {
                    id:2,
                    pips:[1,3] ,
                    isSelected:false
                },
                {
                    id:3,
                    pips:[1,4] ,
                    isSelected:false
                },
            ],
        }
    },
    methods:{
        selectTile(id){
            const tile = this.tiles.find( tile => tile.id === id)
            tile.isSelected = true
            this.tiles.forEach( tile => {
                if(tile.id !== id)
                    tile.isSelected = false
            })
        },
        unselectTile(id){
            const tile = this.tiles.find( tile => tile.id === id)
            tile.isSelected = false
        },
    }

}
</script>

<style scoped>
.tiles{
    display: flex;
    width: 100%;
}
.tiles div {
    display: flex;
}
.tile--selected{
    transform: translateY(-20px);
}
</style>