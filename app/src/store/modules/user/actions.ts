import api from '@/api'

export default {
  getMessageRead({ commit }) {
    return api.test().then((res: any) => {})
  }
}
