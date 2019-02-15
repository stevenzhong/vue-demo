export default {
  /**
   * 更新 Token，传空默认清空 token
   */
  updateToken(state: any, token: string | null) {
    state.token = token || ''
    if (!token) {
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
    }
  },

  /**
   * 更新 用户账号的是否是试玩的，为‘1’是试玩，为其他不是试玩
   */
  updateUserType(state: any, userType: string) {
    state.userType = userType || ''
  },

  /**
   * 更新 会员信息未读条数
   */
  updateMessage(state: any, messageNum: number) {
    state.messageNum = messageNum || 0
  },

  /**
   * 更新 账号的名字
   */
  updateUsername(state: any, username: string) {
    state.username = username || ''
  }
}
