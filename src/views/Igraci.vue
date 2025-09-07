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
  <div class="flex flex-col md:flex-row gap-8 pt-6">
    <div v-if="klub" class="flex flex-col gap-4 w-136">
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span
            v-if="i.pozicija == 'GK'"
            @click="!isIgracDodan(i.id) && dodajIgraca(i)"
            :class="[
              isIgracDodan(i.id)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-black cursor-pointer',
            ]"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi }}</span
          >
        </li>
      </ol>
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span
            v-if="i.pozicija == 'DEF'"
            @click="!isIgracDodan(i.id) && dodajIgraca(i)"
            :class="[
              isIgracDodan(i.id)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-black cursor-pointer',
            ]"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi }}</span
          >
        </li>
      </ol>
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span
            v-if="i.pozicija == 'MID'"
            @click="!isIgracDodan(i.id) && dodajIgraca(i)"
            :class="[
              isIgracDodan(i.id)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-black cursor-pointer',
            ]"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi }}</span
          >
        </li>
      </ol>
      <ol class="border bg-gray-100 p-4 rounded-lg text-gray-700">
        <li v-for="i in filtriraniIgraci" :key="i.id">
          <span
            v-if="i.pozicija == 'FWD'"
            @click="!isIgracDodan(i.id) && dodajIgraca(i)"
            :class="[
              isIgracDodan(i.id)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-black cursor-pointer',
            ]"
            >{{ i.ime }} {{ i.pozicija }} {{ i.cijena }}M € {{ i.bodovi }}</span
          >
        </li>
      </ol>
    </div>
    <div class="w-full md:w-1/2">
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
