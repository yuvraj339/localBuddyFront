import { defineStore } from "pinia";
import { ref } from "vue";
import { api, BASE_URL } from "../services/api";

export const useChatStore = defineStore("chat", () => {
    const chats = ref([]);
    const selectedChat = ref(null);
    const newMessage = ref("");
    const notificationCount = ref(0);

    const fetchChats = async () => {
        const response = await api.getChats();
        if (response.success) {
            chats.value = response.data;
        }
    };

    const fetchMessages = async (chatId) => {
        const response = await api.getChat(chatId);
        if (response.success) {
            // const chat = chats.value.find((c) => c.id === chatId);
            // if (chat) {
            //     chat.messages = response.data;
            // }
            return response.data;
        }
    };

    const sendMessage = async () => {
        debugger;
        if (!newMessage.value.trim() || !selectedChat.value) return;

        const message = {
            receiver_id: selectedChat.value.id,
            text: newMessage.value,
        };

        const response = await api.sendMessage(message);
        if (response.success) {
            selectedChat.value.messages.push(response.data);
            selectedChat.value.lastMessage = newMessage.value;
            selectedChat.value.timestamp = response.data.timestamp;
            newMessage.value = "";
        }
    };

    const selectChat = async (chat) => {
        if (!chat.chat_user) return true;
        selectedChat.value = chat.chat_user;
        chat.unread = 0;
        selectedChat.value.messages = await fetchMessages(chat.chat_user?.id);
        await api.updateChatStatus("read", chat.chat_user.id);
    };

    // const fetchNotifications = async () => {
    //     const response = await api.get(
    //         `${BASE_URL}/api/v1/messages/notifications`
    //     );
    //     if (response.success) {
    //         notificationCount.value = response.data.count;
    //     }
    // };
    // const selectChat = async () => await delay(300);
    const fetchNotifications = async () => await delay(300);

    return {
        chats,
        selectedChat,
        newMessage,
        notificationCount,
        fetchChats,
        fetchMessages,
        sendMessage,
        selectChat,
        fetchNotifications,
    };
});
