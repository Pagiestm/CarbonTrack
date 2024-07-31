<template>
    <div class="p-4 space-y-2 rounded-lg bg-gray-200 dark:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            class="w-6 h-6 text-white">
            <path :d="icon" />
        </svg>
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">{{ title }}</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ description }}</p>
    </div>
</template>

<script>
export default {
    name: 'AdvantageCard',
    props: {
        icon: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
}
</script>