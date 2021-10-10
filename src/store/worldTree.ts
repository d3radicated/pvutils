import { pvuInstance, Response } from '@/plugins/axios'
import { defineStore } from 'pinia'
import { useSessionStore } from './session'

export interface Reward {
  type: number
  target: number
  status: 'rewarded' | 'finish' | 'notfinish'
}

export interface WorldTreeData {
  level: number
  myWater: number
  reward: Reward[]
  rewardAvailable: boolean
  totalWater: number
  yesterdayReward: number
}

export interface State {
  rewards: Reward[]
  totalWater: number

  loading: boolean
}

export const useWorldTreeStore = defineStore('worldTree', {
  state: () =>
    <State>{
      rewards: [],
      totalWater: 0,

      loading: false,
    },

  actions: {
    async fetchWorldTreeData() {
      const sessionStore = useSessionStore()

      this.loading = true

      try {
        const { data } = await pvuInstance.get<Response<WorldTreeData>>('world-tree/datas', {
          headers: sessionStore.headers,
        })

        this.rewards = data.data.reward
        this.totalWater = data.data.totalWater
      } catch (e) {
        //
      } finally {
        this.loading = false
      }
    },
  },
})
