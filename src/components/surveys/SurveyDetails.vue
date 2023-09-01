<script lang="ts" setup>
import { Survey } from '@/assets/data/interfaces';
import SurveyPatient from './SurveyPatient.vue';

interface Props {
	survey: Survey;
}
defineProps<Props>();
</script>

<template>
	<!-- PATIENT INFO -->
	<SurveyPatient :patient="survey.patient" />
	<hr class="my-3 pe-3" />
	<!-- SURVEY INFO -->
	<div>
		<strong>Creato il: </strong>
		<span>{{ survey.created_at }}</span>
	</div>
	<div>
		<strong>Ultima modifica: </strong>
		<span>{{ survey.updated_at || '-' }}</span>
	</div>
</template>

<style scoped></style>
