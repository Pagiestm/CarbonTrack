<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />
    <main id="contenu" class="flex-1 pt-16">
      <HeroSection />
      <WhereSection />
      <ScaleSection />
      <EquivalenceSection />
      <StepsSection />
      <FeaturesSection />
      <CtaSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import NavBar from '@/presentation/components/NavBar.vue';
import AppFooter from '@/presentation/components/AppFooter.vue';
import HeroSection from '@/presentation/modules/home/components/HeroSection.vue';
import WhereSection from '@/presentation/modules/home/components/WhereSection.vue';
import ScaleSection from '@/presentation/modules/home/components/ScaleSection.vue';
import EquivalenceSection from '@/presentation/modules/home/components/EquivalenceSection.vue';
import StepsSection from '@/presentation/modules/home/components/StepsSection.vue';
import FeaturesSection from '@/presentation/modules/home/components/FeaturesSection.vue';
import CtaSection from '@/presentation/modules/home/components/CtaSection.vue';
</script>
