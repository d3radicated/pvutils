import { defineStore } from 'pinia'
import { pvuInstance, Response } from '@/plugins/axios'
import { useSessionStore } from './session'
import { getFarmStats } from '@/helpers/farm'
import { Farm, Tool } from '@/types/farm'

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
    applyTool(farm: Farm, tool: Tool) {
      const session = useSessionStore()

      return pvuInstance.post(
        'farms/apply-tool',
        {
          farmId: farm._id,
          toolId: tool,
          token: {
            challenge: 'default',
            seccode: 'default',
            validate: 'default',
          },
        },
        {
          headers: session.headers,
        }
      )
    },

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
