<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />
    <!-- pt-16&nbsp;: la barre de navigation est fixe, le contenu passerait dessous. -->
    <main class="flex-1 pt-16">
      <MainSection />
      <FeaturesSection />
      <AdvantagesSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import NavBar from '@/shared/components/NavBar.vue';
import AppFooter from '@/shared/components/AppFooter.vue';
import MainSection from '@/features/home/components/MainSection.vue';
import FeaturesSection from '@/features/home/components/FeaturesSection.vue';
import AdvantagesSection from '@/features/home/components/AdvantagesSection.vue';
</script>
