<script lang="ts" setup>
import AppLoader from './components/AppLoader.vue';
import { useAuthStore } from './stores';

useAuthStore().fetchAllData();
</script>

<template>
	<router-view></router-view>
	<AppLoader />
</template>
