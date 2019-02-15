import Vue from 'vue'
import ElementUI from 'element-ui'
import app from '@/app.vue'
import router from '@/router'
import store from '@/store'

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')
