<script setup>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase.js";

const email = ref("");
const password = ref("");
const response = ref({ error: false, message: "" });
const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    response.value.error = false;
    response.value.message =
      "Korisnik registriran: " + JSON.stringify(userCredential.user);
  } catch (error) {
    response.value.error = true;
    response.value.message = "Greška pri registraciji: " + error.message;
  }
};
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <form @submit.prevent="register">
      <h2 class="text-xl font-bold mb-4">Registracija</h2>
      <input
        v-model="email"
        class="border mb-2 px-2"
        type="email"
        placeholder="Unesite mail adresu"
      /><br />
      <input
        v-model="password"
        class="border mb-2 px-2"
        type="password"
        placeholder="Unesite lozinku"
      /><br />
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Registriraj se
      </button>
      <p :class="response.error ? 'text-rose-600' : 'text-emerald-600'">
        {{ response.message }}
      </p>
    </form>
  </div>
</template>
