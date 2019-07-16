<template>
  <div id="container">
    <div class="picker">
        <div :class="[{chessman:true}, role === 1 ? 'white' : 'black']" 
        v-for="(code, index) in chessArr" 
        :key="index"
        @click="picker(code)"
        >{{chessMan[code]}}</div>
    </div>
  </div>
</template>

<script>

import logic from '../logic/index';

export default {
  props:['role'],
  data(){
    return {
      chessMan:logic.chessMan,
      chessArr:[1,2,3,5]
    }
  },
  methods:{
    picker(code){
      this.$emit('change',code * this.role)
    }
  }
}
</script>

<style scoped>

#container{
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(#000,.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.picker{
  width: 240px;
  background: #ccc;
  display: flex;
  padding: 2px;
}

.chessman{
  width: 60px;
  height: 60px;
  line-height: 60px;
  margin: 0 1px;
  background: rgb(102, 93, 93);
  font-size: 40px;
  cursor: pointer;
}

.white{
  color: #fff;
}

.black{
  color: #000;
}

</style>


