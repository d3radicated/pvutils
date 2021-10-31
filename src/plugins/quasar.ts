import { App } from 'vue'
import iconSet from 'quasar/icon-set/mdi-v6'
import { Dialog, LocalStorage, Notify, Quasar, QuasarPluginOptions } from 'quasar'

import '@quasar/extras/mdi-v6/mdi-v6.css'
import 'quasar/src/css/index.sass'

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
