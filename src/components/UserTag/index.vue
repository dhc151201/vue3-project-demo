<template>
    <span class="user-role-bar">
        <span class="user">{{user_name}}</span>
        <span class="role">{{role_name}}</span>
    </span>
</template>
<script setup lang="ts">
defineProps({
    user_name: {type: String, default: ''},
    role_name: {type: String, default: ''},
})
</script>