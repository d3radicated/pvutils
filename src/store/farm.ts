import { defineStore } from 'pinia'
import { pvuInstance } from '@/plugins/axios'
import { useSessionStore } from './session'

export enum Elements {
  Dark = 'dark',
  Electro = 'electro',
  Fire = 'fire',
  Ice = 'ice',
  Light = 'light',
  Metal = 'metal',
  Parasite = 'parasite',
  Water = 'water',
  Wind = 'wind',
}

export interface Tool {
  id: number
  type: string
  count: number
  startTime: string
  endTime: string
}

export interface Water extends Tool {
  type: 'WATER'
}

export interface Pot extends Tool {
  type: 'POT'
}

export interface Greenhouse extends Tool {
  type: 'GREENHOUSE'
}

export interface FarmConfig {
  hours: number
  le: number
}

export interface PlantStats {
  type: Elements
}

export interface Plant {
  farmConfig: FarmConfig
  iconUrl: string
  rarity: number
  stats: PlantStats
  type: number
}

export interface Farm {
  _id: string
  activeTools: Array<Water | Pot | Greenhouse>
  harvestTime: string
  inGreenhouse: boolean
  isTempPlant: boolean
  needWater: boolean
  plant: Plant
  stage: 'farming' | 'cancelled'
  startTime: string
}

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

  getters: {
    getEstimatedHarvest: () => (farm: Farm) => {
      return null
    },
  },

  actions: {
    clearFarms() {
      this.farms = []
    },

    fetchFarms() {
      const session = useSessionStore()

      return pvuInstance
        .get('farms', {
          headers: session.headers,
        })
        .then(({ data }) => {
          this.farms = data.data
        })
    },
  },
})
