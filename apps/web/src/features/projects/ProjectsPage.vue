<template>
  <NavBar />
  <section class="w-full py-24 lg:py-32 bg-secondary min-h-screen">
    <div class="container mx-auto px-4">
      <header class="mb-12 text-center lg:text-left">
        <h1 class="text-5xl font-bold text-light">Mes projets</h1>
        <p class="text-lg text-gray-300 mt-4">
          Vue d'ensemble de vos projets et recommandations personnalisées.
        </p>
      </header>
      <ProjectRecommendations />
      <ProjectsList />
    </div>
  </section>
  <AppFooter />
</template>

<script setup>
import NavBar from '@/shared/components/NavBar.vue';
import AppFooter from '@/shared/components/AppFooter.vue';
import ProjectsList from '@/features/projects/components/ProjectsList.vue';
import ProjectRecommendations from '@/features/projects/components/ProjectRecommendations.vue';
</script>
