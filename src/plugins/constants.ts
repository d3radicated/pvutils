import { App } from 'vue'

export const statusCodes = {
  SUCCESS: 0,
  UNAUTHENTICATED: 1,
}

export default {
  install(app: App): void {
    app.provide('constants', {
      statusCodes,
    })
  },
}
