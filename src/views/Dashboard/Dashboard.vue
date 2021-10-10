<script setup lang="ts">
import Farm from '@/components/Farm/Farm.vue'
import WorldTree from '@/components/WorldTree.vue'
</script>

<template>
  <div class="fit inline-block q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-4">
        <farm />
      </div>

      <div class="col-12 col-md-3">
        <world-tree />
      </div>
    </div>
  </div>
</template>
