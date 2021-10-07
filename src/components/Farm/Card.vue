<script setup lang="ts">
import { find } from 'lodash'
import { computed, PropType } from 'vue'
import { Farm } from '@/store/farm'
import { diffInSeconds } from '@/helpers/dateTime'
import { getEstimatedHarvest } from '@/helpers/farm'
import { useTimeStore } from '@/store/time'

const props = defineProps({
  farm: {
    type: Object as PropType<Farm>,
    required: true,
  },
})

const timeStore = useTimeStore()

const farm = computed(() => props.farm)
const time = computed(() => timeStore.now.unix())

const estimatedHarvest = computed(() => getEstimatedHarvest(farm.value))
const plantSize = computed(() => (farm.value.isTempPlant ? '64px' : '48px'))
const waterValue = computed(() =>
  farm.value.needWater
    ? diffInSeconds(getTool('WATER')?.startTime, getTool('WATER')?.endTime)
    : diffInSeconds(getTool('WATER')?.startTime)
)
const dampnessColor = computed(() => {
  switch (getToolCount('WATER')) {
    case 0:
      return 'amber-3'
    case 1:
      return 'amber-2'
    case 2:
    default:
      return 'light-blue-2'
  }
})

function getTool(type: string) {
  return find(farm.value.activeTools, (tool) => tool.type === type)
}

function getToolCount(type: string) {
  return find(farm.value.activeTools, (tool) => tool.type === type)?.count || 0
}

timeStore.sync()
</script>

<template>
  <q-card flat bordered>
    <q-card-section horizontal>
      <q-card-section class="q-pa-sm">
        <q-circular-progress
          show-value
          color="orange"
          size="120px"
          track-color="orange-2"
          :max="
            diffInSeconds(getTool('POT')?.startTime, getTool('POT')?.endTime)
          "
          :value="diffInSeconds(getTool('POT')?.endTime)"
        >
          <q-circular-progress
            reverse
            show-value
            color="green"
            size="100px"
            track-color="green-2"
            :max="diffInSeconds(farm.startTime, farm.harvestTime)"
            :thickness="0.24"
            :value="diffInSeconds(farm.startTime)"
          >
            <q-circular-progress
              reverse
              show-value
              size="80px"
              track-color="light-blue"
              :color="dampnessColor"
              :max="
                diffInSeconds(
                  getTool('WATER')?.startTime,
                  getTool('WATER')?.endTime
                )
              "
              :thickness="1"
              :value="waterValue"
            >
              <q-avatar square :size="plantSize">
                <img class="img--plant" :src="farm.plant.iconUrl" />
              </q-avatar>
            </q-circular-progress>
          </q-circular-progress>
        </q-circular-progress>
      </q-card-section>

      <q-card-section>
        <div>
          <q-chip color="blue">
            <q-avatar color="white" icon="mdi-flash" text-color="blue" />

            {{ estimatedHarvest }}
          </q-chip>
        </div>

        <div v-for="(chip, _) in farm.chipConfigs" :key="_">
          <q-chip :color="chip.color">
            <q-avatar
              color="white"
              :icon="chip.icon"
              :text-color="chip.color"
            />

            <span :key="time" v-text="chip.label()" />

            <q-tooltip
              v-if="chip.tooltip && chip.tooltip()"
              anchor="center right"
              self="center left"
              transition-show="jump-right"
              transition-hide="jump-left"
            >
              {{ chip.tooltip() }}
            </q-tooltip>
          </q-chip>
        </div>

        <div v-for="(tool, _) in farm.activeTools" :key="_">
          <q-chip size="sm" :color="tool.chipConfig.color">
            <q-avatar
              color="white"
              :icon="tool.chipConfig.icon"
              :text-color="tool.chipConfig.color"
            />

            <span :key="time" v-text="tool.chipConfig.label()" />

            <q-tooltip
              v-if="tool.chipConfig.tooltip && tool.chipConfig.tooltip()"
              anchor="center right"
              self="center left"
              transition-show="jump-right"
              transition-hide="jump-left"
            >
              {{ tool.chipConfig.tooltip() }}
            </q-tooltip>
          </q-chip>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
