# chess

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

``` javascript 
// 用这个来调试vue
vm.$root.$children[0].$children[0].role = -1
```


### 需要改进的地方

#### - 1. 视图打印数组和逻辑数组分开,这样就不会造成绑定数组修造成动画无法完成的问题
#### - 2. 选子可以统一返回一个可走的所有点的集合,走子点如果在集合里就可以走.设想如下:
```javascript
  //返回的结构
  return {
    canMovePoints:[]
  }
```
#### - 3. 落子坐标点的设想:
```javascript
  let point = {
    x:0,
    y:0,
    type:1//普通落子点 吃子落子点 长易位点 短易位点 左吃敌方二进兵点 右吃敌方二进兵点 兵升变点
  }
```

#### - 4. 根据以上3点.可以在落子后,通过判断点type.决定如何修改数组.同时也可以指导视图逻辑

#### - 5. 车点扫描线算法可以和后,相统一类似.

#### - 6. 照将点逻辑 和 胜负逻辑待续