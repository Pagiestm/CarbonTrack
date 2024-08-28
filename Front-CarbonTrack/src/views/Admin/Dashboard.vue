<template>
    <main class="md:flex-1 xl:p-4">
        <h1 class="text-3xl font-bold mb-6 text-center text-customGreen">Tableau de Bord Administrateur</h1>
        <p class="text-lg mb-6 text-center">Bienvenue sur le tableau de bord administrateur. Ici, vous pouvez visualiser les statistiques des projets et des utilisateurs inscrits.</p>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ProjectsChart />
            <UserChart />
        </div>
    </main>
</template>

<script setup>
import ProjectsChart from '../../components/Admin/ProjectsChart.vue';
import UserChart from '../../components/Admin/UserChart.vue';
</script>