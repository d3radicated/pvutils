<script setup lang="ts">
import { computed, watch } from 'vue'
import { useSessionStore } from '@/store/session'
import { useFarmStore } from '@/store/farm'
import Card from './Card.vue'

const sessionStore = useSessionStore()
const farmStore = useFarmStore()

const farms = computed(() => farmStore.farms)
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
  <div class="q-pa-md">
    <div class="row q-gutter-md">
      <div v-for="farm in farms" :key="farm._id" class="col-12">
        <card :farm="farm" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.img--plant {
  height: 48px;
  width: auto;
}
</style>
