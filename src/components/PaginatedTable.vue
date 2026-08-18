<template>
    <div class="overflow-x-auto">
        <table class="w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th v-for="column in columns" :key="column.key"
                        :class="['px-6 py-3 text-left text-xs font-medium uppercase tracking-wider', column.sortable ? 'cursor-pointer text-gray-700 select-none' : 'text-gray-500']"
                        @click="column.sortable && $emit('sort', column.key)">
                        {{ column.label }}
                        <span v-if="column.sortable && sortBy === column.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="row in rows" :key="row.id">
                    <td v-for="column in columns" :key="column.key" class="px-6 py-4">
                        <slot :name="`cell-${column.key}`" :row="row">
                            {{ row[column.key] ?? '—' }}
                        </slot>
                    </td>
                </tr>
                <tr v-if="!loading && rows.length === 0">
                    <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">{{ emptyMessage }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="flex items-center justify-between mt-6 text-sm text-gray-600">
        <span>Showing {{ rangeStart }}–{{ rangeEnd }} of {{ total }} entries</span>
        <div class="flex items-center gap-3">
            <button class="px-3 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="page <= 1" @click="$emit('page-change', page - 1)">Previous</button>
            <span>Page {{ page }} of {{ totalPages }}</span>
            <button class="px-3 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="page >= totalPages" @click="$emit('page-change', page + 1)">Next</button>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    total: { type: Number, required: true },
    page: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    sortBy: { type: String, default: "" },
    sortOrder: { type: String, default: "asc" },
    loading: { type: Boolean, default: false },
    emptyMessage: { type: String, default: "No entries found." },
});

defineEmits(["sort", "page-change"]);

const rangeStart = computed(() => props.total ? (props.page - 1) * props.pageSize + 1 : 0);
const rangeEnd = computed(() => Math.min(props.page * props.pageSize, props.total));
</script>
