<template>
  <div id="app">
    <div id="board"  ref='board' @click="move">
      <div class="row" v-for="(_, row) in chessArr" :key="row">
        <div tabindex="0" class="cell" v-for="(item, index) in chessArr[row]" :key="index">
          <div v-if="chessArr[index][row] !== 0" :ref="`${index}-${row}`" :class="[{chessman:true},chessArr[index][row] > 0 ? 'white' : 'black']">
            {{parseInt(Math.abs(chessArr[index][row]) % 100 / 10) === 6 ? chessMan[6] : parseInt(Math.abs(chessArr[index][row]) % 100 / 10) === 1 ? chessMan[1] : chessMan[Math.abs(chessArr[index][row])]}}
          </div>
        </div>
      </div>

    </div>

    <!-- <audio autoplay>
      <source src="../assets/1.wav"/>
    </audio> -->
    <control-bar :status='status' :role="user.role" :turn='turn' @playWith='playWith'></control-bar>
    <upgrade-picker v-if="showPicker" :role="user.role" @change='pickerChange'></upgrade-picker>
  </div>
</template>

<script>

import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

import logic from '../logic/index'
import UpgradePicker from './UpgradePicker';
import ControlBar from './ControlBar';

Vue.use(new VueSocketIO({
  connection: 'http://localhost:3000',
}))

