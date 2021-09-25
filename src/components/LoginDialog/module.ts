import { Module } from 'vuex'

interface State {
  isVisible: boolean
}

export default <Module<any, any>>{
  namespaced: true,

  state: <State>{
    isVisible: false,
  },

  mutations: {
    hide(state: State) {
      state.isVisible = false
    },

    setVisibility(state: State, isVisible: boolean) {
      state.isVisible = isVisible
    },

    show(state: State) {
      state.isVisible = true
    },
  },
}
