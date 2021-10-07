import dayjs, { Dayjs } from 'dayjs'
import { defineStore } from 'pinia'

export interface State {
  now: Dayjs
  interval: number | null
}

export const useTimeStore = defineStore('time', {
  state: () =>
    <State>{
      now: dayjs(),
      interval: null,
    },

  actions: {
    stopSyncing() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },

    sync() {
      if (!this.interval) {
        this.interval = window.setInterval(() => {
          this.now = dayjs()
        }, 1000)
      }
    },
  },
})
