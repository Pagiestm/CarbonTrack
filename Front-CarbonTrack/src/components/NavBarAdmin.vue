<template>
    <aside class="w-64 bg-white shadow-md">
        <div class="p-4">
            <h1 class="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav>
            <ul>
                <li class="p-4 hover:bg-gray-200">
                    <router-link to="/">Home</router-link>
                </li>
                <li class="p-4 hover:bg-gray-200">
                    <router-link to="/admin">Dashboard</router-link>
                </li>
                <li class="p-4 hover:bg-gray-200">
                    <router-link to="/admin/materials">Materials</router-link>
                </li>
            </ul>
        </nav>
    </aside>
</template>