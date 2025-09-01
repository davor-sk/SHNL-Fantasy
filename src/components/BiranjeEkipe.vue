<script setup>
import { ref, onMounted } from "vue";
import Igraci from "./Igraci.vue";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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
    <Igraci :klub="klub" />
  </div>
</template>
