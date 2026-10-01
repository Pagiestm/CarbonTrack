<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <main class="flex-1">
      <MainSection />
      <FeaturesSection />
      <AdvantagesSection />
    </main>
    <Footer />
  </div>
</template>

<script>
import NavBar from '@/shared/components/NavBar.vue';
import MainSection from '@/features/home/components/MainSection.vue';
import FeaturesSection from '@/features/home/components/FeaturesSection.vue'
import AdvantagesSection from '@/features/home/components/AdvantagesSection.vue'
import Footer from '@/shared/components/AppFooter.vue'

export default {
  components: {
    NavBar,
    MainSection,
    FeaturesSection,
    AdvantagesSection,
    Footer
  }
}
</script>