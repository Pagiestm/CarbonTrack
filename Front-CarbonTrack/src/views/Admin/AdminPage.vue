<template>
    <div class="flex h-screen bg-gray-100">
        <NavBarAdmin />
        <main class="flex-1 p-6">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import NavBarAdmin from '../../components/Admin/NavBarAdmin.vue';
</script>