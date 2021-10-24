import { App } from 'vue'
import iconSet from 'quasar/icon-set/mdi-v6'
import { Dialog, LocalStorage, Notify, Quasar, QuasarPluginOptions } from 'quasar'

import '@mdi/font/scss/materialdesignicons.scss'
import 'quasar/dist/quasar.sass'

export default {
  install(app: App): void {
    app.use(Quasar, <QuasarPluginOptions>{
      config: {
        dark: true,
        notify: {
          timeout: 3000,
        },
      },
      iconSet,
      plugins: {
        Dialog,
        LocalStorage,
        Notify,
      },
    })
  },
}
