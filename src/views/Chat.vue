<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                <p class="text-gray-600">Chat with helpers and customers</p>
            </div>

            <div class="card p-0 overflow-hidden" style="height: 70vh">
                <div class="grid grid-cols-3 h-full">
                    <div
                        class="col-span-1 border-r border-gray-200 overflow-y-auto"
                    >
                        <div class="p-4 border-b border-gray-200">
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                class="input"
                            />
                        </div>
                        <div
                            v-if="helper"
                            :class="[
                                'p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 bg-primary-50',
                            ]"
                        >
                            <div
                                class="flex items-start space-x-3"
                                @click="selectChat({ id: helper.id })"
                            >
                                <div class="relative">
                                    <img
                                        :src="helperAvatarSrc(helper.avatar)"
                                        :alt="helper.name"
                                        class="w-12 h-12 rounded-full object-cover"
                                    />
                                    <!-- <span
                                        v-if="chat.unread > 0"
                                        class="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {{ chat.unread }}
                                    </span> -->
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="flex justify-between items-start"
                                    >
                                        <h4
                                            class="font-semibold text-gray-900 truncate"
                                        >
                                            {{ helper.name }}
                                        </h4>
                                        <span class="text-xs text-gray-500">{{
                                            formattedDate(now)
                                        }}</span>
                                    </div>
                                    <p class="text-sm text-gray-600 truncate">
                                        Start discusstion..
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="chats.length === 0" class="p-8 text-center">
                            <div class="text-6xl mb-4">💬</div>
                            <div class="text-gray-600">No messages yet</div>
                        </div>

                        <div
                            v-for="chat in chats"
                            :key="chat.chat_user.id"
                            @click="selectChat(chat)"
                            :class="[
                                'p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50',
                                selectedChat?.id === chat.chat_user.id
                                    ? 'bg-primary-50'
                                    : '',
                            ]"
                        >
                            <div class="flex items-start space-x-3">
                                <div class="relative">
                                    <img
                                        :src="
                                            helperAvatarSrc(
                                                chat.chat_user.avatar_url
                                            )
                                        "
                                        :alt="chat.chat_user.full_name"
                                        class="w-12 h-12 rounded-full object-cover"
                                    />
                                    <span
                                        v-if="chat.unread_count > 0"
                                        class="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {{ chat.unread_count }}
                                    </span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="flex justify-between items-start"
                                    >
                                        <h4
                                            class="font-semibold text-gray-900 truncate"
                                        >
                                            {{ chat.chat_user.full_name }}
                                        </h4>

                                        <span class="text-xs text-gray-500">
                                            <i class="capitalize">
                                                ({{ chat.status }})
                                            </i>
                                            {{
                                                formattedDate(chat.timestamp)
                                            }}</span
                                        >
                                    </div>
                                    <p class="text-sm text-gray-600 truncate">
                                        {{ chat.last_message }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- {{ selectedChat }} -->
                    <div class="col-span-2 flex flex-col h-full">
                        <div
                            v-if="!selectedChat"
                            class="flex-1 flex items-center justify-center"
                        >
                            <div class="text-center">
                                <div class="text-6xl mb-4">💬</div>
                                <div class="text-xl text-gray-600">
                                    Select a conversation
                                </div>
                                <p class="text-gray-500">
                                    Choose a chat to start messaging
                                </p>
                            </div>
                        </div>

                        <template v-else>
                            <div class="p-4 border-b border-gray-200 bg-white">
                                <div class="flex items-center space-x-3">
                                    <img
                                        :src="
                                            helperAvatarSrc(
                                                selectedChat.avatar_url
                                            )
                                        "
                                        :alt="selectedChat.full_name"
                                        class="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 class="font-semibold text-gray-900">
                                            {{ selectedChat.full_name }}
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            Active now
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="flex-1 overflow-y-auto p-4 bg-gray-50 max-h-96"
                            >
                                <div class="space-y-4">
                                    <div
                                        v-for="message in selectedChat.messages"
                                        :key="message.id"
                                        :class="[
                                            'flex',
                                            message.sender_id ==
                                            authStore?.user?.id
                                                ? 'justify-end'
                                                : 'justify-start',
                                        ]"
                                    >
                                        <div
                                            :class="[
                                                'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                                                message.sender_id ===
                                                authStore?.user?.id
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white text-gray-900 border border-gray-200',
                                            ]"
                                        >
                                            <p class="text-sm">
                                                {{ message.text }}
                                            </p>
                                            <p
                                                :class="[
                                                    'text-xs mt-1',
                                                    message.sender_id ===
                                                    authStore?.user?.id
                                                        ? 'text-primary-100'
                                                        : 'text-gray-500',
                                                ]"
                                            >
                                                {{
                                                    formattedDate(
                                                        message.timestamp
                                                    )
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="p-4 border-t border-gray-200 bg-white">
                            <form
                                @submit.prevent="sendMessage"
                                class="flex space-x-3"
                            >
                                <input
                                    v-model="newMessage"
                                    type="text"
                                    placeholder="Type a message..."
                                    class="input flex-1"
                                />
                                <button type="submit" class="btn btn-primary">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useChatStore } from "../stores/chat";
import { useHelperStore } from "../stores/helper";
import { useRoute } from "vue-router";
import { helperAvatarSrc } from "../utils/util";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const helperStore = useHelperStore();
const helper = computed(() => helperStore.currentHelper);
const chatStore = useChatStore();
const { chats, selectedChat, newMessage, notificationCount } =
    storeToRefs(chatStore);

// actions can be destructured normally
const {
    fetchChats,
    fetchMessages,
    sendMessage,
    selectChat,
    fetchNotifications,
} = chatStore;

let notificationInterval = null;

const startNotificationPolling = (interval) => {
    clearInterval(notificationInterval);
    notificationInterval = setInterval(() => {
        fetchNotifications();
    }, interval);
};
const route = useRoute();
// helperId.value = route.query.helper;
const now = new Date();
// formattedDate
const formattedDate = (date) => {
    const d = new Date(date);
    const today = new Date();

    const isToday = d.toDateString() === today.toDateString();

    return isToday
        ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
watch(chats, (val) => {
    console.log("Chats updated:", val);
});

onMounted(() => {
    fetchChats();
    startNotificationPolling(60000); // 1 minute interval
});

watch(
    () => route.query.helper,
    (newId) => {
        helperStore.fetchHelper(newId);
    },
    { immediate: true }
);

onUnmounted(() => {
    clearInterval(notificationInterval);
});

const handleVisibilityChange = () => {
    if (document.hidden) {
        startNotificationPolling(600000); // 10 minutes interval
    } else {
        startNotificationPolling(60000); // 1 minute interval
    }
};

document.addEventListener("visibilitychange", handleVisibilityChange);
</script>
