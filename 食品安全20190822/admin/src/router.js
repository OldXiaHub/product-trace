import Vue from 'vue'
import Router from 'vue-router'

import AdminLogin from './views/AdminLogin.vue'
// import First from './components/admin/First.vue'


import Sign from './components/food/Sign.vue'
import Home from './views/Home.vue'
import Complaint from './components/complaint/Complaint.vue'
import LogisticsManage from './components/food/LogisticsManage.vue'
import SearchFood from './components/food/SearchFood.vue'
import Factory from './components/factory/Factory.vue'
import News from './components/news/News.vue'
import Addnews from './components/news/Addnews.vue'
import SendFood from './components/food/SendFood.vue'
import Admininfo from './components/factory/Admininfo.vue'
import MapComponent from './components/food/MapComponent.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      children:[
        {
          path:'/home/admininfo',
          name:'admininfo',
          component:Admininfo
        },
        {
          path:'/home/complaint',
          name:'complaint',
          component:Complaint
        },{
          path:'/home/factory',
          name:'factory',
          component:Factory
        },
        {
          path:'/home/news',
          name:'news',
          component:News
        },
        {
          path:'/home/addnews',
          name:'addnews',
          component:Addnews
        },
        
        {
          path:'/home/searchFood',
          name:'searchFood',
          component: SearchFood
        },
        {
          path:'/home/sendFood',
          name:'sendFood',
          component: SendFood
        },
        {
          path:'/home/mapcomponent',
          name:'mapcomponent',
          component: MapComponent
        },
        {
          path:'/home/logisticsmanage',
          name:'logisticsmanage',
          component: LogisticsManage
        },
        {
          path:'/home/sign',
          name:'sign',
          component:Sign
        }
        
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/',
      name: 'adminlogin',
      component: AdminLogin
    },
    
  ]
})
