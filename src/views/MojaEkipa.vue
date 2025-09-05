<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { ref } from "vue";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const { user } = useAuthStore();
console.log("user", user);
const teamName = ref("");

const props = defineProps(["odabraniIgraci", "brojIgraca", "budzet"]);

async function spremiEkipu() {
  if (!user) {
    alert("Morate biti prijavljeni kako biste spremili ekipu.");
    return;
  }
  if (props.odabraniIgraci.length != 15) {
    alert("Ekipa mora imati točno 15 igrača!");
    return;
  }
  if (props.budzet > 100) {
    alert("Premašili ste budžet!");
    return;
  }

  try {
    await addDoc(collection(db, "ekipe"), {
      userid: user.uid,
      teamName: teamName.value,
      budzetUsed: props.budzet,
      igraci: props.odabraniIgraci,
      createdAt: serverTimestamp(),
    });

    alert("Ekipa je uspješno spremljena!");
    teamName.value = "";
  } catch (e) {
    console.error("Greška pri spremanju ekipe:", e);
    alert("Došlo je do pogreške. Pokušajte ponovno.");
  }
}
</script>

<template>
  <div>
    <slot />
    <form
      class="flex flex-col justify-center gap-2 mt-2 p-4"
      id="forma"
      @submit.prevent="spremiEkipu"
    >
      <input
        id="teamName"
        v-model="teamName"
        class="border rounded p-2 bg-white"
        type="text"
        placeholder="Unesite ime ekipe"
        required
      />
      <div
        class="flex flex-col border bg-gray-100 p-4 rounded-lg text-gray-700"
        v-if="odabraniIgraci.length > 0"
      >
        <span :class="brojIgraca === 15 ? 'text-green-600' : 'text-gray-700'">
          {{ brojIgraca }}/15 igrača
        </span>
        <span
          :class="budzet > 100 ? 'text-red-600 font-bold' : 'text-gray-700'"
        >
          {{ budzet }}/100M €
        </span>
        <ul class="divide-y divide-gray-300 mt-2">
          <li
            v-for="i in odabraniIgraci"
            :key="i.id"
            class="flex justify-between items-center py-1"
          >
            <span>{{ i.ime }} ({{ i.pozicija }})</span>
            <button
              @click="$emit('ukloniIgraca', i)"
              class="cursor-pointer"
              title="Ukloni igrača"
            >
              <span class="font-semibold text-red-700">X</span>
            </button>
          </li>
        </ul>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Spremi ekipu
      </button>
    </form>
  </div>
</template>
