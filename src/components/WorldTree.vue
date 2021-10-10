<script setup lang="ts">
import { orderBy } from 'lodash'
import { computed, watch } from 'vue'
import { useSessionStore } from '@/store/session'
import { Reward, useWorldTreeStore } from '@/store/worldTree'
import { formatNumber } from '@/helpers/number'

const sessionStore = useSessionStore()
const worldTreeStore = useWorldTreeStore()

const loading = computed(() => worldTreeStore.loading)
const isLoggedIn = computed(() => sessionStore.isLoggedIn)
const rewards = computed(() => orderBy(worldTreeStore.rewards, 'type', 'desc'))
const totalWater = computed(() => worldTreeStore.totalWater)

watch(
  isLoggedIn,
  (value) => {
    if (value) {
      worldTreeStore.fetchWorldTreeData()
    }
  },
  { immediate: true }
)

function getRewardColor(reward: Reward): string {
  switch (reward.status) {
    case 'finish':
      return 'info'

    case 'rewarded':
      return 'positive'

    case 'notfinish':
    default:
      return 'primary'
  }
}

function getRewardIcon(reward: Reward): string {
  console.log(reward)

  switch (reward.status) {
    case 'finish':
      return 'mdi-information'

    case 'rewarded':
      return 'mdi-check'

    case 'notfinish':
    default:
      return 'mdi-water'
  }
}
</script>

<template>
  <q-card bordered>
    <q-linear-progress v-if="loading" indeterminate class="absolute" />

    <q-expansion-item>
      <template #header>
        <q-item-section>
          <div class="text-h6">World Tree</div>

          <div>Current Water: {{ formatNumber(totalWater) }}</div>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            round
            icon="mdi-refresh"
            @click.stop="worldTreeStore.fetchWorldTreeData"
          />
        </q-item-section>
      </template>

      <q-card-section class="q-py-none">
        <q-timeline>
          <q-timeline-entry
            v-for="reward in rewards"
            :key="reward.type"
            :color="getRewardColor(reward)"
            :icon="getRewardIcon(reward)"
            :subtitle="`R${reward.type}`"
            :title="formatNumber(reward.target)"
          />
        </q-timeline>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>
