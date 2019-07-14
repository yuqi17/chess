
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

    const chessManType = this.chessMan[abs(chessArr[y0][x0]) > 10 ? 6 : chessArr[y0][x0]];
    if (chessManType === '♙') {
      // 兵一次向前最多走2步
      if (abs(y1 - y0) > 2) {
        return false;
      }

      // TODO 同一个兵一次只能走一次2步
      if(this.jumpTwoRecord[chessArr[y0][x0]] === 1){
        return;
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
        // 用掉了一次记录
        this.jumpTwoRecord[chessArr[y0][x0]] = 1
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

    }
    if (chessManType === '♖') {
      // [0 7] 收集车的走线,再判断障碍
      let coordiates = []
      for (let x = 0; x <= 7; x++) {
        // if(x0 + x < 8){
        //   // 从车到点的距离中间没有棋子挡住
        //   coordiates.push({
        //     x:x,
        //     y:y0
        //   })
        // }
        // if(x){
        //   coordiates.push({
        //     x:x0,
        //     y:y
        //   })
        // }
      }
    }

    if (chessManType === '♘') {

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