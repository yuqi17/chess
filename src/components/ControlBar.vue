<template>
  <div id="control-bar">
      <button v-if="status === 0" @click="playWith">开始</button>
      <span v-if="status !== 0">轮到<span id="who">{{who}}</span>方走</span>
      <span v-else>白棋先走</span>
  </div>
</template>

<script>
export default {
  props:['status','turn','role'],
  data(){
    return {
    }
  },
  computed:{
    who(){
      return this.turn === this.role ? '你' : '对方'
    }
  },
  methods:{
    playWith(){
      this.$emit('playWith')
    }
  }
}
</script>


<style  scoped>
#control-bar{
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.3em 2em 0.4em rgba(0, 0, 0, 0.3);
}

#control-bar >  button{
  padding: 15px 30px;
  border: none;
  border: 2px solid  green;
  border-radius: 10px;
  letter-spacing: 3px;
  outline: none;
  font-size: 15px;
  margin-right: 10px;
}

#who{
  color: brown;
  padding: 0 5px;
}
</style>