export default {
  components:{
    UpgradePicker,
    ControlBar
  },
  data(){
    return {
      user:{
        userId:-1,
        role: 1,        // 1 表示是白方 棋子为正 -1 表示黑方一方棋子为负 (后端分配)
        toId:-1
      },
      status:0, // 0 未开始 1 开始
      chessMan:logic.chessMan,
      chessArr: [
        // heart
        // [0,0,0,0,0,0,0,0],
        // [0,0,0,0,0,0,0,0],
        // [0,5,0,0,0,5,0,0],
        // [5,0,5,0,5,0,5,0],
        // [0,5,0,5,0,5,0,0],
        // [0,0,5,0,5,0,0,0],
        // [0,0,0,5,0,0,0,0],
        // [0,0,0,0,0,0,0,0],
        
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
        
      ],
      cellSize:60,    // 单元格大小
      point:{         // 第一次选子的棋盘坐标
        x:-1,
        y:-1
      },
      movedPoint:{   // 棋子走后的坐标
        x:-1,
        y:-1
      },
      cell:null,      // 选择的棋子node
      step:0,         // 选子到落子的步数
      turn:1,         // 1 表示 白走 -1 表示黑走
      showPicker:false // 兵升变弹层显示
    }
  },

  sockets: {

    connect: function () {
      console.log('socket connected')
    },

    from(data) {
      const {userId, role, status} = data
      this.user.role = role;
      this.user.toId = userId;
      this.status = status;
      if(this.user.role === -1){
        this.chessArr = [
          [11, 2, 3, 4, 5, 3, 2, 12],
          [61, 62, 63, 64, 65, 66, 67, 68],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [-61, -62, -63, -64, -65, -66, -67, -68],
          [-11, -2, -3, -4, -5, -3, -2, -12]
        ]
    } else {
      this.chessArr = [
        [-11, -2, -3, -4, -5, -3, -2, -12],
        [-61, -62, -63, -64, -65, -66, -67, -68],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [61, 62, 63, 64, 65, 66, 67, 68],
        [11, 2, 3, 4, 5, 3, 2, 12]
      ]
      }
    },

    move(data){
      const { turn, point, movedPoint } = data;
      const x1 = movedPoint.x;
      const y1 = movedPoint.y;
      const x0 = point.x;
      const y0 = point.y;

      console.log(this.chessArr)

      this.turn = turn;
      const cell = (this.$refs[`${7 - y0}-${x0}`][0]);
      if(cell)
        cell.display = 'none';

      
      if(cell)
        cell.style.transform += ` translate(${(x1 - x0) * this.cellSize}px,${(y0 - y1) * this.cellSize}px)`
   
      // this.chessArr[7 - y1][x1] = this.chessArr[7 - y0][x0]
      // this.chessArr[7 - y0][x0] = 0;
      // this.$set(this.chessArr[7 - y1], x1, this.chessArr[7 - y0][x0])
      // this.$set(this.chessArr[7 - y0], x0, 0)

   }
  },

  mounted(){
    logic.init()
     this.user.userId =  "u:" + Date.now()
     this.$socket.emit('registry',this.user)
  },

  methods:{

    playWith(){
      this.$socket.emit('playWith',this.user)
    },

    pickerChange(code){
      this.showPicker = false;
      // 修改数组
      const { x , y } = this.movedPoint;
      this.chessArr[y][x] = code;
    },

    move(e){// 我方移动棋子
      this.status = 1;
      // 这个判断在网络版再加上
      if(this.turn !== this.user.role){// 不该你走
        return;
      }

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

      // 落子在自己的子上
      if(this.user.role  * this.chessArr[iy][ix] > 0){// 落子在自己的子上
        return;
      }

      // 有效落子的判断
      const canMove = logic.canMove(this.chessArr,this.point.x,this.point.y,ix,iy)
      if(!canMove){
        return;
      }

      this.movedPoint = {
        x:ix,
        y:iy
      }

      if(canMove === logic.KILL_LEFT_TW0_JUMP_PAWN){
        (this.$refs[`${this.point.y + 2}-${this.point.x - 1}`][0]).style.display = 'none'
      }

      if(canMove === logic.KILL_RIGHT_TW0_JUMP_PAWN){
        (this.$refs[`${this.point.y + 2}-${this.point.x + 1}`][0]).style.display = 'none'
      }

      if(canMove === logic.KING_ROOK_SHORT_SWAP){
        const rookX = this.point.x - 3;
        const rookY = this.point.y;

        // 播放车动画
        (this.$refs[`${rookY}-${rookX}`][0]).style.transform += ` translateX(${2*this.cellSize}px)`
      
        // 改变数组
        this.chessArr[iy][ix] = 0;
        this.chessArr[rookY][rookX] = 0;

        this.chessArr[this.point.y][this.point.x] = 4;
        this.chessArr[this.point.y][this.point.x - 1] = 11;
      }

      if(canMove === logic.KING_ROOK_LONG_SWAP){
        const rookX = this.point.x + 4;
        const rookY = this.point.y;

        // 播放车动画
        (this.$refs[`${rookY}-${rookX}`][0]).style.transform += ` translateX(${-3*this.cellSize}px)`
      
        // 改变数组
        // 原来王的位置
        this.chessArr[iy][ix] = 0;
        // 原来车的位置
        this.chessArr[rookY][rookX] = 0;
        // 现在
        this.chessArr[this.point.y][this.point.x] = 4;
        this.chessArr[this.point.y][this.point.x + 1] = 12;
      }

      // 兵升变
      if(canMove === logic.PAWN_ARRIVE_BOTTOM){
        this.showPicker = true;
      }

      // 普通走法 落在对方棋子上,则吃子
      if(this.chessArr[iy][ix] !== 0 && canMove !== logic.PAWN_ARRIVE_BOTTOM)
        e.target.style.display = 'none'

      // 普通行走移动动画
      this.cell.style.transform += ` translate(${(ix - this.point.x) * this.cellSize}px,${(iy - this.point.y) * this.cellSize}px)`
    
      // 普通走法修改数组
      // this.chessArr[iy][ix] = this.chessArr[this.point.y][this.point.x];
      // this.chessArr[this.point.y][this.point.x] = 0;
      this.$set(this.chessArr[iy], ix, this.chessArr[this.point.y][this.point.x])
      this.$set(this.chessArr[this.point.y], [this.point.x], 0)
      // TODO 判断胜负和

      // 轮谁走

      this.turn = -this.turn;

      this.$socket.emit('move',{
        toId:this.user.toId,
        point: this.point,
        movedPoint: this.movedPoint,
        turn: this.turn,
        status: this.status
      })
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

@keyframes moveIn {
  from{
    opacity: 0;
    transform: rotateZ(0deg) scale(5);
  }
  to {
    transform: rotateZ(360deg) scale(1);
    opacity: 1;
  }
}

#board {  
  animation: moveIn .8s ease 0s 1 normal forwards;
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
  text-align: center;
  cursor:default;
  user-select: none;
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

