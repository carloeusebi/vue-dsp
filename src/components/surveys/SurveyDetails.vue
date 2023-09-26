<script lang="ts" setup>
import { Survey } from '@/assets/data/interfaces';
import SurveyPatient from './SurveyPatient.vue';

interface Props {
	survey: Survey;
}
defineProps<Props>();

const toItalianDate = (timestamp: string) => {
	const date = new Date(timestamp);

	return `${(date.getUTCDate() + '').padStart(2, '0')}-${(date.getUTCMonth() + 1 + '').padStart(
		2,
		'0'
	)}-${date.getUTCFullYear()} ${date.getUTCHours()}:${(date.getUTCMinutes() + '').padStart(2, '0')}`;
};
</script>

<template>
	<!-- PATIENT INFO -->
	<SurveyPatient
		v-if="survey.patient"
		:patient="survey.patient"
	/>
	<hr class="my-3 pe-3" />
	<!-- SURVEY INFO -->
	<div v-if="survey.created_at">
		<strong>Creato il: </strong>
		<span>{{ toItalianDate(survey.created_at) }}</span>
	</div>
	<div v-if="survey.updated_at && survey.updated_at !== survey.created_at">
		<strong>Ultima modifica: </strong>
		<span>{{ toItalianDate(survey.updated_at) || '-' }}</span>
	</div>
	<div v-else><strong>Ultima modifica: </strong> -</div>
</template>

<style scoped></style>
