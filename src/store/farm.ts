import { defineStore } from 'pinia'
import { pvuInstance, Response } from '@/plugins/axios'
import { useSessionStore } from './session'
import { getFarmChipConfigs, getToolChipConfig } from '@/helpers/farm'

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

export interface ChipConfig {
  color: string
  icon: string
  label: () => string
  tooltip?: () => string | null
}

export interface Tool {
  id: number
  type: string
  count: number
  startTime: string
  endTime: string

  chipConfig: ChipConfig
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
  activeTools: Tool[]
  harvestTime: string
  inGreenhouse: boolean
  isTempPlant: boolean
  needWater: boolean
  plant: Plant
  stage: 'farming' | 'cancelled'
  startTime: string

  chipConfigs: ChipConfig[]
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

  actions: {
    clearFarms() {
      this.farms = []
    },

    fetchFarms() {
      const session = useSessionStore()

      return pvuInstance
        .get<Response<Farm[]>>('farms', {
          headers: session.headers,
        })
        .then(({ data }) => {
          this.farms = data.data.map((farm) => {
            farm.chipConfigs = getFarmChipConfigs(farm)
            farm.activeTools = farm.activeTools.map((tool) => {
              tool.chipConfig = getToolChipConfig(tool, farm)

              return tool
            })

            return farm
          })
        })
    },
  },
})
