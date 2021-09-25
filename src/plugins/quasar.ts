import { App } from 'vue'
import { Dialog, Notify, Quasar, QuasarPluginOptions } from 'quasar'
import iconSet from 'quasar/icon-set/mdi-v6'

import '@mdi/font/scss/materialdesignicons.scss'
import 'quasar/dist/quasar.sass'

export default {
  install(app: App) {
    app.use(Quasar, <QuasarPluginOptions>{
      config: {
        brand: {
          primary: '#eb994d',
          secondary: '#3f87dd',
          accent: '#46881b',

          dark: '#1d1d1d',

          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037',
        },

        notify: {
          timeout: 3000,
        },
      },
      iconSet,
      plugins: { Dialog, Notify },
    })
  },
}
