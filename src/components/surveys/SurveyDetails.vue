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
</template>

<style scoped></style>
