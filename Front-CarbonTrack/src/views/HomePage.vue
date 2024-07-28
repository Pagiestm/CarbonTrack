<template>
    <NavBar />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-0 bg-gray-100 text-gray-800">
      <div class="p-6 text-center md:text-left flex items-center">
        <section>
          <span class="block text-6xl font-bold mb-1">Create the screens your</span>
          <div class="text-6xl text-blue-500 font-bold mb-3">visitors deserve to see</div>
          <p class="mt-0 mb-4 text-gray-700 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </section>
      </div>
      <div class="overflow-hidden">
        <img src="https://www.lumo-france.com/uploads/2024/02/developpement-durable-lumo.jpeg" alt="Image"
          class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
      </div>
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>