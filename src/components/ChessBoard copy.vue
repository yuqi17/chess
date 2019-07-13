<template>
  <div id="app">
    <div id="board"  ref='board' @click="move">
      <div class="row" v-for="(_, row) in chessArr" :key="row">
        <div class="cell" v-for="(item, index) in chessArr[row]" :key="index">
          <div :class="[{chessman:true},chessArr[index][row] > 0 ? 'white' : 'black']" v-if="index === 0 || index === 1 || index === 6 || index === 7">{{chessMan[Math.abs(chessArr[index][row])]}}</div>
        </div>
      </div>
    </div>
    <!-- <audio autoplay>
      <source src="../assets/1.wav"/>
    </audio> -->
  </div>
</template>

<script>

export default {
  data(){
    return {
      chessMan:{
        1:'♖',
        2:'♘',
        3:'♗',
        4:'♔',
        5:'♕',
        6:'♙'
      },
      chessArr:[
        [1,2,3,4,5,3,2,1],
        [6,6,6,6,6,6,6,6],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [-6,-6,-6,-6,-6,-6,-6,-6],
        [-1,-2,-3,-4,-5,-3,-2,-1]
      ],
      cellSize:60,
      role: 1,// 1 表示是白方 棋子为正 -1 表示黑方一方棋子为负
      point:{
        x:-1,
        y:-1
      },
      cell:null,
      step:0,
      turn:1// 1 表示 白走
    }
  },
  mounted(){
    // 这一步应该是后台分配的
    // this.role  = [1,-1][Math.round(Math.random())]

    console.log('your:', this.role)
    if(this.role === -1){
      this.chessArr = [
          [-6,-6,-6,-6,-6,-6,-6,-6],
          [-1,-2,-3,-4,-5,-3,-2,-1],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0],
          [1,2,3,4,5,3,2,1],
          [6,6,6,6,6,6,6,6]
      ]
    }

  },
  methods:{
    move(e){
      // 这个判断在网络版再加上
      // if(this.turn !== this.role){// 不该你走
      //   return;
      // }

      const left = this.$refs['board'].offsetLeft;
      const top = this.$refs['board'].offsetTop;

      const ix = Math.floor((e.clientX - left) / this.cellSize);
      const iy = Math.floor((e.clientY - top) / this.cellSize);

      if(this.step === 0 && this.chessArr[iy][ix] === 0){// 没选中一个子
        return;
      }

      this.step ++;

      if(this.step === 1){ // 选子操作结束
        this.cell = e.target;
        this.point.x = ix;
        this.point.y = iy;
        return;
      }

      console.log(this.chessMan[Math.abs(this.chessArr[this.point.y][this.point.x])])
      // 不同棋子的落子规则


      this.step = 0; // 落子完毕

      // 这个判断也网络版再加上
      // if(this.role  * this.chessArr[iy][ix] > 0){// 落子在自己的子上
      //   return;
      // }
      
      // 修改数组
      // this.chessArr[iy][ix] = 0;
      // this.$set(this.chessArr[iy],ix, 0)

      this.chessArr[iy][ix] = this.chessArr[this.point.y][this.point.x];
      this.chessArr[this.point.y][this.point.x] = 0;

      // 视图更新
      this.cell.style.transform += ` translate(${(ix - this.point.x) * this.cellSize}px,${(iy - this.point.y) * this.cellSize}px)`
    
      this.turn = -this.turn;
    }
  }

}
</script>

<style scoped>

#app{
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 520px;
}

#board {  
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 480px;
  height: 480px;

  border: 0.2em solid tan;
  background-color: burlywood;
  box-shadow: 0 0.3em 2em 0.4em rgba(0, 0, 0, 0.3);
}

.cell {
  width: 60px;
  height: 60px;
}

.chessman{
  font-size: 40px;
  transition: all .3s;
  height: 100%;
}

.white{
  color: #fff;
}

.black{
  color: #000;
}

#board .row:nth-child(odd) .cell:nth-child(even),
.row:nth-child(even) .cell:nth-child(odd) {
  background-color: rgba(0,0,0,.6);
}

/* #board .row:nth-child(odd) .cell:nth-child(odd),
    .row:nth-child(even) .cell:nth-child(even){
        background-color: red;
    } */
</style>

