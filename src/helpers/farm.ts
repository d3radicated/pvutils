import { find, findKey, some, startCase } from 'lodash'
import dayjs from '@/plugins/dayjs'
import { useWeatherStore } from '@/store/weather'
import { diffForHumans, diffInSeconds, fromNowHumanized, wholeDatesBetween } from './dateTime'
import { Farm, PlantName, PlantType, Rarity, Statistic, Tool, ToolType } from '@/types/farm'

export function addMissingTools(tools: Tool[]): Tool[] {
  if (!some(tools, ['type', 'WATER'])) {
    tools.splice(1, 0, <Tool>{
      id: 2,
      type: 'WATER',
      count: 0,
      startTime: dayjs().startOf('day').toJSON(),
      endTime: dayjs().endOf('day').toJSON(),
    })
  }

  return tools
}

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

export function getFarmStats(farm: Farm): Statistic[] {
  const waterTool = find(farm.activeTools, ['type', ToolType.Water])

  return [
    {
      name: 'Harvest',
      color: () => 'green',
      icon: () => 'mdi-sprout',
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
      value: () => {
        return diffInSeconds(farm.startTime) / diffInSeconds(farm.startTime, farm.harvestTime)
      },
    },

    {
      name: 'Water',
      color: () => 'light-blue',
      icon: () => 'mdi-water',
      label: () => {
        if (!waterTool) {
          return `Needs 2`
        }

        if (farm?.needWater) {
          return `Needs ${2 - waterTool.count}`
        }

        return dayjs().isAfter(waterTool.endTime)
          ? 'Waiting to Dry'
          : fromNowHumanized(waterTool.endTime)
      },
      tooltip: () => {
        if (!waterTool) {
          return null
        }

        return dayjs().isAfter(waterTool.endTime)
          ? null
          : `Dries at ${dayjs(waterTool.endTime).format('lll')}`
      },
      value: () => {
        if (!waterTool) {
          return 0
        }

        return (
          diffInSeconds(waterTool.startTime) / diffInSeconds(waterTool.startTime, waterTool.endTime)
        )
      },
    },

    {
      name: 'LE',
      color: () => 'blue',
      icon: () => 'mdi-lightning-bolt',
      label: () => {
        const now = dayjs()
        const duration = diffForHumans(
          now.add(farm.plant.farmConfig.hours, 'hours').toJSON(),
          now.toJSON()
        )

        return `${farm.plant.farmConfig.le} in ${duration}`
      },
      tooltip: () => {
        const energy = farm.plant.farmConfig.le / farm.plant.farmConfig.hours

        return `${energy.toFixed(2)} per hour`
      },
    },

    {
      name: 'Est. LE',
      color: () => {
        const estimatedEnergy = getEstimatedHarvest(farm)

        if (farm.plant.farmConfig.le > estimatedEnergy) {
          return 'negative'
        }

        if (farm.plant.farmConfig.le < estimatedEnergy) {
          return 'positive'
        }

        return 'grey'
      },
      icon: () => {
        const estimatedEnergy = getEstimatedHarvest(farm)

        if (farm.plant.farmConfig.le > estimatedEnergy) {
          return 'mdi-trending-down'
        }

        if (farm.plant.farmConfig.le < estimatedEnergy) {
          return 'mdi-trending-up'
        }

        return 'mdi-trending-neutral'
      },
      iconColor() {
        return this.color()
      },
      label: () => {
        return getEstimatedHarvest(farm)
      },
      tooltip: () => {
        return null
      },
    },

    {
      name: 'Total LE',
      color: () => 'blue',
      icon: () => 'mdi-lightning-bolt-circle',
      label: () => {
        return farm.totalHarvest
      },
    },
  ]
}

export function getPlantName(farm: Farm): string | number {
  if (farm.isTempPlant) {
    if (farm.plant.type === PlantType.Tree) {
      return 'Mama'
    } else {
      return 'Sapling'
    }
  }

  const name = findKey(PlantName, (code) => {
    return code === Number(farm.plantId.toString().substr(3, 2))
  })

  return name ? startCase(name) : farm.plantId
}

export function getRarity(rarity: Rarity): string | undefined {
  return findKey(Rarity, (r) => r === rarity)
}
