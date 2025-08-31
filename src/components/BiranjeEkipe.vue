<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const klubovi = ref([]);
const klub = ref("");
const igraci = ref([]);

async function loadClubs() {
  const q = query(collection(db, "clubs"), orderBy("Ime"));
  const snap = await getDocs(q);
  klubovi.value = snap.docs.map((d) => {
    const pod = d.data();
    const ime = pod.Ime;
    return {
      id: d.id,
      ime,
    };
  });
}

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

onMounted(loadClubs);
onMounted(loadPlayers);

console.log(igraci);

const filtriraniIgraci = computed(() =>
  igraci.value.filter((i) => i.klubId === klub.value)
);
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center gap-2 mt-2 p-4">
    <div class="flex justify-center">
      <select
        v-model="klub"
        class="border rounded p-1 w-53 bg-gray-100 text-gray-700"
      >
        <option v-for="k in klubovi" :key="k.id" :value="k.id">
          {{ k.ime }}
        </option>
      </select>
    </div>
    <div v-if="klub" class="flex flex-col gap-2">
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
