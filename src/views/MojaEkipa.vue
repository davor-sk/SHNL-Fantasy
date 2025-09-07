<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth.js";
import { ref } from "vue";
import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const teamName = ref("");

const props = defineProps([
  "odabraniIgraci",
  "brojIgraca",
  "budzet",
  "mojaOdabranaEkipa",
  "brojacPozicija",
  "klubBrojac",
]);

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
    await setDoc(doc(db, "ekipe", user.value.uid), {
      userid: user.value.uid,
      teamName: teamName.value,
      budzetUsed: props.budzet,
      igraci: props.odabraniIgraci,
      brojacKlubova: props.klubBrojac,
      brojPozicija: props.brojacPozicija,
      createdAt: serverTimestamp(),
    });

    alert("Ekipa je uspješno spremljena!");
    teamName.value = "";
  } catch (e) {
    console.error("Greška pri spremanju ekipe:", e);
    alert("Došlo je do pogreške. Pokušajte ponovno.");
  }
}

async function updateEkipu() {
  console.log("et ga", props.mojaOdabranaEkipa);

  if (!user) {
    alert("Morate biti prijavljeni kako biste spremili ekipu.");
    return;
  }
  if (props.mojaOdabranaEkipa.igraci.length != 15) {
    alert("Ekipa mora imati točno 15 igrača!");
    return;
  }
  if (props.mojaOdabranaEkipa.budzetUsed > 100) {
    alert("Premašili ste budžet!");
    return;
  }

  try {
    await updateDoc(doc(db, "ekipe", user.value.uid), {
      userid: user.value.uid,
      budzetUsed: props.mojaOdabranaEkipa.budzetUsed,
      igraci: props.mojaOdabranaEkipa.igraci,
      brojacKlubova: props.mojaOdabranaEkipa.brojacKlubova,
      brojPozicija: props.mojaOdabranaEkipa.brojPozicija,
      createdAt: serverTimestamp(),
    });

    alert("Ekipa je uspješno ažurirana!");
  } catch (e) {
    console.error("Greška pri ažuriranju ekipe:", e);
    alert("Došlo je do pogreške. Pokušajte ponovno.");
  }
}
</script>

<template>
  <div
    v-if="user"
    class="bg-white shadow p-4 rounded-xl text-gray-700 bg-[url(../assets/teren.png)] bg-center bg-cover h-screen overflow-hidden"
  >
    <div v-if="mojaOdabranaEkipa">
      <form
        class="flex flex-col gap-4 p-5"
        id="forma"
        @submit.prevent="updateEkipu"
      >
        <div class="flex items-center justify-between text-white mb-10">
          <p class="text-3xl font-semibold">
            {{ mojaOdabranaEkipa.teamName }}
          </p>
          <div class="flex items-center gap-2">
            <span
              class="rounded-full px-3 py-2 text-s font-medium"
              :class="
                mojaOdabranaEkipa.igraci.length === 15
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-50 text-gray-700'
              "
            >
              {{ mojaOdabranaEkipa.igraci.length }} / 15
            </span>
            <span
              class="rounded-full px-3 py-2 text-s font-medium"
              :class="
                mojaOdabranaEkipa.budzetUsed > 100
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              "
            >
              {{ mojaOdabranaEkipa.budzetUsed }} / 100M €
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-10 mb-20">
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in mojaOdabranaEkipa.igraci.filter(
                (i) => i.pozicija === 'GK'
              )"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniOdabranogIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-blue-50 text-blue-600 text-sm shadow hover:bg-blue-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in mojaOdabranaEkipa.igraci.filter(
                (i) => i.pozicija === 'DEF'
              )"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniOdabranogIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-green-50 text-green-600 text-sm shadow hover:bg-green-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in mojaOdabranaEkipa.igraci.filter(
                (i) => i.pozicija === 'MID'
              )"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniOdabranogIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-yellow-50 text-yellow-600 text-sm shadow hover:bg-yellow-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in mojaOdabranaEkipa.igraci.filter(
                (i) => i.pozicija === 'FWD'
              )"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniOdabranogIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-red-50 text-red-600 text-sm shadow hover:bg-red-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="
            mojaOdabranaEkipa.budzetUsed > 100 ||
            mojaOdabranaEkipa.igraci.length !== 15
          "
          class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Spremi ekipu
        </button>
      </form>
    </div>
    <div v-else>
      <form
        class="flex flex-col gap-4 p-5"
        id="forma"
        @submit.prevent="spremiEkipu"
      >
        <div class="flex items-center justify-between text-white mb-10">
          <input
            id="teamName"
            v-model="teamName"
            class="border rounded p-2 bg-white text-gray-700"
            type="text"
            placeholder="Unesite ime ekipe"
            required
          />
          <div class="flex items-center gap-2">
            <span
              class="rounded-full px-3 py-2 text-s font-medium"
              :class="
                brojIgraca === 15
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-50 text-gray-700'
              "
            >
              {{ brojIgraca }} / 15
            </span>
            <span
              class="rounded-full px-3 py-2 text-s font-medium"
              :class="
                budzet > 100
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              "
            >
              {{ budzet }} / 100M €
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-10 mb-20">
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in odabraniIgraci.filter((i) => i.pozicija === 'GK')"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-blue-50 text-blue-600 text-sm shadow hover:bg-blue-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in odabraniIgraci.filter((i) => i.pozicija === 'DEF')"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-green-50 text-green-600 text-sm shadow hover:bg-green-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in odabraniIgraci.filter((i) => i.pozicija === 'MID')"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-yellow-50 text-yellow-600 text-sm shadow hover:bg-yellow-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <div
              v-for="i in odabraniIgraci.filter((i) => i.pozicija === 'FWD')"
              :key="i.id"
            >
              <button
                type="button"
                @click="$emit('ukloniIgraca', i)"
                class="cursor-pointer px-3 py-2 rounded-full bg-red-50 text-red-600 text-sm shadow hover:bg-red-600 hover:text-white"
                title="Ukloni igrača"
              >
                {{ i.ime }} {{ i.cijena }}M
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          :disabled="budzet > 100 || brojIgraca !== 15 || !teamName"
          class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Spremi ekipu
        </button>
      </form>
    </div>
  </div>
</template>
