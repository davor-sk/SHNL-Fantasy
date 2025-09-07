<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const authStore = useAuthStore();
const { user, role } = storeToRefs(authStore);
console.log("user je koji", role);

const displayName = computed(
  () => user.value?.displayName || user.value?.email || ""
);

const logout = async () => {
  await authStore.logout();
  router.push("/");
};
</script>

<template>
  <div
    class="bg-gradient-to-r from-red-700 via-white to-blue-800 py-5 px-4 shadow-md h-32 flex justify-between items-center font-bold"
  >
    <h1 class="text-3xl text-white font-bold">SHNL Fantasy</h1>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <span v-if="!role || role == 'user'">
        <RouterLink to="/biranje-ekipe">Biranje ekipe</RouterLink>
        <span v-if="!user">
          <RouterLink to="/registracija">Registracija</RouterLink>
          <RouterLink to="/prijava">Prijava</RouterLink>
        </span>
        <span v-else-if="user">
          <span class="text-white px-3 border-s">{{ displayName }}</span>

          <button
            @click="logout"
            class="text-white hover:text-black cursor-pointer border-s ps-3"
          >
            Odjavi se
          </button>
        </span>
      </span>
      <span v-else-if="user && role === 'admin'">
        <RouterLink to="/admin">Dodavanje bodova</RouterLink>
        <span class="text-white px-3 border-s">{{ displayName }}</span>

        <button
          @click="logout"
          class="text-white hover:text-black cursor-pointer border-s ps-3"
        >
          Odjavi se
        </button>
      </span>
    </nav>
  </div>
  <div
    class="p-6 mih-h-screen bg-[url(../assets/bg_image.jpg)] bg-center bg-cover"
  >
    <RouterView />
  </div>
</template>

<style scoped>
a.router-link-exact-active {
  color: red;
}
a {
  color: white;
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid white;
}
</style>
