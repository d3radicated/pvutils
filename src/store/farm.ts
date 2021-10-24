import { defineStore } from 'pinia'
import { pvuInstance, Response } from '@/plugins/axios'
import { useSessionStore } from './session'
import { getFarmStats } from '@/helpers/farm'
import { Farm } from '@/types/farm'

export interface State {
  farms: Farm[]
  loading: boolean
}

export const useFarmStore = defineStore('farm', {
  state: () =>
    <State>{
      farms: [],

      loading: false,
    },

  actions: {
    clearFarms() {
      this.farms = []
    },

    async fetchFarms() {
      const session = useSessionStore()

      this.loading = true

      try {
        const { data } = await pvuInstance.get<Response<Farm[]>>('farms', {
          headers: session.headers,
        })

        this.farms = data.data.map((farm) => {
          farm.stats = getFarmStats(farm)

          return farm
        })
      } catch (e) {
        //
      } finally {
        this.loading = false
      }
    },
  },
})
