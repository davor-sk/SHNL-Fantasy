<script setup>
import { ref, onMounted, computed } from "vue";
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

const golmani = computed(() =>
  filtriraniIgraci.value.filter((i) => i.pozicija === "GK")
);

const obrana = computed(() =>
  filtriraniIgraci.value.filter((i) => i.pozicija === "DEF")
);

const vezni = computed(() =>
  filtriraniIgraci.value.filter((i) => i.pozicija === "MID")
);

const napad = computed(() =>
  filtriraniIgraci.value.filter((i) => i.pozicija === "FWD")
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
  alert("Bodovi uspješno dodani!");
}

console.log("filer:", filtriraniIgraci.value);
</script>

<template>
  <div class="min-h-screen flex flex-col items-center gap-6 mt-2 p-6">
    <form @submit.prevent="spremiBodove">
      <h1 class="text-3xl font-bold text-gray-800 mb-3">Odaberite igrače</h1>
      <div class="w-full max-w-xl gap-2 mb-3">
        <select
          id="klub"
          v-model="klub"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option disabled value="">-- odaberi klub --</option>
          <option v-for="k in klubovi" :key="k.id" :value="k.id">
            {{ k.ime }}
          </option>
        </select>
      </div>
      <div v-if="klub" class="flex flex-col gap-4">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow"
        >
          <div class="overflow-x-auto">
            <table class="table-fixed min-w-full">
              <colgroup>
                <col class="w-[50%]" />
                <col class="w-[10%]" />
                <col class="w-[16%]" />
                <col class="w-[12%]" />
                <col class="w-[12%]" />
              </colgroup>
              <thead class="bg-gray-50">
                <tr class="text-xs font-semibold text-gray-600">
                  <th class="px-4 py-3 text-left">IME</th>
                  <th class="px-4 py-3 text-left">POZ</th>
                  <th class="px-4 py-3 text-right">CIJENA</th>
                  <th class="px-4 py-3 text-right">BODOVI</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="i in golmani" :key="i.id">
                  <td class="px-4 py-2">
                    <span class="font-medium text-gray-800 whitespace-nowrap">{{
                      i.ime
                    }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right text-sm whitespace-nowrap">
                    {{ i.cijena }}M €
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model="bodovi[i.id]"
                      class="border rounded p-2 bg-white"
                      type="number"
                      placeholder="Unesite bodove"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow"
        >
          <div class="overflow-x-auto">
            <table class="table-fixed min-w-full">
              <colgroup>
                <col class="w-[50%]" />
                <col class="w-[10%]" />
                <col class="w-[16%]" />
                <col class="w-[12%]" />
                <col class="w-[12%]" />
              </colgroup>
              <thead class="bg-gray-50">
                <tr class="text-xs font-semibold text-gray-600">
                  <th class="px-4 py-3 text-left">IME</th>
                  <th class="px-4 py-3 text-left">POZ</th>
                  <th class="px-4 py-3 text-right">CIJENA</th>
                  <th class="px-4 py-3 text-right">BODOVI</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="i in obrana" :key="i.id">
                  <td class="px-4 py-2">
                    <span class="font-medium text-gray-800 whitespace-nowrap">{{
                      i.ime
                    }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right text-sm whitespace-nowrap">
                    {{ i.cijena }}M €
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model="bodovi[i.id]"
                      class="border rounded p-2 bg-white"
                      type="number"
                      placeholder="Unesite bodove"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow"
        >
          <div class="overflow-x-auto">
            <table class="table-fixed min-w-full">
              <colgroup>
                <col class="w-[50%]" />
                <col class="w-[10%]" />
                <col class="w-[16%]" />
                <col class="w-[12%]" />
                <col class="w-[12%]" />
              </colgroup>
              <thead class="bg-gray-50">
                <tr class="text-xs font-semibold text-gray-600">
                  <th class="px-4 py-3 text-left">IME</th>
                  <th class="px-4 py-3 text-left">POZ</th>
                  <th class="px-4 py-3 text-right">CIJENA</th>
                  <th class="px-4 py-3 text-right">BODOVI</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="i in vezni" :key="i.id">
                  <td class="px-4 py-2">
                    <span class="font-medium text-gray-800 whitespace-nowrap">{{
                      i.ime
                    }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right text-sm whitespace-nowrap">
                    {{ i.cijena }}M €
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model="bodovi[i.id]"
                      class="border rounded p-2 bg-white"
                      type="number"
                      placeholder="Unesite bodove"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow"
        >
          <div class="overflow-x-auto">
            <table class="table-fixed min-w-full">
              <colgroup>
                <col class="w-[50%]" />
                <col class="w-[10%]" />
                <col class="w-[16%]" />
                <col class="w-[12%]" />
                <col class="w-[12%]" />
              </colgroup>
              <thead class="bg-gray-50">
                <tr class="text-xs font-semibold text-gray-600">
                  <th class="px-4 py-3 text-left">IME</th>
                  <th class="px-4 py-3 text-left">POZ</th>
                  <th class="px-4 py-3 text-right">CIJENA</th>
                  <th class="px-4 py-3 text-right">BODOVI</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="i in napad" :key="i.id">
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span class="font-medium text-gray-800">{{ i.ime }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right text-sm whitespace-nowrap">
                    {{ i.cijena }}M €
                  </td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model="bodovi[i.id]"
                      class="border rounded p-2 bg-white"
                      type="number"
                      placeholder="Unesite bodove"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="flex justify-center p-4">
        <button
          type="submit"
          class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Spremi bodove
        </button>
      </div>
    </form>
  </div>
</template>
