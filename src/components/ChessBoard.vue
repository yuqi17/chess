<template>
  <div id="app">
    <div id="board"  ref='board' @click="move">
      <div class="row" v-for="(_, row) in chessArr" :key="row">
        <div class="cell" v-for="(item, index) in chessArr[row]" :key="index">
          <div :class="[{chessman:true},chessArr[index][row] > 0 ? 'white' : 'black']">{{chessMan[Math.abs(chessArr[index][row])]}}</div>
        </div>
      </div>
    </div>
    <!-- <audio autoplay>
      <source src="../assets/1.wav"/>
    </audio> -->
  </div>
</template>

<script>
import logic from '../logic/index'

export default {
  data(){
    return {
      chessMan:logic.chessMan,
      chessArr: [
        [1, 2, 3, 4, 5, 3, 2, 1],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [-6, -6, -6, -6, -6, -6, -6, -6],
        [-1, -2, -3, -4, -5, -3, -2, -1]
      ],
      cellSize:60,    // 单元格大小
      point:{         // 第一次选子的棋盘坐标
        x:-1,
        y:-1
      },
      role: 1,        // 1 表示是白方 棋子为正 -1 表示黑方一方棋子为负 (后端分配)
      cell:null,      // 选择的棋子node
      step:0,         // 选子到落子的步数
      turn:1,         // 1 表示 白走
      kingRookTimes:1 // 每方有一次王车易位的机会
    }
  },
  mounted(){
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

    move(e){// 我方移动棋子

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

      this.step = 0; // 落子完毕,不管是否是有效落子

      // 这个判断也网络版再加上
      // if(this.role  * this.chessArr[iy][ix] > 0){// 落子在自己的子上
      //   return;
      // }

      // 有效落子的判断
      const canMove = logic.canMove(this.chessArr,this.point.x,this.point.y,ix,iy)
      if(!canMove){
        return;
      }

      // 修改数组
      this.chessArr[iy][ix] = this.chessArr[this.point.y][this.point.x];
      this.chessArr[this.point.y][this.point.x] = 0;

      // 落子的格子里有对方棋子 消失掉这个棋子节点
      e.target.style.display = 'none'

      // 棋子移动动画
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

