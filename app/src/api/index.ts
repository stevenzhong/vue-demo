/**
 * 项目全部 API 接口定义，每个接口需要描述清楚作用，方便查找
 *
 * @author : zhenda.li
 */

import http from '@/utils/http'

export default {
  /**
   * 登录
   * @param params 请求参数
   */
  login(params: any) {
    return http.post('/user/login', params)
  },
  test() {
    return http.get('/')
  },
  /** 获取路由下所有的按钮权限 */
  getSubAccountsAccess(params?: any) {
    return http.get('/sub/accounts/access', params)
  }
}
