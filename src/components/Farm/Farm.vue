<script setup lang="ts">
import { computed, watch } from 'vue'
import { useSessionStore } from '@/store/session'
import { useFarmStore } from '@/store/farm'
import Card from './Card.vue'

const sessionStore = useSessionStore()
const farmStore = useFarmStore()

const farms = computed(() => farmStore.farms)
const loading = computed(() => farmStore.loading)
const isLoggedIn = computed(() => sessionStore.isLoggedIn)

watch(
  isLoggedIn,
  (value) => {
    if (value) {
      farmStore.fetchFarms()
    } else {
      farmStore.clearFarms()
    }
  },
  { immediate: true }
)
</script>

<template>
  <q-card bordered>
    <q-linear-progress v-if="loading" indeterminate class="absolute" />

    <q-expansion-item>
      <template #header>
        <q-item-section>
          <div class="text-h6">Farms</div>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            round
            icon="mdi-refresh"
            @click.stop="farmStore.fetchFarms"
          />
        </q-item-section>
      </template>

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div v-for="farm in farms" :key="farm._id" class="col-12">
            <card :farm="farm" />
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<style scoped lang="scss">
.img--plant {
  height: 48px;
  width: auto;
}
</style>
