<script setup lang="ts">
import { computed, ref } from 'vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Farm from './components/Farm.vue';
import WorldTree from './components/WorldTree.vue';

const token = ref('');
const hasToken = computed(() => token.value !== '')
</script>

<template>
  <Farm :token="token" />
  <WorldTree :token="token" />
  
  <input v-model="token" type="text" />
  <div v-text="hasToken ? 'yay token' : 'oh hell nah'" />
</template>
