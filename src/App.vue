<script lang="ts" setup>
import AppLoader from './components/AppLoader.vue';
import { useAuthStore } from './stores';

const auth = useAuthStore();

if (auth.isAdmin) {
	auth.fetchAllData();
}
</script>

<template>
	<router-view></router-view>
	<AppLoader />
</template>
