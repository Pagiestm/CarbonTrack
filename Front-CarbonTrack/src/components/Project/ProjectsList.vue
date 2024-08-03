<template>
    <div class="space-y-4 text-center lg:text-left">
      <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-customGreen mb-8">
        Mes Projets
      </h1>
      <div v-if="loading" class="text-light">Chargement des projets...</div>
      <div v-else-if="projects.length" class="grid gap-4">
        <div v-for="project in projects" :key="project.id" class="bg-primary p-4 rounded-lg">
          <h2 class="text-lg font-semibold text-light">{{ project.name }}</h2>
          <p class="text-light">{{ project.description }}</p>
        </div>
      </div>
      <div v-else class="text-light">Aucun projet trouvé.</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getProjects } from '../../services/projectsService';
  
  const projects = ref([]);
  const loading = ref(true);
  const errorMessage = ref('');
  
  onMounted(async () => {
    try {
      const userProjects = await getProjects();
      projects.value = userProjects;
    } catch (error) {
      errorMessage.value = 'Échec du chargement des projets';
    } finally {
      loading.value = false;
    }
  });
  </script>
  