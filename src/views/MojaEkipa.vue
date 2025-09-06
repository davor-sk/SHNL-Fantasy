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
  <div>
    <slot />
    <div
      v-if="user"
      class="flex flex-col border bg-gray-100 p-4 rounded-lg text-gray-700"
    >
      <div v-if="mojaOdabranaEkipa">
        <form
          class="flex flex-col justify-center gap-2 mt-2 p-4"
          id="forma"
          @submit.prevent="updateEkipu"
        >
          <p class="font-bold text-2xl">{{ mojaOdabranaEkipa.teamName }}</p>
          <p
            class="text-l font-bold"
            :class="
              mojaOdabranaEkipa.budzetUsed > 100
                ? 'text-red-600 font-bold'
                : 'text-green-600'
            "
          >
            {{ mojaOdabranaEkipa.budzetUsed }} / 100M€
          </p>
          <p
            class="text-l font-bold"
            :class="
              mojaOdabranaEkipa.igraci.length === 15
                ? 'text-green-600'
                : 'text-gray-700'
            "
          >
            {{ mojaOdabranaEkipa.igraci.length }} / 15
          </p>
          <ul class="divide-y divide-gray-300 mt-2">
            <li
              v-for="i in mojaOdabranaEkipa.igraci"
              :key="i.id"
              class="flex justify-between items-center py-1"
            >
              <span>{{ i.ime }} ({{ i.pozicija }})</span>
              <button
                type="button"
                @click="$emit('ukloniOdabranogIgraca', i)"
                class="cursor-pointer"
                title="Ukloni igrača"
              >
                <span class="font-semibold text-red-700">X</span>
              </button>
            </li>
          </ul>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Spremi ekipu
          </button>
        </form>
      </div>
      <div
        class="flex flex-col border bg-gray-100 p-4 rounded-lg text-gray-700"
        v-else
      >
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
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Spremi ekipu
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
