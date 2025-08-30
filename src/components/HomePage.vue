<script setup></script>

<template>
  <div
    class="bg-gradient-to-r from-red-700 via-white to-blue-800 py-5 px-4 shadow-md h-30 flex justify-between items-center"
  >
    <h1 class="text-5xl text-white font-bold">SHNL Fantasy</h1>
    <div class="flex gap-4">
      <button
        type="button"
        class="text-white text-2xl font-bold hover:text-gray-300 cursor-pointer"
      >
        Registracija
      </button>
      <button
        type="button"
        class="text-white text-2xl font-bold hover:text-gray-300 cursor-pointer"
      >
        Prijava
      </button>
    </div>
  </div>
  <div
    class="flex justify-center items-center py-4 text-white min-h-screen flex-col lg:flex-row gap-8 px-8"
  >
    <div class="w-full lg:w-1/3">
      <h3 class="text-2xl font-bold">Složi svoj savršeni tim SHNL-a!</h3>
      <h5 class="text-xl font-bold mb-3">
        Igraj Fantasy, izazovi prijatelje i pokaži nogometno znanje.
      </h5>
      <ol class="list-decimal ps-4 font-bold text-lg">
        <li>Registriraj se</li>
        <li>Odaberi omiljeni klub i ime ekipe</li>
        <li>Složi ekipu od 15 igrača (budžet 100M €)</li>
        <li>Maksimalno 3 igrača iz istog kluba</li>
      </ol>
    </div>
    <div class="flex justify-center w-full lg:w-1/2">
      <img src="../assets/naslovna.png" />
    </div>
  </div>
</template>

<style scoped></style>
