<template>
  <div class="min-h-screen bg-gray-50 py-5 sm:py-8 lg:py-12"><div class="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
    <div class="mb-5 px-4 sm:mb-8 sm:px-0"><h1 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{{ t('chat.messagesTitle') }}</h1><p class="text-gray-600">{{ t('chat.chatSubtitle') }}</p></div>
    <div class="card h-[calc(100dvh-10rem)] min-h-[32rem] overflow-hidden rounded-none p-0 sm:h-[70vh] sm:rounded-xl"><div class="grid h-full md:grid-cols-3">
      <aside class="min-h-0 overflow-y-auto border-gray-200 md:border-r" :class="selectedChat ? 'hidden md:block' : 'block'">
        <div class="sticky top-0 z-10 border-b bg-white p-4"><input v-model="searchQuery" type="search" :placeholder="t('chat.searchConversations')" class="input" /></div>
        <button v-if="helper" type="button" class="w-full border-b p-4 text-left hover:bg-gray-50" @click="openChat({ chat_user: { id: helper.id, full_name: helper.name, avatar_url: helper.avatar } })"><ConversationRow :chat-user="{ id: helper.id, full_name: helper.name, avatar_url: helper.avatar }" :subtitle="t('chat.startConversation')" /></button>
        <p v-if="!helper && !filteredChats.length" class="p-8 text-center text-gray-600">{{ t('chat.noMessages') }}</p>
        <button v-for="chat in filteredChats" :key="chat.chat_user.id" type="button" class="w-full border-b p-4 text-left hover:bg-gray-50" :class="selectedChat?.id === chat.chat_user.id ? 'bg-primary-50' : ''" @click="openChat(chat)"><ConversationRow :chat-user="chat.chat_user" :subtitle="chat.last_message" :unread-count="chat.unread_count" /></button>
      </aside>
      <section class="min-h-0 flex flex-col md:col-span-2" :class="selectedChat ? 'flex' : 'hidden md:flex'">
        <div v-if="!selectedChat" class="flex flex-1 items-center justify-center p-6 text-center"><div><div class="mb-4 text-6xl">💬</div><div class="text-xl text-gray-600">{{ t('chat.selectConversation') }}</div><p class="mt-1 text-gray-500">{{ t('chat.chooseChatPrompt') }}</p></div></div>
        <template v-else>
          <header class="flex items-center gap-3 border-b bg-white p-3 sm:p-4"><button type="button" class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden" @click="selectedChat = null">←</button><img :src="helperAvatarSrc(selectedChat.avatar_url)" :alt="selectedChat.full_name" class="h-11 w-11 rounded-full object-cover" /><div class="min-w-0"><h2 class="truncate font-semibold">{{ selectedChat.full_name }}</h2><p class="text-sm text-gray-600">{{ t('chat.activeNow') }}</p></div></header>
          <div ref="messagesContainer" class="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4"><div class="space-y-4"><div v-for="message in selectedChat.messages || []" :key="message.id" class="flex" :class="message.sender_id === authStore.user?.id ? 'justify-end' : 'justify-start'"><div class="max-w-[85%] break-words rounded-lg px-4 py-2 sm:max-w-md" :class="message.sender_id === authStore.user?.id ? 'bg-primary-600 text-white' : 'border bg-white text-gray-900'"><p class="whitespace-pre-wrap text-sm">{{ message.text }}</p><p class="mt-1 text-xs opacity-70">{{ formattedDate(message.timestamp) }}</p></div></div></div></div>
          <form class="flex gap-2 border-t bg-white p-3 sm:p-4" @submit.prevent="handleSend"><input v-model="newMessage" type="text" :placeholder="t('chat.typeMessagePlaceholder')" class="input min-w-0 flex-1" /><button type="submit" :disabled="sending || !newMessage.trim()" class="btn btn-primary shrink-0 disabled:opacity-50">{{ sending ? t('chat.sendingBtn') : t('chat.sendBtn') }}</button></form>
        </template>
      </section>
    </div></div>
  </div></div>
</template>
<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../stores/chat'; import { useHelperStore } from '../stores/helper'; import { useRoute } from 'vue-router'; import { helperAvatarSrc } from '../utils/util'; import { useAuthStore } from '../stores/auth'; import { useI18n } from '../i18n';
import ConversationRow from '../components/ConversationRow.vue';
const { t } = useI18n(); const authStore = useAuthStore(); const chatStore = useChatStore(); const helperStore = useHelperStore(); const route = useRoute();
const { chats, selectedChat, newMessage } = storeToRefs(chatStore); const helper = computed(() => helperStore.currentHelper); const searchQuery = ref(''); const sending = ref(false); const messagesContainer = ref(null);
const filteredChats = computed(() => { const q = searchQuery.value.trim().toLowerCase(); return q ? chats.value.filter(c => [c.chat_user?.full_name, c.last_message].some(v => v?.toLowerCase().includes(q))) : chats.value; });
const formattedDate = (date) => { const d = new Date(date); return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
const scrollToLatest = async () => { await nextTick(); if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; };
const openChat = async (chat) => { await chatStore.selectChat(chat); scrollToLatest(); };
const handleSend = async () => { sending.value = true; await chatStore.sendMessage(); sending.value = false; scrollToLatest(); };
watch(() => route.query.helper, id => { if (id) helperStore.fetchHelper(id); }, { immediate: true }); watch(() => selectedChat.value?.messages?.length, scrollToLatest); onMounted(() => chatStore.fetchChats());
</script>
