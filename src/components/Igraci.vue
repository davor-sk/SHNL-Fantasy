<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import MojaEkipa from "./MojaEkipa.vue";

const props = defineProps(["klub"]);
const igraci = ref([]);
const odabraniIgraci = ref([{}]);

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

const klubBrojac = {
  dinamo: 0,
  hajduk: 0,
  rijeka: 0,
  iIstra: 0,
  lokomotiva: 0,
  gorica: 0,
  vukovar: 0,
  osijek: 0,
  slaven: 0,
  varaždin: 0,
};
function dodajIgraca(igrac) {
  const { klubId } = igrac;

  if (klubId in klubBrojac) {
    if (klubBrojac[klubId] > 2) return;
    klubBrojac[klubId]++;
    console.log(`${klubId} =`, klubBrojac[klubId]);
  }
  if (klubBrojac[klubId] > 3) return;

  const postoji = odabraniIgraci.value.find((i) => i.id === igrac.id);
  if (postoji) return;
  odabraniIgraci.value.push(igrac);
}
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center gap-2 mt-2 p-4">
    <MojaEkipa :odabrani-igraci="odabraniIgraci">
      <div v-if="klub" class="flex flex-col gap-2">
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'GK'"
              @click="dodajIgraca(i)"
              class="cursor-pointer"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
            >
          </li>
        </ol>
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'DEF'"
              @click="dodajIgraca(i)"
              class="cursor-pointer"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
            >
          </li>
        </ol>
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'MID'"
              @click="dodajIgraca(i)"
              class="cursor-pointer"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
            >
          </li>
        </ol>
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'FWD'"
              @click="dodajIgraca(i)"
              class="cursor-pointer"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M €</span
            >
          </li>
        </ol>
      </div>
    </MojaEkipa>
  </div>
</template>
