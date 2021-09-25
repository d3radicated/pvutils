import { Module } from 'vuex'
import { Cookies } from 'quasar'
import { pvuInstance } from '@/plugins/axios'
import { statusCodes } from '@/plugins/constants'

interface State {
  isLoggedIn: boolean
  isFetching: boolean
  isFarmOnMaintenance: boolean
  isMarketOnMaintenance: boolean
  token: string | null
}

export default <Module<any, any>>{
  namespaced: true,

  state: <State>{
    isLoggedIn: false,
    isFetching: false,
    isFarmOnMaintenance: false,
    isMarketOnMaintenance: false,
    token: null,
  },

  getters: {
    headers: (state: State) => {
      return state.token ? { Authorization: `Bearer ${state.token}` } : {}
    },
  },

  mutations: {
    clearToken(state: State) {
      state.token = null
    },

    fetch(state: State) {
      state.isFetching = true
    },

    login(state: State) {
      state.isLoggedIn = true
    },

    logout(state: State) {
      state.isLoggedIn = false
      state.token = null

      Cookies.remove('Pvu-Token')
    },

    setFarmOnMaintenance(state: State, flag: boolean) {
      state.isFarmOnMaintenance = flag
    },

    setMarketOnMaintenance(state: State, flag: boolean) {
      state.isMarketOnMaintenance = flag
    },

    setToken(state: State, token: string) {
      state.token = token

      if (token) {
        Cookies.set('Pvu-Token', token)
      } else {
        Cookies.remove('Pvu-Token')
      }
    },

    setTokenFromCookie(state: State) {
      state.token = Cookies.get('Pvu-Token')
    },

    stopFetching(state: State) {
      state.isFetching = false
    },
  },

  actions: {
    getFarmStatus({ state: State, commit, getters }) {
      commit('fetch')

      return pvuInstance
        .get('farm-status', { headers: getters.headers })
        .then(
          ({ data }) => {
            switch (data.status) {
              case statusCodes.SUCCESS:
                commit('login')
                break

              case statusCodes.UNAUTHENTICATED:
              default:
                commit('logout')
            }
          },
          (error) => {
            commit('logout')
          }
        )
        .finally(() => {
          commit('stopFetching')
        })
    },

    getMarketStatus({ state: State, commit: Commit }) {
      return pvuInstance.get('market-status')
    },
  },
}
