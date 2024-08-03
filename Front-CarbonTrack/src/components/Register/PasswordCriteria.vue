<template>
    <ul class="text-sm mt-1">
        <li :class="{'text-green-500': criteria.length, 'text-red-500': !criteria.length}">At least 8 characters</li>
        <li :class="{'text-green-500': criteria.uppercase, 'text-red-500': !criteria.uppercase}">At least one uppercase letter</li>
        <li :class="{'text-green-500': criteria.lowercase, 'text-red-500': !criteria.lowercase}">At least one lowercase letter</li>
        <li :class="{'text-green-500': criteria.number, 'text-red-500': !criteria.number}">At least one number</li>
        <li :class="{'text-green-500': criteria.symbol, 'text-red-500': !criteria.symbol}">At least one symbol</li>
    </ul>
</template>

<script setup>
const props = defineProps({
    criteria: Object
});
</script>