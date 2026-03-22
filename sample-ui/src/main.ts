import { createApp } from 'vue'
import { DsCore } from 'dscore-ui-vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// dscore-ui-vue 플러그인 설정
app.use(DsCore, {
  // 컴포넌트 기본값
  defaults: {
    button: {
      throttle: 300,
      showSuccess: false,
      successDuration: 1500
    },
    modal: {
      closeOnEscape: true,
      closeOnOverlay: true,
      lockScroll: true
    },
    toast: {
      duration: 3000,
      position: 'top-right'
    }
  }
})

app.mount('#app')
