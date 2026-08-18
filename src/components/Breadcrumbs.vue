<template>
    <nav class="flex" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li v-for="(item, index) in props.items" :key="index" class="inline-flex items-center">
                <!-- Separator (hidden for the first item) -->
                <span v-if="index > 0" class="mx-2 text-gray-400">/</span>

                <!-- Breadcrumb link or active text -->
                <component :is="item.to && index < items.length - 1 ? 'router-link' : 'span'" :to="item.to" :class="[
                    'inline-flex items-center text-sm font-medium',
                    index === items.length - 1
                        ? 'text-gray-500 cursor-default'
                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'
                ]">
                    <!-- Optional Icon slot/prop -->
                    <svg v-if="item.icon && index === 0" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {{ item.label }}
                </component>
            </li>
        </ol>
    </nav>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true,
        // Example structure: [{ label: 'Home', to: '/' }, { label: 'Settings' }]
    }
})
</script>