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
  <div class="flex justify-center items-center h-screen mt-4">
    <form @submit.prevent="register">
      <div class="flex flex-col gap-1 w-96">
        <h2 class="text-xl font-bold mb-2">Registracija</h2>
        <input
          v-model="email"
          class="border rounded p-2 bg-white"
          type="email"
          placeholder="Unesite mail adresu"
        />
        <input
          v-model="displayName"
          class="border rounded p-2 bg-white"
          type="text"
          placeholder="Unesite korisničko ime"
        />
        <input
          v-model="password"
          class="border rounded p-2 bg-white"
          type="password"
          placeholder="Unesite lozinku"
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
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Registriraj se
        </button>
        <p :class="response.error ? 'text-rose-600' : 'text-emerald-600'">
          {{ response.message }}
        </p>
      </div>
    </form>
  </div>
</template>
