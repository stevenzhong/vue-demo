const userItem = localStorage.getItem('user') || sessionStorage.getItem('user') || ''
let user: any = {}
if (userItem.length) {
  user = JSON.parse(userItem)
}
const state = {
  token: (user && user.token) || '', // 用户 token
  btnAuth: JSON.parse(sessionStorage.getItem('btnAuth') as string)
}

export default state
