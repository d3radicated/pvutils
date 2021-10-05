<script setup lang="ts">
import { find } from 'lodash'
import { computed, defineProps, PropType } from 'vue'
import { Elements, Farm } from '@/store/farm'
import { diffInSeconds, fromNowHumanized } from '@/helpers/dateTime'
import { getEstimatedHarvest } from '@/helpers/farm'

const props = defineProps({
  farm: {
    type: Object as PropType<Farm>,
    required: true,
  },
})

const farm = computed(() => props.farm)

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
          <q-chip color="orange">
            <q-avatar color="white" icon="mdi-pot" text-color="orange" />
            {{ fromNowHumanized(getTool('POT')?.endTime) }}
          </q-chip>
        </div>

        <div>
          <q-chip color="green">
            <q-avatar color="white" icon="mdi-sprout" text-color="green" />
            {{ fromNowHumanized(farm.harvestTime) }}
          </q-chip>
        </div>

        <div>
          <q-chip color="light-blue" size="sm">
            <q-avatar color="white" icon="mdi-water" text-color="light-blue" />

            <template v-if="farm.needWater">
              Needs {{ 2 - getToolCount('WATER') }}
            </template>

            <template v-else>
              {{ fromNowHumanized(getTool('WATER')?.endTime) }}
            </template>
          </q-chip>
        </div>

        <div>
          <q-chip color="blue">
            <q-avatar color="white" icon="mdi-flash" text-color="blue" />

            {{ estimatedHarvest }}
          </q-chip>
        </div>

        <div>
          <q-chip color="blue">
            <q-avatar color="white" icon="mdi-flash-alert" text-color="blue" />
          </q-chip>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
