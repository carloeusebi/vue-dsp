<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppAlert from '@/components/AppAlert.vue';
import AppBackButton from '@/components/AppBackButton.vue';
import PatientDelete from '@/components/patients/PatientDelete.vue';
import PatientFiles from '@/components/patients/PatientFiles.vue';
import PatientSave from '@/components/patients/PatientSave.vue';
import SurveyCreate from '@/components/surveys/SurveyCreate.vue';

import { useLoaderStore, usePatientsStore } from '@/stores';
import PatientDetails from '@/components/patients/PatientDetails.vue';
import PatientSurveys from '@/components/patients/PatientSurveys.vue';

const id = parseInt(useRoute().params.id as string);
const patientsStore = usePatientsStore();
const patient = computed(() => patientsStore.getById(id));
const loader = useLoaderStore();
const showSuccessAlert = ref(false);
</script>

<template>
	<header class="flex justify-between mt-5">
		<AppBackButton class="h-full" />
		<div
			v-if="patient"
			class="flex gap-2 justify-end"
		>
			<PatientFiles :patient="patient" />
			<SurveyCreate :patient="patient" />
			<PatientSave
				title="Modifica il paziente"
				icon="pen"
				button-label="Modifica"
				:to-edit-patient="{ ...patient }"
				@patient-save="showSuccessAlert = true"
			/>
			<PatientDelete :to-delete-patient="patient" />
		</div>
	</header>

	<hr class="my-5" />

	<div class="mb-5">
		<AppAlert
			:show="showSuccessAlert"
			message="Paziente modificato con successo."
			type="success"
		/>
	</div>

	<div v-if="patient">
		<h1 class="text-2xl font-bold mb-3">{{ patient.fname }} {{ patient.lname }}</h1>
		<div class="grid lg:grid-cols-2 gap-6">
			<!-- PATIENT -->
			<PatientDetails :patient="patient" />
			<!-- SURVEYS -->
			<PatientSurveys :patient-id="patient.id" />
		</div>
	</div>
	<div v-else>
		<div class="my-5">
			<AppAlert
				:show="!loader.isLoading"
				message="Paziente non trovato."
			/>
		</div>
	</div>
</template>
