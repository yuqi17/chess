import Vue from 'vue'
import Router from 'vue-router'
import ChessBoard from '@/components/ChessBoard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChessBoard',
      component: ChessBoard
    }
  ]
})
