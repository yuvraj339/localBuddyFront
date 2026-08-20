<template>
    <div class="flex gap-3">
        <div class="relative shrink-0">
            <img :src="helperAvatarSrc(chatUser.avatar_url)" :alt="chatUser.full_name" class="h-12 w-12 rounded-full object-cover" />
            <span v-if="unreadCount" class="absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-xs text-white">{{ unreadCount }}</span>
        </div>
        <div class="min-w-0 flex-1">
            <h3 class="truncate font-semibold text-gray-900">{{ chatUser.full_name }}</h3>
            <p class="truncate text-sm text-gray-600">{{ subtitle }}</p>
        </div>
    </div>
</template>

<script setup>
import { helperAvatarSrc } from "../utils/util";

defineProps({
    chatUser: { type: Object, required: true },
    subtitle: { type: String, default: "" },
    unreadCount: { type: Number, default: 0 },
});
</script>
