<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const props = defineProps(["klub"]);
const igraci = ref([]);

async function loadPlayers() {
  const q = query(collection(db, "players"), orderBy("Pozicija"));
  const snap = await getDocs(q);
  igraci.value = snap.docs.map((i) => {
    const pod = i.data();
    const ime = pod.Ime;
    const pozicija = pod.Pozicija;
    const klub = pod.Klub;
    const klubId = pod.KlubID;
    const cijena = pod.Cijena;
    return {
      id: i.id,
      ime,
      pozicija,
      klub,
      klubId,
      cijena,
    };
  });
}

onMounted(loadPlayers);

console.log(igraci);

const filtriraniIgraci = computed(() =>
  igraci.value.filter((i) => i.klubId === props.klub)
);
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center gap-2 mt-2 p-4">
    <div v-if="props.klub" class="flex flex-col gap-2">
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span v-if="i.pozicija == 'GK'" @click="console.log(i.ime)"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
          >
        </li>
      </ol>
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span v-if="i.pozicija == 'DEF'" @click="console.log(i.ime)"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
          >
        </li>
      </ol>
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span v-if="i.pozicija == 'MID'" @click="console.log(i.ime)"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
          >
        </li>
      </ol>
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span v-if="i.pozicija == 'FWD'" @click="console.log(i.ime)"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
          >
        </li>
      </ol>
    </div>
  </div>
</template>
