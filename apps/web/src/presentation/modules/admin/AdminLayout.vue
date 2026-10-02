<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <NavBar />
    <div class="flex flex-1 pt-16">
      <AdminSidebar />
      <main class="min-w-0 flex-1 px-4 py-10 sm:px-6">
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
