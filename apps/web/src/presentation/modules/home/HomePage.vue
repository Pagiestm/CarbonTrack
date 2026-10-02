<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />
    <!-- pt-16 : la barre de navigation est fixe, le contenu passerait dessous. -->
    <main class="flex-1 pt-16">
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import NavBar from '@/presentation/components/NavBar.vue';
import AppFooter from '@/presentation/components/AppFooter.vue';
import HeroSection from '@/presentation/modules/home/components/HeroSection.vue';
import FeaturesSection from '@/presentation/modules/home/components/FeaturesSection.vue';
import StepsSection from '@/presentation/modules/home/components/StepsSection.vue';
</script>
