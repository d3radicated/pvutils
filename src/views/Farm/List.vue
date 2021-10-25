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
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <div v-for="(farm, _) in farms" :key="_" class="col-12 col-md-2">
        <card :farm="farm" @remove:crow="farmStore.fetchFarms" />
      </div>
    </div>
  </q-page>
</template>
