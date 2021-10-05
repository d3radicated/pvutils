import { defineStore } from 'pinia'

interface State {
  isVisible: boolean
}

export const useLoginDialogStore = defineStore('loginDialog', {
  state: () =>
    <State>{
      isVisible: false,
    },

  actions: {
    hide() {
      this.isVisible = false
    },

    setVisibility(isVisible: boolean) {
      this.isVisible = isVisible
    },

    show() {
      this.isVisible = true
    },
  },
})
