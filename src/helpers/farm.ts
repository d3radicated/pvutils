import dayjs from '@/plugins/dayjs'
import { Farm, Tool, ChipConfig } from '@/store/farm'
import { useWeatherStore } from '@/store/weather'
import { fromNowHumanized, wholeDatesBetween } from './dateTime'

export function getEnergyPerHour(farm: Farm): number {
  return Math.round(farm.plant.farmConfig.le / farm.plant.farmConfig.hours)
}

export function getEstimatedHarvest(farm: Farm): number {
  if (farm.isTempPlant) {
    return farm.plant.farmConfig.le
  }

  const weatherStore = useWeatherStore()
  const dates = wholeDatesBetween(farm.startTime, farm.harvestTime, true)
  const energyPerHour = getEnergyPerHour(farm)

  return (
    farm.plant.farmConfig.le +
    dates.reduce((le, date) => {
      const effects = weatherStore.getEffectsOnDate(date)
      const plantType = farm.plant.stats.type

      return le + Math.round(energyPerHour * (effects[plantType] || 0) * 24)
    }, 0)
  )
}

export function getFarmChipConfigs(farm: Farm): ChipConfig[] {
  return [
    {
      color: 'green',
      icon: 'mdi-sprout',
      label: () => {
        return dayjs().isAfter(farm.harvestTime)
          ? 'Ready to Harvest'
          : fromNowHumanized(farm.harvestTime)
      },
      tooltip: () => {
        return dayjs().isAfter(farm.harvestTime)
          ? null
          : `Harvest at ${dayjs(farm.harvestTime).format('lll')}`
      },
    },
  ]
}

export function getToolChipConfig(tool: Tool, farm: Farm): ChipConfig {
  const config: ChipConfig = {
    color: 'orange',
    icon: 'mdi-pot',
    label: () => {
      return fromNowHumanized(tool.endTime)
    },
    tooltip: () => {
      return `Expires at ${dayjs(tool.endTime).format('lll')}`
    },
  }

  switch (tool.type) {
    case 'GREENHOUSE':
      config.color = 'lime'
      config.icon = 'mdi-pine-tree-box'
      config.label = () => {
        return farm.inGreenhouse
          ? `Greenhouse Active`
          : 'Greenhouse Active for Tomorrow'
      }
      config.tooltip = () => {
        return farm.inGreenhouse
          ? null
          : `Expires at ${dayjs(tool.endTime).format('lll')}`
      }
      break

    case 'WATER':
      config.color = 'light-blue'
      config.icon = 'mdi-water'
      config.label = () => {
        return farm?.needWater
          ? `Needs ${2 - tool.count}`
          : fromNowHumanized(tool.endTime)
      }
      config.tooltip = () => {
        return `Dries at ${dayjs(tool.endTime).format('lll')}`
      }
      break
  }

  return config
}
