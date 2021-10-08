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
}

export const useWorldTreeStore = defineStore('worldTree', {
  state: () =>
    <State>{
      rewards: [],
    },

  actions: {
    async fetchWorldTreeData() {
      const sessionStore = useSessionStore()

      try {
        const { data } = await pvuInstance.get<Response<WorldTreeData>>(
          'world-tree/datas',
          {
            headers: sessionStore.headers,
          }
        )

        this.rewards = data.data.reward
      } catch (e) {
        //
      }
    },
  },
})
