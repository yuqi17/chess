import Vue from 'vue'
import Router from 'vue-router'
import ChessBoard from '@/components/ChessBoard'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ChessBoard',
      component: ChessBoard
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    }
  ]
})
