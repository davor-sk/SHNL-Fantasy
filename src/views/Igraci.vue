<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import MojaEkipa from "./MojaEkipa.vue";
import { useAuthStore } from "@/stores/auth.js";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const props = defineProps(["klub"]);
const igraci = ref([]);
const odabraniIgraci = ref([]);
const brojIgraca = ref(0);
const budzet = ref(0);
const mojaOdabranaEkipa = ref("");
let klubBrojac = ref("");
let brojacPozicija = ref("");

watch(
  user,
  async (u, prev) => {
    if (u && !prev) {
      await loadTeam(u.uid);
      console.log("korisnik:", u.uid);
      console.log("teamName:", mojaOdabranaEkipa.value?.teamName);
    }
  },
  { immediate: true }
);

async function loadTeam(uid) {
  const q = doc(db, "ekipe", uid);
  const snap = await getDoc(q);
  if (snap.exists()) {
    console.log("data:", snap.data());
    const data = snap.data();
    mojaOdabranaEkipa.value = {
      id: snap.id,
      teamName: data.teamName,
      budzetUsed: data.budzetUsed,
      displayName: data.displayName,
      igraci: data.igraci,
      brojPozicija: data.brojPozicija,
      brojacKlubova: data.brojacKlubova,
    };
  } else {
    console.log("no data:");
    mojaOdabranaEkipa.value = null;
  }
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

onMounted(loadPlayers);

const filtriraniIgraci = computed(() =>
  igraci.value.filter((i) => i.klubId === props.klub)
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

klubBrojac = {
  dinamo: 0,
  hajduk: 0,
  rijeka: 0,
  istra: 0,
  lokomotiva: 0,
  gorica: 0,
  vukovar: 0,
  osijek: 0,
  slaven: 0,
  varazdin: 0,
};

brojacPozicija = {
  GK: 0,
  DEF: 0,
  MID: 0,
  FWD: 0,
};

function dodajIgraca(igrac) {
  const { klubId, cijena, pozicija } = igrac;
  const useSaved = Boolean(mojaOdabranaEkipa.value);
  console.log("saved", useSaved);

  if (pozicija in brojacPozicija) {
    if (pozicija == "GK" && brojacPozicija[pozicija] > 1) return;
    if (pozicija == "DEF" && brojacPozicija[pozicija] > 4) return;
    if (pozicija == "MID" && brojacPozicija[pozicija] > 4) return;
    if (pozicija == "FWD" && brojacPozicija[pozicija] > 2) return;
  }

  const postoji = odabraniIgraci.value.find((i) => i.id === igrac.id);
  const postojiMojaEkipa = mojaOdabranaEkipa.value?.igraci.find(
    (i) => i.id === igrac.id
  );

  if (postoji || postojiMojaEkipa) return;

  if (brojIgraca.value >= 15 || mojaOdabranaEkipa.value?.igraci.length >= 15)
    return;

  if (!useSaved) {
    if (klubId in klubBrojac) {
      if (klubBrojac[klubId] > 2) return;
      klubBrojac[klubId]++;
      console.log(`${klubId} =`, klubBrojac[klubId]);
    }
    brojIgraca.value++;
    brojacPozicija[pozicija]++;
    console.log(`${pozicija} =`, brojacPozicija[pozicija]);
    budzet.value = parseFloat((budzet.value + cijena).toFixed(1));
    console.log("broj:", brojIgraca.value);
    console.log("budzet:", budzet.value);
    odabraniIgraci.value.push(igrac);
  } else {
    if (klubId in klubBrojac) {
      if (mojaOdabranaEkipa.value.brojacKlubova[klubId] > 2) return;
      mojaOdabranaEkipa.value.brojacKlubova[klubId]++;
      console.log(`${klubId} =`, mojaOdabranaEkipa.value.brojacKlubova[klubId]);
    }
    mojaOdabranaEkipa.value.brojPozicija[pozicija]++;
    console.log(
      `${pozicija} =`,
      mojaOdabranaEkipa.value.brojPozicija[pozicija]
    );
    mojaOdabranaEkipa.value.budzetUsed = parseFloat(
      (mojaOdabranaEkipa.value.budzetUsed + cijena).toFixed(1)
    );
    mojaOdabranaEkipa.value.igraci.push(igrac);
  }
}

const currentList = computed(
  () => mojaOdabranaEkipa.value?.igraci ?? odabraniIgraci.value
);

function isIgracDodan(id) {
  return currentList.value.some((p) => p.id === id);
}

function ukloniIgraca(igrac) {
  console.log("igrac:", igrac);
  const indeks = odabraniIgraci.value.findIndex((i) => igrac.id === i.id);
  odabraniIgraci.value.splice(indeks, 1);
  const { klubId, cijena, pozicija } = igrac;
  klubBrojac[klubId]--;
  brojIgraca.value--;
  budzet.value = parseFloat((budzet.value - cijena).toFixed(1));
  brojacPozicija[pozicija]--;

  console.log(`${pozicija} =`, brojacPozicija[pozicija]);
  console.log("broj:", brojIgraca.value);
  console.log(`${klubId} =`, klubBrojac[klubId]);
  console.log("budzet:", budzet.value);
}

function ukloniOdabranogIgraca(igrac) {
  console.log("Odabraniigrac:", igrac.id);
  const indeks = mojaOdabranaEkipa.value.igraci.findIndex(
    (i) => igrac.id === i.id
  );
  mojaOdabranaEkipa.value.igraci.splice(indeks, 1);
  const { klubId, cijena, pozicija } = igrac;

  mojaOdabranaEkipa.value.brojacKlubova[klubId]--;
  mojaOdabranaEkipa.value.budzetUsed = parseFloat(
    (mojaOdabranaEkipa.value.budzetUsed - cijena).toFixed(1)
  );
  mojaOdabranaEkipa.value.brojPozicija[pozicija]--;

  console.log(`${pozicija} =`, mojaOdabranaEkipa.value.brojPozicija[pozicija]);
  console.log(`${klubId} =`, mojaOdabranaEkipa.value.brojacKlubova[klubId]);
  console.log("budzet:", mojaOdabranaEkipa.value.budzetUsed);
}
</script>

<template>
  <div class="flex flex-col md:flex-row w-full mx-auto gap-8">
    <div class="w-full md:w-1/2">
      <div v-if="klub" class="flex flex-col gap-4">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow"
        >
          <div class="overflow-x-auto">
            <table class="table-fixed min-w-full">
              <colgroup>
                <col class="w-1/2" />
                <col class="w-1/6" />
                <col class="w-1/6" />
                <col class="w-1/6" />
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
                <tr
                  v-for="i in golmani"
                  :key="i.id"
                  @click="!isIgracDodan(i.id) && dodajIgraca(i)"
                  :class="[
                    isIgracDodan(i.id)
                      ? 'cursor-not-allowed opacity-60 pointer-events-none'
                      : 'text-black cursor-pointer',
                  ]"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2">
                    <span class="font-medium text-gray-800">{{ i.ime }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right">{{ i.cijena }}M €</td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
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
                <col class="w-1/2" />
                <col class="w-1/6" />
                <col class="w-1/6" />
                <col class="w-1/6" />
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
                <tr
                  v-for="i in obrana"
                  :key="i.id"
                  @click="!isIgracDodan(i.id) && dodajIgraca(i)"
                  :class="[
                    isIgracDodan(i.id)
                      ? 'cursor-not-allowed opacity-60 pointer-events-none'
                      : 'text-black cursor-pointer',
                  ]"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2">
                    <span class="font-medium text-gray-800">{{ i.ime }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right">{{ i.cijena }}M €</td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
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
                <col class="w-1/2" />
                <col class="w-1/6" />
                <col class="w-1/6" />
                <col class="w-1/6" />
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
                <tr
                  v-for="i in vezni"
                  :key="i.id"
                  @click="!isIgracDodan(i.id) && dodajIgraca(i)"
                  :class="[
                    isIgracDodan(i.id)
                      ? 'cursor-not-allowed opacity-60 pointer-events-none'
                      : 'text-black cursor-pointer',
                  ]"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2">
                    <span class="font-medium text-gray-800">{{ i.ime }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right">{{ i.cijena }}M €</td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
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
                <col class="w-1/2" />
                <col class="w-1/6" />
                <col class="w-1/6" />
                <col class="w-1/6" />
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
                <tr
                  v-for="i in napad"
                  :key="i.id"
                  @click="!isIgracDodan(i.id) && dodajIgraca(i)"
                  :class="[
                    isIgracDodan(i.id)
                      ? 'cursor-not-allowed opacity-60 pointer-events-none'
                      : 'text-black cursor-pointer',
                  ]"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2">
                    <span class="font-medium text-gray-800">{{ i.ime }}</span>
                  </td>
                  <td class="px-4 py-2">
                    <span
                      class="items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                    >
                      {{ i.pozicija }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-right">{{ i.cijena }}M €</td>
                  <td class="px-4 py-2 text-right">
                    {{ i.bodovi }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full md:w-1/2 min-w-0">
      <MojaEkipa
        :moja-odabrana-ekipa="mojaOdabranaEkipa"
        :odabrani-igraci="odabraniIgraci"
        :broj-igraca="brojIgraca"
        :budzet="budzet"
        :klub-brojac="klubBrojac"
        :brojac-pozicija="brojacPozicija"
        @ukloni-igraca="ukloniIgraca"
        @ukloni-odabranog-igraca="ukloniOdabranogIgraca"
      />
    </div>
  </div>
</template>
