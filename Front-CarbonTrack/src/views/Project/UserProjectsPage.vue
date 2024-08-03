<template>
    <div>
        <h1>Mes Projets</h1>
        <ul>
            <li v-for="project in projects" :key="project.id">
                {{ project.name }} - {{ project.description }}
            </li>
        </ul>
    </div>
</template>

<script>
import { getProjects } from '../../services/projectsService.js';

export default {
    name: 'UserProjectsPage',
    data() {
        return {
            projects: [],
        };
    },
    async created() {
        try {
            const userId = this.getUserId(); // Méthode pour obtenir l'ID utilisateur
            console.log('User ID:', userId); // Log de l'ID utilisateur
            const projects = await getProjects(userId);
            console.log('Projects:', projects); // Log des projets récupérés
            this.projects = projects;
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error);
        }
    },
    methods: {
        getUserId() {
            // Implémentez la logique pour obtenir l'ID utilisateur
            // Par exemple, à partir du token JWT ou du localStorage
            return localStorage.getItem('userId');
        }
    }
};
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
