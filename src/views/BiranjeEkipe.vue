<script setup>
import { ref, onMounted } from "vue";
import Igraci from "./Igraci.vue";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth.js";

const { role } = useAuthStore();
console.log("role:", role);
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

onMounted(loadClubs);
</script>

<template>
  <div class="min-h-screen flex flex-col gap-6 mt-2 p-6">
    <h1 class="text-3xl font-bold text-gray-800">Odaberite igrače</h1>
    <div class="w-full max-w-xl gap-2">
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
    <Igraci :klub="klub" />
  </div>
</template>
