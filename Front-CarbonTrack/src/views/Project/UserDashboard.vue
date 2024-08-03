<template>
    <NavBar />
    <section class="w-full py-24 lg:py-32 bg-secondary flex justify-center items-center">
      <div class="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12 justify-center items-center">
        <ProjectsList />
        <div class="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square">
          <img
            src="https://images.unsplash.com/photo-1505235687559-28b5f54645b7?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width="550"
            height="550"
            alt="Projects"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
    <section class="w-full py-12 bg-gray-100">
      <div class="container px-4 md:px-6">
        <RecentProjects />
        <Recommendations />
      </div>
    </section>
    <Footer />
  </template>
  
  <script setup>
  import NavBar from '../../components/NavBar.vue';
  import Footer from '../../components/Footer.vue';
  import ProjectsList from '../../components/Project/ProjectsList.vue';
  </script>
  
