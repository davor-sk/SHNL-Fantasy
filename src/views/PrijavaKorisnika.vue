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
  <div class="flex justify-center items-center min-h-screen p-6">
    <div class="max-w-md bg-white rounded-2xl shadow-xl p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Prijava</h2>
      <form @submit.prevent="login">
        <div class="flex flex-col gap-2">
          <input
            v-model="email"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="email"
            placeholder="Unesite mail adresu"
            required
          />
          <input
            v-model="password"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="password"
            placeholder="Unesite lozinku"
            required
          />
          <button
            type="submit"
            class="rounded-lg py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Prijavi se
          </button>
          <span
            :class="response.error ? 'text-rose-600' : 'text-emerald-600'"
            >{{ response.message }}</span
          >
        </div>
      </form>
    </div>
  </div>
</template>
