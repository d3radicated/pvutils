export enum PlantName {
  Catapult = 0,
  'Fire Cactus' = 1,
  Iceflower = 2,
  'Eletric Bloom' = 3,
  'Spring Potion' = 4,
  Nightshade = 5,
  'Magnifying Leaf' = 6,
  Magmato = 7,
  Spikenut = 8,
  'Shadow-shroom' = 9,
  Leafshooter = 10,
  'Silky Branch' = 11,
  Mlover = 12,
  'Icy Branch' = 13,
  Blackrose = 14,
  'Chain-shroom' = 15,
  'Tail Guard' = 16,
  Firewood = 17,
  'Moon-shroom' = 18,
  'Light Bloom' = 19,
  'Gold Wing' = 20,
  'Light Shooter' = 21,
  'Bee Launcher' = 22,
  'Poison-shroom' = 23,
  'Eel Plant' = 24,
  'Metal Whip' = 25,
  'Bamboo Sprout' = 26,
  Seedshell = 27,
  Bloomerang = 28,
  Spikerock = 29,
  Pomegrenade = 30,
  'Dark Root' = 31,
  'Lightning Branch' = 32,
  'Night Eyes' = 33,
  'Lightning-shroom' = 34,
  'Spikey Shell' = 35,
  'Magnifying Grass' = 36,
  'Leafy Wind' = 37,
  Aloe = 38,
  'Bubble Pult' = 39,
  'The Tree of Fire' = 90,
  'The Tree of Light' = 91,
  'The Frozen World Tree' = 92,
  'Eyes of The Dark Forest' = 93,
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

export enum Tool {
  Pot = 2,
  Water = 3,
  Scarecrow = 4,
  Greenhouse = 5,
}

export interface PlantTool {
  id: Tool
  type: string
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
  Paused = 'paused',
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
  activeTools: PlantTool[]
  harvestTime: string
  hasCrow?: boolean
  hasSeed?: boolean
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
