<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ token: string }>()

const farms = ref([])
</script>

<template>
  Farm
</template>
