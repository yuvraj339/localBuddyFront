<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import Navbar from "./components/Navbar.vue";

const authStore = useAuthStore();

onMounted(() => {
    authStore.loadUser();
});
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <Navbar />
        <main>
            <router-view />
        </main>
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
