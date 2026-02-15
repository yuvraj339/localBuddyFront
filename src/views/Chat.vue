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

                        <div v-if="chats.length === 0" class="p-8 text-center">
                            <div class="text-6xl mb-4">💬</div>
                            <div class="text-gray-600">No messages yet</div>
                        </div>

                        <div
                            v-for="chat in chats"
                            :key="chat.id"
                            @click="selectChat(chat)"
                            :class="[
                                'p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50',
                                selectedChat?.id === chat.id
                                    ? 'bg-primary-50'
                                    : '',
                            ]"
                        >
                            <div class="flex items-start space-x-3">
                                <div class="relative">
                                    <img
                                        :src="chat.helperAvatar"
                                        :alt="chat.helperName"
                                        class="w-12 h-12 rounded-full object-cover"
                                    />
                                    <span
                                        v-if="chat.unread > 0"
                                        class="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {{ chat.unread }}
                                    </span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="flex justify-between items-start"
                                    >
                                        <h4
                                            class="font-semibold text-gray-900 truncate"
                                        >
                                            {{ chat.helperName }}
                                        </h4>
                                        <span class="text-xs text-gray-500">{{
                                            formatTime(chat.timestamp)
                                        }}</span>
                                    </div>
                                    <p class="text-sm text-gray-600 truncate">
                                        {{ chat.lastMessage }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-2 flex flex-col">
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
                                        :src="selectedChat.helperAvatar"
                                        :alt="selectedChat.helperName"
                                        class="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 class="font-semibold text-gray-900">
                                            {{ selectedChat.helperName }}
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            Active now
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
                                <div class="space-y-4">
                                    <div
                                        v-for="message in selectedChat.messages"
                                        :key="message.id"
                                        :class="[
                                            'flex',
                                            message.senderId === 'customer'
                                                ? 'justify-end'
                                                : 'justify-start',
                                        ]"
                                    >
                                        <div
                                            :class="[
                                                'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                                                message.senderId === 'customer'
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
                                                    message.senderId ===
                                                    'customer'
                                                        ? 'text-primary-100'
                                                        : 'text-gray-500',
                                                ]"
                                            >
                                                {{
                                                    formatTime(
                                                        message.timestamp
                                                    )
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                    <button
                                        type="submit"
                                        class="btn btn-primary"
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "../services/api";

const chats = ref([]);
const selectedChat = ref(null);
const newMessage = ref("");

onMounted(async () => {
    const response = await api.getChats();
    if (response.success) {
        chats.value = response.data;
    }
});

const selectChat = (chat) => {
    selectedChat.value = chat;
    chat.unread = 0;
};

const sendMessage = () => {
    if (!newMessage.value.trim()) return;

    const message = {
        id: Date.now(),
        senderId: "customer",
        text: newMessage.value,
        timestamp: new Date().toISOString(),
    };

    selectedChat.value.messages.push(message);
    selectedChat.value.lastMessage = newMessage.value;
    selectedChat.value.timestamp = message.timestamp;

    newMessage.value = "";
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }
};
</script>
