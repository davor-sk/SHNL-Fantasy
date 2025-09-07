<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase.js";
import { useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";

const router = useRouter();
const email = ref("");
const password = ref("");
const response = ref({ error: false, message: "" });
const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const snap = await getDoc(doc(db, "users", userCredential.user.uid));
    const role = snap.exists() ? snap.data().role : "prazno";
    console.log("rola je:", role);
    if (role == "user") {
      router.push({ path: "/biranje-ekipe" });
    } else if (role == "admin") {
      router.push({ path: "/admin" });
    }

    response.value.error = false;
    response.value.message =
      "Korisnik prijavljen: " + JSON.stringify(userCredential.user);
  } catch (error) {
    response.value.error = true;
    response.value.message = "Greška pri prijavi!";
  }
};
</script>
<template>
  <div class="flex justify-center items-center h-screen mt-4">
    <form @submit.prevent="login">
      <div class="flex flex-col gap-1 w-96">
        <h2 class="text-xl font-bold mb-2">Prijava</h2>
        <input
          v-model="email"
          class="border rounded p-2 bg-white"
          type="email"
          placeholder="Unesite mail adresu"
        />
        <input
          v-model="password"
          class="border rounded p-2 bg-white"
          type="password"
          placeholder="Unesite lozinku"
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Prijavi se
        </button>
        <span :class="response.error ? 'text-rose-600' : 'text-emerald-600'">{{
          response.message
        }}</span>
      </div>
    </form>
  </div>
</template>
