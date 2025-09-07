<script setup>
import { ref } from "vue";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase.js";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const displayName = ref("");
const response = ref({ error: false, message: "" });

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email.value,
      displayName: displayName.value,
      role: "user",
    });

    await updateProfile(userCredential.user, {
      displayName: displayName.value,
    });

    router.push({ path: "/biranje-ekipe" });

    response.value.error = false;
    response.value.message = "Korisnik registriran!";
  } catch (error) {
    response.value.error = true;
    response.value.message = "Greška pri registraciji!";
  }
};

function minBrojZnakova() {
  return password.value.length >= 6;
}

function velikoSlovo() {
  return /[A-Z]/.test(password.value);
}

function specZnak() {
  return /[@#$%&!?*+-]/.test(password.value);
}

function broj() {
  return /[0-9]/.test(password.value);
}

function uvijeti() {
  let brojUvijeta = 0;
  if (minBrojZnakova()) brojUvijeta++;
  if (velikoSlovo()) brojUvijeta++;
  if (specZnak()) brojUvijeta++;
  if (broj()) brojUvijeta++;

  return brojUvijeta;
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-6">
    <div class="max-w-md bg-white rounded-2xl shadow-xl p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Registracija</h2>
      <p class="text-sm text-gray-500 mb-6">
        Kreiraj račun i uđi u SHNL Fantasy.
      </p>
      <form @submit.prevent="register">
        <div class="flex flex-col gap-2">
          <input
            v-model="email"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="email"
            placeholder="Unesite mail adresu"
            required
          />
          <input
            v-model="displayName"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            placeholder="Unesite korisničko ime"
            required
          />
          <input
            v-model="password"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="password"
            placeholder="Unesite lozinku"
            required
          />
          <span v-if="!minBrojZnakova()" class="text-red-600"
            >Lozinka treba imati barem 6 znakova!</span
          >
          <span v-if="!velikoSlovo()" class="text-red-600"
            >Lozinka treba sadržavati barem jedno veliko slovo!</span
          >
          <span v-if="!broj()" class="text-red-600"
            >Lozinka treba sadržavati barem jednu znamenku!</span
          >
          <span v-if="!specZnak()" class="text-red-600"
            >Lozinka treba sadržavati barem jedan specijalni znak!</span
          >
          <span v-if="uvijeti() == 4" class="text-green-600"
            >Lozinka je sigurna!</span
          >
          <button
            type="submit"
            class="rounded-lg py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Registriraj se
          </button>
          <p :class="response.error ? 'text-rose-600' : 'text-emerald-600'">
            {{ response.message }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
