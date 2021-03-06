


export default {
  PAWN_ARRIVE_BOTTOM:1,   // 兵到了对方的底线
  KILL_LEFT_TW0_JUMP_PAWN:21,   // 吃左边进2步的过路兵
  KILL_RIGHT_TW0_JUMP_PAWN:22,   // 吃右边进2步的过路兵
  KING_ROOK_SHORT_SWAP:31, // 短易位
  KING_ROOK_LONG_SWAP: 32, // 长易位
  chessMan: {
    1: '♖',
    2: '♘',
    3: '♗',
    4: '♔',
    5: '♕',
    6: '♙'
  },
  // 每兵第一次进2格的记录
  jumpTwoRecord:{
  },
  // 王车易位的记录
  kingRookSwap:{
    '-4':0,
    '-11':0,
    '-12':0,
    '4':0,
    '11':0,
    '12':0
  },
  init(){
    for(let i = 1;i <= 8;i++){
      this.jumpTwoRecord[60 + i] = 0;
      this.jumpTwoRecord[-(60 + i)] = 0;
    }
  },
  canMove(chessArr, x0, y0, x1, y1) {
    const { abs } = Math;

    const chessManType = this.chessMan[parseInt(abs(chessArr[y0][x0]) % 100 / 10) === 6 ? 6 : parseInt(abs(chessArr[y0][x0]) % 100 / 10) === 1 ? 1 : abs(chessArr[y0][x0])];
    if (chessManType === '♙') {

      // 兵一次向前最多走2步
      if (abs(y1 - y0) > 2) {
        return false;
      }

      // 兵往左右两方偏移不超过一步
      if (abs(x1 - x0) > 1) {
        return false;
      }

      // 兵不能水平移动
      if (y0 - y1 === 0) {
        return false;
      }

      // 兵不能退后 
      if (y1 - y0 > 0) {
        return false;
      }

      // 兵不能直行吃子
      if(x0 === x1 && chessArr[y1][x1] !== 0){
        return false;
      }

      // 兵进2步
      if (abs(y1 - y0) === 2) {
        // 中间有棋子挡住
        if (chessArr[y0 - 1][x0] !== 0) {
          return false;
        }

        // 同一个兵一次只能走一次2步
        if(this.jumpTwoRecord[chessArr[y0][x0]] === 1){
          return false;
        }
      }

      // 前方斜走不可超过 sqrt(2)
      const { pow, sqrt } = Math;
      const distance = sqrt(pow(x0 - x1, 2) + pow(y0 - y1, 2))
      if (x1 - x0 != 0 && distance > sqrt(2)) {
        return false;
      }

      // 斜着走不可落在空格上 
      if (distance === sqrt(2)) {
        
        // 相邻对方的兵进2步 右相邻 可以斜进吃 过路兵()
        if(x0 + 1 <= 7 && abs(chessArr[y0][x0 + 1]) > 10 && this.jumpTwoRecord[chessArr[y0][x0 + 1]] === 1){
          if(x1 - x0 < 0){// 如果向左斜走一步不可以
            return false;
          }
          return this.KILL_RIGHT_TW0_JUMP_PAWN;
        } else if(x0 - 1 >=0 && abs(chessArr[y0][x0 - 1]) > 10 && this.jumpTwoRecord[chessArr[y0][x0 - 1]] === 1){
          if(x1 - x0 > 0){// 如果向右边斜走一步不可以
            return false;
          }
          return this.KILL_LEFT_TW0_JUMP_PAWN;
        } else {
          if(chessArr[y1][x1] === 0)
            return false;
        }
      }

      // 兵第一次走过后 进2步的机会就没有了
      if(this.jumpTwoRecord[chessArr[y0][x0]] === 0)
        this.jumpTwoRecord[chessArr[y0][x0]] = 1
      // 兵升变
      if(y1 === 0){
        return this.PAWN_ARRIVE_BOTTOM
      }
    }
    if (chessManType === '♖') {
      // [0 7] 收集车的走线,再判断障碍
      let coordiates = []
      for (let c = 0; c <= 7; c++) {
        if(y0 !== c){
          coordiates.push({x:x0, y:c})
        }
        if(x0 != c){
          coordiates.push({x:c, y:y0})
        }
      }

      // 落子点必须在路线列表中
      const p = coordiates.find(({x,y}) => x === x1 && y === y1)
      if(p === undefined)
        return false;
      
      // 车到给定点中间不能有子
      if(x0 === x1){// y 轴移动 
        const middles = coordiates.filter(({x, y}) => x === x0 && ((y > y0 && y < y1) || (y > y1 && y < y0)))
        const chessMan = middles.find(({x,y}) => chessArr[y][x] !== 0)
        if(chessMan){// 中间有子
          return false;
        }
      }

      if(y0 === y1){// x 轴移动 
        const middles = coordiates.filter(({x, y}) => y === y0 && ((x > x0 && x < x1) || (x > x1 && x < x0)))
        const chessMan = middles.find(({x,y}) => chessArr[y][x] !== 0)
        if(chessMan){// 中间有子
          return false;
        }
      }

      if(this.kingRookSwap[chessArr[y0][x0]] === 0)
        this.kingRookSwap[chessArr[y0][x0]] = 1
    }

    if (chessManType === '♘') {
      let coordiates = []
      coordiates.push({x: x0 + 1, y: y0 + 2})
      coordiates.push({x: x0 + 1, y: y0 - 2})
      coordiates.push({x: x0 - 1, y: y0 + 2})
      coordiates.push({x: x0 - 1, y: y0 - 2})
      coordiates.push({y: y0 + 1, x: x0 + 2})
      coordiates.push({y: y0 + 1, x: x0 - 2})
      coordiates.push({y: y0 - 1, x: x0 + 2})
      coordiates.push({y: y0 - 1, x: x0 - 2})
      const p = coordiates.find(({x, y}) => x1 === x && y1 === y)
      if(p === undefined){// 马跳的点必须在列表中
        return false
      }
    }

    if (chessManType === '♗') {
      let coordiates = []
      let x,y;
      let direction = 1;
      let delta = 1;

      while(direction <= 4){
        switch (direction) {
          case 1://左上角
            x = x0 - delta
            y = y0 - delta
            delta += 1
            if(x >= 0 && y >= 0){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
          break;
          case 2://右下角
            x = x0 + delta
            y = y0 + delta
            delta += 1
            if(x <= 7 && y <= 7){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
            break;
          case 3://右上角
            x = x0 + delta
            y = y0 - delta
            delta += 1
            if(x <= 7 && y >= 0){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
            break;
          default://左下角
            x = x0 - delta
            y = y0 + delta
            delta += 1
            if(x >= 0 && y <= 7){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
            break;
        }
      }

      direction = 1

      const p = coordiates.find(({x, y}) => x === x1 && y === y1)
      if(p === undefined){
        return false;
      }

      // 先判断方向
      if(x1 > x0 && y1 < y0){// 右上角 3
        direction = 3
      } else if(x1 > x0 && y1 > y0){// 右下角 2
        direction = 2
      } else if(x1 < x0 && y1 < y0){// 左上角 1
        direction = 1
      } else if(x1 < x0 && y1 > y0){// 左下角 4
        direction = 4
      }

      const middles = coordiates.filter(({x,y}) => {
        if(direction === 1){
          return (x < x0 && y < y0) && (x > x1 && y > y1)
        } else if (direction === 2){
          return (x > x0 && y > y0) && (x < x1 && y < y1)
        } else if (direction === 3){
          return (x > x0 && y < y0) && (x < x1 && y > y1)
        } else {
          return (x < x0 && y > y0) && (x > x1 && y < y1)
        }
        return false
      })

      let chessMan =  middles.find(({x,y}) => chessArr[y][x] !== 0)

      if(chessMan){// 中间有子
        return false;
      }

    }

    if (chessManType === '♔') {
      // 王车易位
      if (y0 === 7 && y0 === y1 && abs(x1 - x0) === 2) {
        
        // 同一个王一次只能易位一次
        if(this.kingRookSwap[chessArr[y0][x0]] === 1 
          || this.kingRookSwap['-11'] === 1 
          || this.kingRookSwap['11'] === 1 
          || this.kingRookSwap['-12']  === 1
          || this.kingRookSwap['12']  === 1
          ){
          return false;
        }

        if(x1 - x0 === -2){// 左边
          // 王和车之间的格子
          let middles = [{x:1,y:7}, {x:2,y:7}];

          //王和车之间不能有子
          if(middles.some(({x,y}) => chessArr[y][x] !== 0)){
            return false;
          }

          //TODO 王和车之间不能被对方的 车 马 相 王 后 兵 照将

          this.kingRookSwap[chessArr[y0][x0]] = 1
          return this.KING_ROOK_SHORT_SWAP;
        }

        if(x1 - x0 === 2){// 右边
          let middles = [
            {x:4,y:7},
            {x:5,y:7},
            {x:6,y:7}
          ]
          //王和车之间不能有子
          if(middles.some(({x,y}) => chessArr[y][x] !== 0)){
            return false;
          }
          //TODO 王和车之间不能被对方的 车 马 相 王 后 兵 照将

          this.kingRookSwap[chessArr[y0][x0]] = 1
          return this.KING_ROOK_LONG_SWAP;
        }
      } else {
        let coordiates = []
        coordiates.push({x: x0 + 1, y: y0 + 1})
        coordiates.push({x: x0 + 1, y: y0 - 1})
        coordiates.push({x: x0 + 1, y: y0})

        coordiates.push({x: x0 - 1, y: y0 + 1})
        coordiates.push({x: x0 - 1, y: y0 - 1})
        coordiates.push({x: x0 - 1, y: y0})

        coordiates.push({y: y0 + 1, x:x0})
        coordiates.push({y: y0 - 1, x:x0})
        const p = coordiates.find(({x, y}) => x1 === x && y1 === y)
        if(p === undefined){
          return false
        }
      }

      // 王动了一次 就没有王车易位的机会
      if(this.kingRookSwap[chessArr[y0][x0]] === 0)
        this.kingRookSwap[chessArr[y0][x0]] = 1
    }

    if (chessManType === '♕') {
      let coordiates = []
      for (let c = 0; c <= 7; c++) {
        if(y0 !== c){
          coordiates.push({x:x0, y:c})
        }
        if(x0 != c){
          coordiates.push({x:c, y:y0})
        }
      }

      //////
      let x,y;
      let direction = 1;
      let delta = 1;

      while(direction <= 4){
        switch (direction) {
          case 1://左上角
            x = x0 - delta
            y = y0 - delta
            delta += 1
            if(x >= 0 && y >= 0){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
          break;
          case 2://右下角
            x = x0 + delta
            y = y0 + delta
            delta += 1
            if(x <= 7 && y <= 7){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
            break;
          case 3://右上角
            x = x0 + delta
            y = y0 - delta
            delta += 1
            if(x <= 7 && y >= 0){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
            break;
          default://左下角
            x = x0 - delta
            y = y0 + delta
            delta += 1
            if(x >= 0 && y <= 7){
              coordiates.push({x,y})
            } else {
              direction += 1
              delta = 1
            }
            break;
        }
      }

      direction = 1

      ///////
      const p = coordiates.find(({x,y}) => x === x1 && y === y1)
      if(p === undefined)
        return false;

      // 先判断方向
      if(x1 > x0 && y1 < y0){// 右上角 3
        direction = 3
      } else if(x1 > x0 && y1 > y0){// 右下角 2
        direction = 2
      } else if(x1 < x0 && y1 < y0){// 左上角 1
        direction = 1
      } else if(x1 < x0 && y1 > y0){// 左下角 4
        direction = 4
      }

      const middles1 = coordiates.filter(({x,y}) => {
        if(direction === 1){
          return (x < x0 && y < y0) && (x > x1 && y > y1)
        } else if (direction === 2){
          return (x > x0 && y > y0) && (x < x1 && y < y1)
        } else if (direction === 3){
          return (x > x0 && y < y0) && (x < x1 && y > y1)
        } else {
          return (x < x0 && y > y0) && (x > x1 && y < y1)
        }
        return false
      })

      let chessMan1 =  middles1.find(({x,y}) => chessArr[y][x] !== 0)

      if(chessMan1){// 中间有子
        return false;
      }
      
      
      // 车到给定点中间不能有子
      if(x0 === x1){// y 轴移动 
        const middles = coordiates.filter(({x, y}) => x === x0 && ((y > y0 && y < y1) || (y > y1 && y < y0)))
        const chessMan = middles.find(({x,y}) => chessArr[y][x] !== 0)
        if(chessMan){// 中间有子
          return false;
        }
      }

      if(y0 === y1){// x 轴移动 
        const middles = coordiates.filter(({x, y}) => y === y0 && ((x > x0 && x < x1) || (x > x1 && x < x0)))
        const chessMan = middles.find(({x,y}) => chessArr[y][x] !== 0)
        if(chessMan){// 中间有子
          return false;
        }
      }

    }

    return true;
  },
  check(x,y){

    ['♖','♘','♗','♔','♕','♙'].forEach(item => {
      // 除了兵以外 都可以得到给定点角色的行走坐标集合
      // 遍历给定点反查询对应角色是否存在,若存在得到对应坐标
      // 通过给定坐标 和 存在角色坐标 判断是否具有可达行
      // 若可达则 形成一次照将 循环结束
    })
  }

}