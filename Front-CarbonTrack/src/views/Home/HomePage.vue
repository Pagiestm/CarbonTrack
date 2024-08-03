<template>
  <div class="flex flex-col min-h-screen ">
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
import NavBar from '../../components/NavBar.vue';
import MainSection from '../../components/Home/MainSection.vue';
import FeaturesSection from '../../components/Home/FeaturesSection.vue'
import AdvantagesSection from '../../components/Home/AdvantagesSection.vue'
import Footer from '../../components/Footer.vue'

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