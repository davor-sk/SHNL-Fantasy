<script setup>
import { ref, computed } from "vue";

defineProps(["odabraniIgraci"]);
</script>

<template>
  <div class="h-full flex justify-center items-center gap-2 mt-2 p-4">
    <slot />
    <div class="flex flex-col">
      <span v-for="i in odabraniIgraci" :key="i.id">
        {{ i.ime }}
      </span>
    </div>
  </div>
</template>
