<script lang="ts" setup>
import AppButtonBlank from './AppButtonBlank.vue';

defineProps({
	to: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<!-- back button -->
	<router-link
		class="flex items-center"
		:to="to"
	>
		<app-button-blank
			color="gray"
			label="Indietro"
			icon="circle-chevron-left"
		/>
	</router-link>
</template>
