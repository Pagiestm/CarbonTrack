<template>
    <div>
        <!-- Bouton burger visible uniquement sur mobile -->
        <button @click="toggleMenu" class="block md:hidden p-4">
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>

        <!-- Menu -->
        <aside :class="menuClasses"
            class="fixed inset-0 bg-white shadow-md md:relative md:w-56 md:block md:h-full transform transition-transform duration-300 ease-in-out z-50">
            <div class="p-4 flex justify-between items-center">
                <h1 class="text-xl font-bold">Administration</h1>
                <!-- Croix visible uniquement sur mobile -->
                <button @click="closeMenu" class="md:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            <nav>
                <ul>
                    <router-link to="/" @click="closeMenu"
                        :class="['flex items-center p-4 transition-all duration-200 hover:bg-gray-300', { 'bg-gray-200': isActive('/') }]">
                        <li class="flex items-center">
                            <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
                                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                            </svg>
                            Accueil
                        </li>
                    </router-link>
                    <router-link to="/admin/dashboard" @click="closeMenu"
                        :class="['flex items-center p-4 transition-all duration-200 hover:bg-gray-300', { 'bg-gray-200': isActive('/admin/dashboard') }]">
                        <li class="flex items-center">
                            <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
                                <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
                            </svg>
                            Dashboard
                        </li>
                    </router-link>
                    <router-link to="/admin/materials" @click="closeMenu"
                        :class="['flex items-center p-4 transition-all duration-200 hover:bg-gray-300', { 'bg-gray-200': isActive('/admin/materials') }]">
                        <li class="flex items-center">
                            <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
                                <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z" />
                            </svg>
                            Materiaux
                        </li>
                    </router-link>
                    <router-link to="/admin/categories" @click="closeMenu"
                        :class="['flex items-center p-4 transition-all duration-200 hover:bg-gray-300', { 'bg-gray-200': isActive('/admin/categories') }]">
                        <li class="flex items-center">
                            <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px">
                                <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
                            </svg>
                            Catégories
                        </li>
                    </router-link>
                </ul>
            </nav>
        </aside>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path) => {
    return route.path === path;
};

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

const menuClasses = computed(() => ({
    'transform translate-x-0': isMenuOpen.value,
    'transform -translate-x-full md:translate-x-0': !isMenuOpen.value,
}));
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