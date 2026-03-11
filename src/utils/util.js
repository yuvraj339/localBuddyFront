import { useAuthStore } from "../stores/auth";
import { API_BASE_URL } from "../config/config";
import { computed } from "vue";
// const authStore = useAuthStore();

export const avatarSrc = (avatarUrl) => {
    if (avatarUrl) {
        return `${API_BASE_URL}${avatarUrl}`;
    }
    return `${API_BASE_URL}/static/default/default-avatar.png`;
};

export const helperAvatarSrc = (avatarUrl) => {
    if (avatarUrl) {
        return `${API_BASE_URL}${avatarUrl}`;
    }
    return `${API_BASE_URL}/static/default/default-avatar.png`;
};
