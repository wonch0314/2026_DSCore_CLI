import { createApp } from 'vue'
import { DsCore } from 'dscore-ui-vue'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(DsCore, {
  applyDefaultStyle: true,
  defaults: {
    button: { throttle: 300 },
    modal: { closeOnEsc: true, closeOnOverlay: true },
    pagination: { pageSize: 10 }
  }
})

app.use(router)
app.mount('#app')
