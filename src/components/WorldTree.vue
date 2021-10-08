<script setup lang="ts">
import { computed, watch } from 'vue'
import { useSessionStore } from '@/store/session'
import { useWorldTreeStore } from '@/store/worldTree'
import { formatNumber } from '@/helpers/number'

const sessionStore = useSessionStore()
const worldTreeStore = useWorldTreeStore()

const isLoggedIn = computed(() => sessionStore.isLoggedIn)
const rewards = computed(() => worldTreeStore.rewards)

watch(
  isLoggedIn,
  (value) => {
    if (value) {
      worldTreeStore.fetchWorldTreeData()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="q-pa-md">
    <q-card bordered>
      <q-expansion-item>
        <template #header>
          <q-item-section class="text-h6"> World Tree </q-item-section>

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
              :title="formatNumber(reward.target)"
              :subtitle="`R${reward.type}`"
              :color="
                ['finish', 'rewarded'].includes(reward.status)
                  ? 'positive'
                  : 'primary'
              "
            />
          </q-timeline>
        </q-card-section>
      </q-expansion-item>
    </q-card>
  </div>
</template>
