import { createApp } from 'vue'
import App from './App.vue'
import quasar from './plugins/quasar'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(quasar)
app.use(router)
app.use(store)

app.mount('#q-app')
