/**
 * 封装通用 http 方法函数，目前通过 fetch 实现
 *
 */

import { HTTPStatusCode, ErrorMessage } from '@/enums'
import config from '@/config'
import store from '@/store'
import state from '@/store/modules/user/state'
import ElementUI from 'element-ui'

export default class http {
  static baseURL = config.baseURL
  static regexHttp = /^http|https/

  static getURL(url: string): string {
    return this.regexHttp.test(url) ? url : this.baseURL + url
  }

  static getToken(): string {
    return 'Bearer ' + state.token
  }

  // HTTP Status Code 401 未授权，清空保存的 token，跳转登录页
  static unauthorized() {}

  // 处理服务器返回的错误码，显示错误提示信息，只显示通用的错误提示，一些自定义的需各自处理
  static errorHandler({ code, data }: any) {
    let msg = ErrorMessage[code]
    if (msg) ElementUI.Message.error(msg)
  }

  static get(url: string, params?: any) {
    /** 组装地址参数，默认过滤掉值为空的字段 */
    if (params) {
      let array: string[] = []
      Object.keys(params).forEach(key => params[key] !== '' && array.push(key + '=' + encodeURIComponent(params[key])))
      url += '?' + array.join('&')
    }

    return new Promise<any>((resolve, reject) => {
      fetch(this.getURL(url), {
        method: 'GET',
        headers: {
          Authorization: this.getToken()
        }
      })
        .then(response => {
          if (response.ok) return response.json()
          else {
            reject({ status: response.status })
            if (response.status === HTTPStatusCode.Unauthorized) this.unauthorized()
          }
        })
        .then(response => {
          if (response.code !== 0) this.errorHandler(response)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  }

  static post(url: string, params?: any) {
    return new Promise<any>((resolve, reject) => {
      fetch(this.getURL(url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getToken()
        },
        body: JSON.stringify(params)
      })
        .then(response => {
          if (response.ok) return response.json()
          else {
            reject({ status: response.status })
            if (response.status === HTTPStatusCode.Unauthorized) this.unauthorized()
          }
        })
        .then(response => {
          if (response.code !== 0) this.errorHandler(response)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  }

  static put(url: string, params: any) {
    return new Promise<any>((resolve, reject) => {
      fetch(this.getURL(url), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getToken()
        },
        body: JSON.stringify(params)
      })
        .then(response => {
          if (response.ok) return response.json()
          else {
            reject({ status: response.status })
            if (response.status === HTTPStatusCode.Unauthorized) this.unauthorized()
          }
        })
        .then(response => {
          if (response.code !== 0) this.errorHandler(response)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  }

  static delete(url: string, params?: any) {
    if (params) {
      let array: string[] = []
      Object.keys(params).forEach(key => params[key] !== '' && array.push(key + '=' + encodeURIComponent(params[key])))
      url += '?' + array.join('&')
    }

    return new Promise<any>((resolve, reject) => {
      fetch(this.getURL(url), {
        method: 'DELETE',
        headers: {
          Authorization: this.getToken()
        }
      })
        .then(response => {
          if (response.ok) return response.json()
          else {
            reject({ status: response.status })
            if (response.status === HTTPStatusCode.Unauthorized) this.unauthorized()
          }
        })
        .then(response => {
          if (response.code !== 0) this.errorHandler(response)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  }

  static patch(url: string, params: any) {
    return new Promise<any>((resolve, reject) => {
      fetch(this.getURL(url), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getToken()
        },
        body: JSON.stringify(params)
      })
        .then(response => {
          if (response.ok) return response.json()
          else {
            reject({ status: response.status })
            if (response.status === HTTPStatusCode.Unauthorized) this.unauthorized()
          }
        })
        .then(response => {
          if (response.code !== 0) this.errorHandler(response)
          resolve(response)
        })
        .catch(error => reject(error))
    })
  }
}
