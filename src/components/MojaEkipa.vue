<script setup>
import { ref, computed } from "vue";

const props = defineProps(["odabraniIgraci"]);
</script>

<template>
  <div class="h-full flex justify-center items-center gap-2 mt-2 p-4">
    <slot />
    <div
      class="flex flex-col border bg-gray-100 p-4 rounded-lg text-gray-700"
      v-if="odabraniIgraci.length > 0"
    >
      <div v-for="i in odabraniIgraci" :key="i.id">
        {{ i.ime }}
        <button
          @click="$emit('ukloniIgraca', i)"
          class="text-red-600 font-bold cursor-pointer"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>
