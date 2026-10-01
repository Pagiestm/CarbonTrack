<template>
    <ul class="text-sm mt-1">
        <li :class="{ 'text-customGreen': criteria.length, 'text-red-500': !criteria.length }">Au moins 8 caractères</li>
        <li :class="{ 'text-customGreen': criteria.uppercase, 'text-red-500': !criteria.uppercase }">Au moins une lettre majuscule</li>
        <li :class="{ 'text-customGreen': criteria.lowercase, 'text-red-500': !criteria.lowercase }">Au moins une lettre minuscule</li>
        <li :class="{ 'text-customGreen': criteria.number, 'text-red-500': !criteria.number }">Au moins un chiffre</li>
        <li :class="{ 'text-customGreen': criteria.symbol, 'text-red-500': !criteria.symbol }">Au moins un symbole</li>
    </ul>
</template>

<script setup>
const props = defineProps({
    criteria: Object
});
</script>