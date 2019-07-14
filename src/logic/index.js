
export default {
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
  init(){
    for(let i = 1;i <= 8;i++){
      this.jumpTwoRecord[60 + i] = 0;
      this.jumpTwoRecord[-(60 + i)] = 0;
    }
  },
  canMove(chessArr, x0, y0, x1, y1) {
    const { abs } = Math;

    const chessManType = this.chessMan[abs(chessArr[y0][x0]) > 10 ? 6 : abs(chessArr[y0][x0])];
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
      if (distance === sqrt(2) && chessArr[y1][x1] === 0) {
        return false;
      }

      // 兵第一次走过后 进2步的机会就没有了
      if(this.jumpTwoRecord[chessArr[y0][x0]] === 0)
        this.jumpTwoRecord[chessArr[y0][x0]] = 1
    }
    if (chessManType === '♖') {
      // [0 7] 收集车的走线,再判断障碍
      let coordiates = []
      for (let c = 0; c <= 7; c++) {
        if(y0 !== c){
          coordiates = [...coordiates, {x:x0, y:c}]
        }
        if(x0 != c){
          coordiates = [...coordiates, {x:c, y:y0}]
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

    }

    if (chessManType === '♘') {
      let coordiates = []
      coordiates = [... coordiates, {x: x0 + 1, y: y0 + 2}]
      coordiates = [... coordiates, {x: x0 + 1, y: y0 - 2}]
      coordiates = [... coordiates, {x: x0 - 1, y: y0 + 2}]
      coordiates = [... coordiates, {x: x0 - 1, y: y0 - 2}]
      coordiates = [... coordiates, {y: y0 + 1, x: y0 + 2}]
      coordiates = [... coordiates, {y: y0 + 1, x: x0 - 2}]
      coordiates = [... coordiates, {y: y0 - 1, x: x0 + 2}]
      coordiates = [... coordiates, {y: y0 - 1, x: x0 - 2}]
      const p = coordiates.find(({x, y}) => x1 === x && y1 === y)
      if(p === undefined){// 马跳的点必须在列表中
        return false
      }
    }

    if (chessManType === '♗') {

    }

    if (chessManType === '♔') {

    }

    if (chessManType === '♕') {

    }
    return true;
  }

}