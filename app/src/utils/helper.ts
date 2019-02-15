/**
 * 封装全局帮助接口函数
 *
 * @author : zhenda.li
 */

import Vue from 'vue'
import { toPairs, find, keys } from 'lodash'
import api from '@/api'

/** 是否是调试模式 */
const isDebug = process.env.NODE_ENV !== 'production'

/** 拓展 Vue 原型方法 */

/** 增加打印方法，调试用，生成环境无效 */
Vue.prototype.$log = (message?: any, ...optionalParams: any[]) => {
  if (isDebug) console.log(message, ...optionalParams)
}

/** 增加 EventBus 对象，可全局派发事件通信，事件名需在 enums 中的 EventType 中统一定义 */
Vue.prototype.$event = new Vue()

/**
 * 验证当前页面按钮的权限，控制显示和隐藏
 * @param routes 登录成功后，返回的路由权限信息，从 User Model 里直接获取
 * @param url 当前页面的路由，例如 '/agent-management'
 * @param pageButtons 当前路由下，受权限控制的所有按钮的 id,此 id 于后端约定的名称保持一致
 * @returns object 根据 pageButtons 传入的 id 数组，返回对象，key 为 id ，value 为 bool，true 显示按钮，false 隐藏按钮
 */
Vue.prototype.$unauthorizedBtns = (routes: { [key: string]: any }[] = [], url: string = '', pageButtons: { [key: string]: number } = {}): Promise<any> => {
  const subLevelChildren: any = []
  const unauthorizedBtnDic = [{}, ...keys(pageButtons)].reduce((p, c) => ({ ...p, [c as string]: false }))

  routes.map(route => {
    route.children && route.children.map(subChild => subLevelChildren.push(subChild))
  })

  const onePage = subLevelChildren.find(sub => sub.url === url) || {}
  return api.getSubAccountsAccess({ menu_id: onePage.id }).then((res: any) => {
    if (res.code === 0) {
      toPairs(pageButtons).map(([key, id]) => {
        const btn: any = find(res.data || [], { id })
        if (btn && btn.children) {
          unauthorizedBtnDic[key] = getCollectionOfPermissions(btn.children)
        } else {
          unauthorizedBtnDic[key] = !!btn
        }
      })
    }
    return unauthorizedBtnDic
  })
}
/** 递归：用于计算该路由下的所有子页面的权限 */
function getCollectionOfPermissions(permissions) {
  let collection: any = {}
  permissions.map(permission => {
    collection[permission.id] = permission.children && permission.children.length ? getCollectionOfPermissions(permission.children) : true
  })
  return collection
}
