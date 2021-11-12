import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载路由
// const Home = () => import( /* webpackChunkName: "data-views" */ "views/Home")
// const SellerPage = () => import( /* webpackChunkName: "data-views" */ "views/SellerPage")
// const TrendPage = () => import( /* webpackChunkName: "data-views" */ "views/TrendPage")
// const MapPage = () => import( /* webpackChunkName: "data-views" */ "views/MapPage")
// const RankPage = () => import( /* webpackChunkName: "data-views" */ "views/RankPage")
// const HotPage = () => import( /* webpackChunkName: "data-views" */ "views/HotPage")
// const StockPage = () => import( /* webpackChunkName: "data-views" */ "views/StockPage")

// 普通方式

import PassPage from 'views/PassPage'
import DayPage from 'views/DayPage'
import AirPage from 'views/AirPage'
import PowerPage from 'views/PowerPage'
import EleconPage from 'views/EleconPage'
import DevPage from 'views/DevPage'
import EnvPage from 'views/EnvPage'
import RecordPage from 'views/RecordPage'
import ProdPage from 'views/ProdPage'
import CameraPage from 'views/CameraPage'
import Day3D from 'views/Day3DPage'
import TJHomeScss from 'views/TJHomeScss'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/tjhomes'
  },
  {
    path: '/tjhomes',
    component: TJHomeScss
  },
  {
    path: '/camerapage',
    component: CameraPage
  },
  {
    path: '/day3dpage',
    component: Day3D
  },
  {
    path: '/prodpage',
    component:ProdPage
  },
  {
    path: '/recordpage',
    component: RecordPage
  },
  {
    path:'/devpage',
    component: DevPage
  },
  {
    path: '/envpage',
    component: EnvPage
  },
  {
    path: '/powerpage',
    component: PowerPage
  },
  {
    path: '/eleconpage',
    component: EleconPage,
  },
  {
    path: '/airpage',
    component: AirPage
  },
  {
    path: '/passpage',
    component: PassPage
  },
  {
    path: '/daypage',
    component: DayPage
  },
]

const router = new VueRouter({
  routes
})

export default router