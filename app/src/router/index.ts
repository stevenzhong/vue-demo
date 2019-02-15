import Vue from 'vue'
import Router from 'vue-router'
import state from '@/store/modules/user/state'
import { find } from 'lodash'

Vue.use(Router)

const Home = () => import('@/pages/home/index.vue')

interface Route {
  path: string
  name?: string
  component: any
  meta: Meta
  children?: CHildRoute[]
}

interface CHildRoute {
  path: string
  name: string
  component: any
  meta: Meta
  props?: (route: any) => any
}

interface Meta {
  title: string
  icon?: string
  permission?: boolean
  show?: boolean
  hidden?: boolean
}

const routes: Route[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页',
      permission: true
    }
  }
]

updatedMenu()

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  let hasLogin = false, // 是否需要登录
    hasPermission = true // 是否有访问权限
  if (to.path !== '/' && to.path !== '/login' && to.path !== '/404' && to.path !== '/*') {
    /** 首页、登录页、404等，不需要进行权限判定，可直接访问 */
    if (state.token.length === 0) {
      /** 权限判定前，先进行是否需要登录判定 */
      hasLogin = true
    } else {
      const allPages = routes
          .map(v => v.children || [])
          .reduce((p, c) => {
            return [...p, ...c]
          }) /** 所有路由页面 */,
        thisPage = find(allPages, { path: to.path.replace('/', '') }) /** 该路由对应的页面 */
      /** 是否存在该路由？若存在则进行权限判定 */
      thisPage ? (hasPermission = !!thisPage.meta.permission) : next({ path: '*' })
    }
  } else {
    next()
  }
})

export default router

/** 权限管理相关 */
export function updatedMenu() {
  if (state.btnAuth && state.btnAuth.length > 0) {
    state.btnAuth.forEach((menu: any) => {
      routes.forEach((r: any) => {
        // 遍历取出要显示的一级菜单
        if (r.meta.title === menu.name) {
          r.children &&
            r.children.forEach((c: any) => {
              // 默认所有的子路由没有访问权限
              c.meta.permission = false
              menu.children &&
                menu.children.forEach((v: any) => {
                  // 根据后台返回路径取出有权限的子路由
                  if (`/${c.path}` === v.url) {
                    c.meta.permission = true
                    // 过滤掉有权限但不需要在菜单中显示的路由
                    c.meta.show = !c.meta.hidden
                    r.meta.show = true
                  } else if ('hidden' in c.meta) {
                    /** 隐藏路由的页面作为某页面的子页面存在，不需要后台配置，故默认权限为true */
                    c.meta.permission = true
                    c.meta.show = !c.meta.hidden
                    r.meta.show = true
                  }
                })
            })
        }
      })
    })
  }
}
