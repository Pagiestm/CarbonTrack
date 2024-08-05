<template>
    <div>
        <!-- Bouton burger visible uniquement sur mobile -->
        <button @click="toggleMenu" class="block md:hidden p-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
        </button>
        <!-- Menu -->
        <aside :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="fixed inset-0 bg-white shadow-md md:relative md:w-56 md:block md:h-full">
            <div class="p-4">
                <h1 class="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav>
                <ul>
                    <li class="p-4 hover:bg-gray-200">
                        <router-link to="/" @click="closeMenu">Home</router-link>
                    </li>
                    <li class="p-4 hover:bg-gray-200">
                        <router-link to="/admin" @click="closeMenu">Dashboard</router-link>
                    </li>
                    <li class="p-4 hover:bg-gray-200">
                        <router-link to="/admin/materials" @click="closeMenu">Materials</router-link>
                    </li>
                </ul>
            </nav>
        </aside>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isMenuOpen: false
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu() {
            this.isMenuOpen = false;
        }
    }
};
</script>

<style scoped>
@media (max-width: 640px) {
    aside {
        width: 100%;
        height: 100%;
        z-index: 50;
    }
}
</style>