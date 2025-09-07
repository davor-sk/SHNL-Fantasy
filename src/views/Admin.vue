<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useAuthStore } from "@/stores/auth.js";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const props = defineProps(["klub"]);
const igraci = ref([]);
const bodovi = ref({});
const klubovi = ref([]);

const klub = ref("");

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
    const bodovi = pod.Bodovi;
    return {
      id: i.id,
      ime,
      pozicija,
      klub,
      klubId,
      cijena,
      bodovi,
    };
  });
}
onMounted(loadClubs);
onMounted(loadPlayers);

const filtriraniIgraci = computed(() =>
  igraci.value.filter((i) => i.klubId === klub.value)
);

async function spremiBodove() {
  const batch = writeBatch(db);

  for (const [id, val] of Object.entries(bodovi.value)) {
    if (typeof val !== "number" || !Number.isFinite(val) || val === 0) continue;
    const q = doc(db, "players", id);
    batch.update(q, {
      Bodovi: increment(val),
    });
  }
  await batch.commit();
}

console.log("filer:", filtriraniIgraci.value);
</script>

<template>
  <div
    class="flex justify-center items-center py-4 text-white min-h-screen flex-col lg:flex-row gap-8 px-8"
  >
    <form @submit.prevent="spremiBodove">
      <h1 class="text-3xl font-bold text-gray-800">Odaberite igrače</h1>
      <div class="w-full flex justify-between">
        <div>
          <div class="w-full max-w-md flex flex-col gap-2">
            <label for="klub" class="text-black font-medium"
              >Odaberi klub:</label
            >
            <select
              id="klub"
              v-model="klub"
              class="border rounded p-2 bg-gray-100 shadow-sm text-gray-700"
            >
              <option v-for="k in klubovi" :key="k.id" :value="k.id">
                {{ k.ime }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div v-if="klub" class="flex flex-col gap-4 w-136">
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'GK'"
              class="flex justify-between mb-2 items-center"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi }}
              <input
                v-model="bodovi[i.id]"
                class="border rounded p-2 bg-white"
                type="number"
                placeholder="Unesite bodove"
            /></span>
          </li>
        </ol>
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'DEF'"
              class="flex justify-between mb-2 items-center"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi
              }}<input
                v-model="bodovi[i.id]"
                class="border rounded p-2 bg-white"
                type="number"
                placeholder="Unesite bodove"
            /></span>
          </li>
        </ol>
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'MID'"
              class="flex justify-between mb-2 items-center"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi
              }}<input
                v-model="bodovi[i.id]"
                class="border rounded p-2 bg-white"
                type="number"
                placeholder="Unesite bodove"
            /></span>
          </li>
        </ol>
        <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
          <li v-for="i in filtriraniIgraci" :key="i.id">
            <span
              v-if="i.pozicija == 'FWD'"
              class="flex justify-between mb-2 items-center"
              >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi
              }}<input
                v-model="bodovi[i.id]"
                class="border rounded p-2 bg-white"
                type="number"
                placeholder="Unesite bodove"
            /></span>
          </li>
        </ol>
      </div>
      <div class="flex justify-center">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Spremi bodove
        </button>
      </div>
    </form>
  </div>
</template>
