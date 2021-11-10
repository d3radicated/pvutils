<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { getPlantName, getRarity } from '@/helpers/farm'
import { useFarmStore } from '@/store/farm'
import { useTimeStore } from '@/store/time'
import { Farm, Tool } from '@/types/farm'

const emit = defineEmits(['remove:crow'])
const props = defineProps({
  farm: {
    type: Object as PropType<Farm>,
    required: true,
  },
})

const farmStore = useFarmStore()
const timeStore = useTimeStore()

const isRemovingCrow = ref(false)

const time = computed(() => timeStore.now.unix())

const cardClass = computed(() => {
  return props.farm.isTempPlant ? 'bg-sunflower' : `bg-element-${props.farm.plantElement}`
})

const element = computed(() => props.farm.plantElement || 'Sunflower')

const rarity = computed(() => {
  return getRarity(props.farm.plant.rarity) || ''
})

const rarityClass = computed(() => {
  if (rarity.value) {
    return {
      [`bg-rarity-${rarity.value.toLowerCase()}`]: true,
      [`border-rarity-${rarity.value.toLowerCase()}`]: true,
    }
  }

  return null
})

function removeCrow() {
  if (!props.farm.hasCrow) {
    return
  }

  isRemovingCrow.value = true

  farmStore
    .applyTool(props.farm, Tool.Scarecrow)
    .then(() => {
      emit('remove:crow', props.farm)
    })
    .finally(() => {
      isRemovingCrow.value = false
    })
}

timeStore.sync()
</script>

<template>
  <q-card bordered class="" :class="cardClass">
    <q-card-section class="q-pb-sm">
      <div class="text-subtitle1 text-weight-medium" v-text="getPlantName(props.farm)" />

      <div class="card__chips">
        <q-chip outline square size="sm" class="text-capitalize">
          {{ element }}
        </q-chip>

        <q-chip v-if="rarity" outline square size="sm" color="white" :class="rarityClass">
          {{ rarity }}
        </q-chip>
      </div>
    </q-card-section>

    <div class="absolute-top-right q-pt-md q-pr-md">
      <div v-if="props.farm.hasCrow">
        <q-btn
          outline
          round
          icon="mdi-bird"
          size="sm"
          :disable="isRemovingCrow"
          :loading="isRemovingCrow"
          @click.stop="removeCrow"
        />
      </div>

      <div v-if="props.farm.hasSeed">
        <q-btn outline round icon="mdi-seed" size="sm" />
      </div>
    </div>

    <q-card class="card__body rounded-t-xl">
      <q-img fit="contain" height="80px" class="card__img" :src="props.farm.plant.iconUrl" />

      <q-card-section class="q-px-none">
        <q-markup-table dense flat separator="none" class="card__table">
          <tbody>
            <tr v-for="(stat, _) in props.farm.stats" :key="_" class="q-tr--no-hover">
              <td v-text="stat.name" />

              <td class="q-px-none">
                <q-icon
                  size="xs"
                  :color="(stat.iconColor && stat.iconColor()) || stat.color()"
                  :name="stat.icon()"
                />
              </td>

              <td>
                <q-linear-progress
                  v-if="stat.value"
                  rounded
                  stripe
                  size="24px"
                  :color="stat.color()"
                  :track-color="`${stat.color()}-2`"
                  :value="stat.value()"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge :key="time" color="white" :text-color="stat.color()">
                      {{ stat.label() }}
                    </q-badge>
                  </div>

                  <q-tooltip
                    v-if="stat.tooltip && stat.tooltip()"
                    anchor="top middle"
                    self="bottom middle"
                    transition-show="jump-up"
                    transition-hide="jump-down"
                    :offset="[8, 8]"
                  >
                    {{ stat.tooltip() }}
                  </q-tooltip>
                </q-linear-progress>

                <q-btn
                  v-else
                  no-caps
                  outline
                  padding="none"
                  size="md"
                  class="full-width"
                  :color="stat.color()"
                >
                  <span class="text-white">
                    {{ stat.label() }}
                  </span>

                  <q-tooltip
                    v-if="stat.tooltip && stat.tooltip()"
                    anchor="top middle"
                    self="bottom middle"
                    transition-show="jump-up"
                    transition-hide="jump-down"
                    :offset="[8, 8]"
                  >
                    {{ stat.tooltip() }}
                  </q-tooltip>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <!-- <q-btn round color="light-blue" icon="mdi-water" size="sm" /> -->

        <q-btn
          v-if="props.farm.hasCrow"
          round
          color="grey-9"
          icon="mdi-bird"
          size="sm"
          :disable="isRemovingCrow"
          :loading="isRemovingCrow"
          @click.stop="removeCrow"
        />
      </q-card-section>
    </q-card>
  </q-card>
</template>

<style lang="scss" scoped>
.card__chips .q-chip {
  margin-left: 0 !important;
}

.card__body {
  margin-top: 80px;
}

.card__img {
  margin-top: -72px;
}

.card__table {
  td:not(:last-child) {
    width: 1%;

    &:first-child {
      text-align: right;
    }

    &:nth-child(2) {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
