import { Farm } from '@/store/farm'
import { useWeatherStore } from '@/store/weather'
import { wholeDatesBetween } from './dateTime'

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

      return le + energyPerHour * (effects[plantType] || 0) * 24
    }, 0)
  )
}
