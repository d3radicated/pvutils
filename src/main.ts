import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import quasar from './plugins/quasar'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(quasar)
app.use(router)

app.mount('#q-app')
