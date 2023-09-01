<script lang="ts" setup>
import { useRouter } from 'vue-router';
import AppButtonBlank from './AppButtonBlank.vue';

const router = useRouter();
const goBack = () => {
	router.back();
};
</script>

<template>
	<!-- back button -->
	<app-button-blank
		@click="goBack"
		color="gray"
		label="Indietro"
		icon="circle-chevron-left"
	/>
</template>
