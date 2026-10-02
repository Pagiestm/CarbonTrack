<template>
  <div class="md:flex h-screen bg-surface">
    <NavBarAdmin />
    <main class="md:flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBarAdmin from '@/features/admin/components/NavBarAdmin.vue';
</script>
