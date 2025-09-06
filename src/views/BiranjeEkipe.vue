<script setup>
import { ref, onMounted } from "vue";
import Igraci from "./Igraci.vue";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const { user, role } = useAuthStore();
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
    <div class="w-full flex justify-between">
      <div>
        <div class="w-full max-w-md flex flex-col gap-2">
          <label for="klub" class="text-black font-medium">Odaberi klub:</label>
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
        <Igraci :klub="klub" />
      </div>
    </div>
  </div>
</template>
