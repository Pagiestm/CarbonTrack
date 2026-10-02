<template>
  <div>
    <PageHeader
      eyebrow="Administration"
      title="Tableau de bord"
      subtitle="Projets créés et comptes ouverts sur l'année en cours."
    />
    <div class="grid gap-6 xl:grid-cols-2">
      <ProjectsChart />
      <UserChart />
    </div>
  </div>
</template>

<script setup>
import ProjectsChart from '@/features/admin/components/ProjectsChart.vue';
import UserChart from '@/features/admin/components/UserChart.vue';
import PageHeader from '@/shared/ui/PageHeader.vue';
</script>
