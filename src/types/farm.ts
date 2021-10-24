export enum PlantName {
  Blackrose = 14,
  Firewood = 17,
  Pomegrenade = 30,
  DarkRoot = 31,
  LeafyWind = 37,
}

export enum Rarity {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  Mythic = 3,
}

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

export enum ToolType {
  Pot = 'POT',
  Water = 'WATER',
  Greenhouse = 'GREENHOUSE',
}

export interface Tool {
  id: number
  type: ToolType
  count: number
  startTime: string
  endTime: string
}

export interface FarmConfig {
  hours: number
  le: number
}

export interface PlantStats {
  type: Elements
}

export enum PlantType {
  Plant = 1,
  Tree = 2,
}

export interface Plant {
  farmConfig: FarmConfig
  iconUrl: string
  rarity: Rarity
  stats: PlantStats
  type: PlantType
}

export enum PlantState {
  Farming = 'farming',
  Cancelled = 'cancelled',
}

export interface Statistic {
  name: string
  color: () => string
  label: () => string | number
  icon: () => string
  iconColor?: () => string | null
  iconRight?: () => string | null
  iconRightColor?: () => string | null
  tooltip?: () => string | null
  value?: () => number
}

export interface Farm {
  _id: string
  activeTools: Tool[]
  harvestTime: string
  inGreenhouse: boolean
  isTempPlant: boolean
  needWater: boolean
  plant: Plant
  plantElement?: Elements
  plantId: number
  stage: PlantState
  startTime: string
  stats?: Statistic[]
  totalHarvest: number
}
