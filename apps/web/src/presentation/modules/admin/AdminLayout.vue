<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />

    <div class="flex flex-1 pt-16">
      <AdminSidebar />
      <main id="contenu" class="min-w-0 flex-1 px-4 py-8 pb-24 sm:px-6 lg:py-10 lg:pb-10">
        <RouterView />
      </main>
    </div>
  </div>
</template>


<script setup>
import { RouterView } from 'vue-router';
import NavBar from '@/presentation/components/NavBar.vue';
import AdminSidebar from '@/presentation/modules/admin/components/AdminSidebar.vue';
</script>

