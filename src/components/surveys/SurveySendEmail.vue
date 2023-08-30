<script lang="ts" setup>
import { Survey } from '@/assets/data/interfaces';
import AppButtonBlank from '../AppButtonBlank.vue';

interface Props {
	survey: Survey;
	link: string;
}
defineProps<Props>();
</script>

<template>
	<AppButtonBlank
		v-if="!survey.completed"
		label="Invia un'email"
		icon="envelope"
	/>
</template>

<style scoped></style>
