<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Roles & Permissions Management
                </h1>
                <p class="text-gray-600">
                    Manage system roles and their permissions
                </p>
            </div>

            <!-- Tabs Navigation -->
            <div class="mb-6 border-b border-gray-200">
                <nav class="flex space-x-8">
                    <button
                        @click="activeTab = 'roles'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'roles'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ]"
                    >
                        Roles
                    </button>
                    <button
                        @click="activeTab = 'permissions'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'permissions'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ]"
                    >
                        Permissions
                    </button>
                    <button
                        @click="activeTab = 'assignments'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'assignments'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ]"
                    >
                        Role Assignments
                    </button>
                </nav>
            </div>

            <!-- ROLES TAB -->
            <div v-if="activeTab === 'roles'" class="card">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">
                        Manage Roles
                    </h2>
                    <button
                        @click="
                            showRoleModal = true;
                            editingRole = null;
                            newRole = { name: '', description: '' };
                        "
                        class="btn btn-primary"
                    >
                        + Create Role
                    </button>
                </div>

                <div v-if="roles.length === 0" class="text-center py-12">
                    <div class="text-gray-400 mb-2">📋</div>
                    <p class="text-gray-500">No roles created yet</p>
                </div>

                <div v-else class="space-y-4">
                    <div
                        v-for="role in roles"
                        :key="role.id"
                        class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h3
                                    class="text-lg font-semibold text-gray-900 mb-2"
                                >
                                    {{ role.name }}
                                </h3>
                                <p class="text-gray-600 mb-4">
                                    {{ role.description }}
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="perm in getRolePermissions(
                                            role.id,
                                        )"
                                        :key="perm.id"
                                        class="badge badge-info"
                                    >
                                        {{ perm.name }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex space-x-2 ml-4">
                                <button
                                    @click="editRole(role)"
                                    class="btn btn-secondary text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="deleteRole(role.id)"
                                    class="btn btn-danger text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PERMISSIONS TAB -->
            <div v-if="activeTab === 'permissions'" class="card">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">
                        Manage Permissions
                    </h2>
                    <button
                        @click="
                            showPermissionModal = true;
                            newPermission = { name: '', description: '' };
                        "
                        class="btn btn-primary"
                    >
                        + Create Permission
                    </button>
                </div>

                <div v-if="permissions.length === 0" class="text-center py-12">
                    <div class="text-gray-400 mb-2">🔐</div>
                    <p class="text-gray-500">No permissions created yet</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Permission Name
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Description
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Used in Roles
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="perm in permissions" :key="perm.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="font-medium text-gray-900">{{
                                        perm.name
                                    }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-gray-600">{{
                                        perm.description
                                    }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-gray-600">
                                        {{
                                            getRolesWithPermission(perm.id)
                                                .length
                                        }}
                                        role(s)
                                    </span>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm space-x-2"
                                >
                                    <button
                                        @click="editPermission(perm)"
                                        class="text-primary-600 hover:text-primary-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        @click="deletePermission(perm.id)"
                                        class="text-danger-600 hover:text-danger-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ROLE ASSIGNMENTS TAB -->
            <div v-if="activeTab === 'assignments'" class="card">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">
                    Assign Permissions to Roles
                </h2>

                <div class="space-y-6">
                    <div
                        v-for="role in roles"
                        :key="role.id"
                        class="border border-gray-200 rounded-lg p-6"
                    >
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">
                            {{ role.name }}
                        </h3>

                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                        >
                            <label
                                v-for="perm in permissions"
                                :key="perm.id"
                                class="flex items-center space-x-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    :checked="
                                        roleHasPermission(role.id, perm.id)
                                    "
                                    @change="
                                        toggleRolePermission(
                                            role.id,
                                            perm.id,
                                            $event,
                                        )
                                    "
                                    class="w-4 h-4 text-primary-600 rounded"
                                />
                                <span class="text-sm text-gray-700">{{
                                    perm.name
                                }}</span>
                            </label>
                        </div>
                    </div>

                    <div v-if="roles.length === 0" class="text-center py-12">
                        <p class="text-gray-500">
                            No roles available. Create some roles first.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ROLE MODAL -->
        <div
            v-if="showRoleModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        {{ editingRole ? "Edit Role" : "Create New Role" }}
                    </h3>

                    <div class="space-y-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Role Name *
                            </label>
                            <input
                                v-model="newRole.name"
                                type="text"
                                placeholder="e.g., Moderator"
                                class="input w-full"
                            />
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                v-model="newRole.description"
                                placeholder="Role description"
                                class="input w-full"
                                rows="4"
                            ></textarea>
                        </div>

                        <div v-if="editingRole" class="border-t pt-4">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-3"
                            >
                                Permissions
                            </label>
                            <div class="space-y-2 max-h-40 overflow-y-auto">
                                <label
                                    v-for="perm in permissions"
                                    :key="perm.id"
                                    class="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        :checked="
                                            roleHasPermission(
                                                editingRole.id,
                                                perm.id,
                                            )
                                        "
                                        @change="
                                            toggleRolePermission(
                                                editingRole.id,
                                                perm.id,
                                                $event,
                                            )
                                        "
                                        class="w-4 h-4 text-primary-600 rounded"
                                    />
                                    <span class="text-sm text-gray-700">{{
                                        perm.name
                                    }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex space-x-3">
                        <button
                            @click="
                                showRoleModal = false;
                                editingRole = null;
                            "
                            class="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            @click="saveRole"
                            class="btn btn-primary flex-1"
                        >
                            {{ editingRole ? "Update" : "Create" }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- PERMISSION MODAL -->
        <div
            v-if="showPermissionModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        {{
                            editingPermission
                                ? "Edit Permission"
                                : "Create New Permission"
                        }}
                    </h3>

                    <div class="space-y-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Permission Name *
                            </label>
                            <input
                                v-model="newPermission.name"
                                type="text"
                                placeholder="e.g., manage_users"
                                class="input w-full"
                            />
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                v-model="newPermission.description"
                                placeholder="Permission description"
                                class="input w-full"
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    <div class="mt-6 flex space-x-3">
                        <button
                            @click="
                                showPermissionModal = false;
                                editingPermission = null;
                            "
                            class="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            @click="savePermission"
                            class="btn btn-primary flex-1"
                        >
                            {{ editingPermission ? "Update" : "Create" }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div
            v-if="notification"
            class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm"
            :class="
                notification.type === 'success'
                    ? 'bg-success-500 text-white'
                    : 'bg-danger-500 text-white'
            "
        >
            {{ notification.message }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from "../services/api";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

// Check if user is admin
// if (!authStore.hasRole("admin")) {
//     router.push("/dashboard");
// }

const activeTab = ref("roles");
const roles = ref([]);
const permissions = ref([]);
const rolePermissions = ref([]); // Array of { role_id, permission_id }

const showRoleModal = ref(false);
const showPermissionModal = ref(false);
const editingRole = ref(null);
const editingPermission = ref(null);

const newRole = ref({ name: "", description: "" });
const newPermission = ref({ name: "", description: "" });

const notification = ref(null);
const loading = ref(false);

// Fetch data on mount
onMounted(async () => {
    await loadRoles();
    await loadPermissions();
});

const loadRoles = async () => {
    loading.value = true;
    try {
        const response = await api.getRoles();
        if (response.success) {
            roles.value = response.data;
        } else {
            showNotification("Failed to load roles", "error");
        }
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        loading.value = false;
    }
};

const loadPermissions = async () => {
    loading.value = true;
    try {
        const response = await api.getPermissions();
        if (response.success) {
            permissions.value = response.data;
            // Also load role-permission mappings
            rolePermissions.value = response.rolePermissions || [];
        } else {
            showNotification("Failed to load permissions", "error");
        }
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        loading.value = false;
    }
};

const saveRole = async () => {
    if (!newRole.value.name.trim()) {
        showNotification("Role name is required", "error");
        return;
    }

    loading.value = true;
    try {
        if (editingRole.value) {
            const response = await api.updateRole(
                editingRole.value.id,
                newRole.value,
            );
            if (response.success) {
                showNotification("Role updated successfully", "success");
                await loadRoles();
            } else {
                showNotification("Failed to update role", "error");
            }
        } else {
            const response = await api.createRole(newRole.value);
            if (response.success) {
                showNotification("Role created successfully", "success");
                await loadRoles();
            } else {
                showNotification("Failed to create role", "error");
            }
        }
        showRoleModal.value = false;
        editingRole.value = null;
        newRole.value = { name: "", description: "" };
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        loading.value = false;
    }
};

const savePermission = async () => {
    if (!newPermission.value.name.trim()) {
        showNotification("Permission name is required", "error");
        return;
    }

    loading.value = true;
    try {
        if (editingPermission.value) {
            const response = await api.updatePermission(
                editingPermission.value.id,
                newPermission.value,
            );
            if (response.success) {
                showNotification("Permission updated successfully", "success");
                await loadPermissions();
            } else {
                showNotification("Failed to update permission", "error");
            }
        } else {
            const response = await api.createPermission(newPermission.value);
            if (response.success) {
                showNotification("Permission created successfully", "success");
                await loadPermissions();
            } else {
                showNotification("Failed to create permission", "error");
            }
        }
        showPermissionModal.value = false;
        editingPermission.value = null;
        newPermission.value = { name: "", description: "" };
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        loading.value = false;
    }
};

const editRole = (role) => {
    editingRole.value = role;
    newRole.value = { name: role.name, description: role.description };
    showRoleModal.value = true;
};

const editPermission = (perm) => {
    editingPermission.value = perm;
    newPermission.value = { name: perm.name, description: perm.description };
    showPermissionModal.value = true;
};

const deleteRole = async (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    loading.value = true;
    try {
        const response = await api.deleteRole(roleId);
        if (response.success) {
            showNotification("Role deleted successfully", "success");
            await loadRoles();
        } else {
            showNotification("Failed to delete role", "error");
        }
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        loading.value = false;
    }
};

const deletePermission = async (permId) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;

    loading.value = true;
    try {
        const response = await api.deletePermission(permId);
        if (response.success) {
            showNotification("Permission deleted successfully", "success");
            await loadPermissions();
        } else {
            showNotification("Failed to delete permission", "error");
        }
    } catch (error) {
        showNotification(error.message, "error");
    } finally {
        loading.value = false;
    }
};

const roleHasPermission = (roleId, permId) => {
    return rolePermissions.value.some(
        (rp) => rp.role_id === roleId && rp.permission_id === permId,
    );
};

const toggleRolePermission = async (roleId, permId, event) => {
    const isChecked = event.target.checked;

    loading.value = true;
    try {
        if (isChecked) {
            const response = await api.assignPermissionToRole(roleId, permId);
            if (response.success) {
                rolePermissions.value.push({
                    role_id: roleId,
                    permission_id: permId,
                });
                showNotification("Permission assigned", "success");
            }
        } else {
            const response = await api.removePermissionFromRole(roleId, permId);
            if (response.success) {
                rolePermissions.value = rolePermissions.value.filter(
                    (rp) =>
                        !(rp.role_id === roleId && rp.permission_id === permId),
                );
                showNotification("Permission removed", "success");
            }
        }
    } catch (error) {
        showNotification(error.message, "error");
        event.target.checked = !isChecked;
    } finally {
        loading.value = false;
    }
};

const getRolePermissions = (roleId) => {
    const permIds = rolePermissions.value
        .filter((rp) => rp.role_id === roleId)
        .map((rp) => rp.permission_id);
    return permissions.value.filter((p) => permIds.includes(p.id));
};

const getRolesWithPermission = (permId) => {
    const roleIds = rolePermissions.value
        .filter((rp) => rp.permission_id === permId)
        .map((rp) => rp.role_id);
    return roles.value.filter((r) => roleIds.includes(r.id));
};

const showNotification = (message, type = "success") => {
    notification.value = { message, type };
    setTimeout(() => {
        notification.value = null;
    }, 3000);
};
</script>

<style scoped>
.card {
    @apply bg-white rounded-lg shadow p-6;
}

.btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
}

.btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700;
}

.btn-success {
    @apply bg-green-600 text-white hover:bg-green-700;
}

.input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.badge {
    @apply inline-block px-3 py-1 rounded-full text-sm font-medium;
}

.badge-info {
    @apply bg-blue-100 text-blue-800;
}

.badge-primary {
    @apply bg-blue-100 text-blue-800;
}

.badge-warning {
    @apply bg-yellow-100 text-yellow-800;
}

.badge-success {
    @apply bg-green-100 text-green-800;
}

.badge-danger {
    @apply bg-red-100 text-red-800;
}

@media (max-width: 768px) {
    .card {
        @apply p-4;
    }

    .btn {
        @apply px-3 py-1.5 text-sm;
    }

    table {
        @apply text-sm;
    }
}
</style>
