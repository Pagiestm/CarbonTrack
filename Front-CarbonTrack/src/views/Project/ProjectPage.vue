<template>
  <NavBar />
  <section class="w-full py-24 lg:py-32 bg-secondary">
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
  <Footer />
</template>

<script setup>
import NavBar from '../../components/NavBar.vue';
import Footer from '../../components/Footer.vue';
import ProjectsList from '../../components/Project/ProjectsList.vue';
import ProjectRecommendations from '../../components/Project/ProjectRecommendations.vue';
</script>