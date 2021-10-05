import { defineStore } from 'pinia'
import { Cookies } from 'quasar'
import { pvuInstance } from '@/plugins/axios'
import { statusCodes } from '@/plugins/constants'

export interface State {
  isLoggedIn: boolean
  isLoggingIn: boolean
  token: string | null
}

export const useSessionStore = defineStore('session', {
  state: () =>
    <State>{
      isLoggedIn: false,
      isLoggingIn: false,
      token: null,
    },

  getters: {
    headers: (state) => {
      return state.token ? { Authorization: `Bearer ${state.token}` } : {}
    },
  },

  actions: {
    getFarmStatus() {
      this.isLoggingIn = true

      return pvuInstance
        .get('farm-status', { headers: this.headers })
        .then(
          ({ data }) => {
            switch (data.status) {
              case statusCodes.SUCCESS:
                this.login()
                break

              case statusCodes.UNAUTHENTICATED:
              default:
                this.logout()
            }
          },
          () => {
            this.logout()
          }
        )
        .finally(() => {
          this.isLoggingIn = false
        })
    },

    login() {
      this.isLoggedIn = true
    },

    logout() {
      this.isLoggedIn = false
      this.token = null

      Cookies.remove('Pvu-Token')
    },

    setToken(token: string) {
      this.token = token

      if (token) {
        Cookies.set('Pvu-Token', token)
      } else {
        Cookies.remove('Pvu-Token')
      }
    },

    setTokenFromCookie() {
      this.token = Cookies.get('Pvu-Token')
    },
  },
})
