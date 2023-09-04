<script lang="ts" setup>
import { ref } from 'vue';

import AppButton from '../AppButton.vue';
import AppAlert from '../AppAlert.vue';
import PatientForm from '../patients/PatientForm.vue';

import { Patient } from '@/assets/data/interfaces';
import axiosInstance from '@/assets/axios';
import { useLoaderStore } from '@/stores';
import { isAxiosError } from 'axios';
import { useScrollTo } from '@/composables';

const endpoint = 'tests/patient';

interface Props {
	token: string;
	patient: Patient;
}

const props = defineProps<Props>();
const loader = useLoaderStore();

const patientRef = ref<Patient>({ ...props.patient });

const emit = defineEmits(['form-submit']);

/**
 * Ajax call to update patient's info on the server.
 */
const handleFormSubmit = async () => {
	//@ts-ignore
	useScrollTo(window, 0);
	loader.setLoader();
	errors.value = [];

	if (patientRef.value === null) return;

	const params = {
		token: props.token,
		...patientRef.value,
	};

	try {
		await axiosInstance.put(`${endpoint}/${patientRef.value.id}`, params);
		emit('form-submit');
	} catch (err) {
		if (isAxiosError(err)) {
			// Axios error means the patient information are not correct
			errors.value = Object.values(err.response?.data.errors);
			console.warn(err);
		} else {
			// If not axios error ignore the error and go on
			console.error(err);
			emit('form-submit');
		}
	} finally {
		loader.unsetLoader();
	}
};

//errors
const errors = ref<Array<string[]>>([]);
</script>

<template>
	<div class="container md:max-w-4xl mx-auto py-5">
		<h2 class="text-center text-3xl">Inserisci prima delle informazioni su di te</h2>
		<AppAlert
			:show="errors.length > 0"
			type="warning"
			title="Attenzione"
			class="my-4"
			:errors="errors"
		/>

		<hr class="my-8" />

		<!-- FORM -->
		<form @submit.prevent="handleFormSubmit">
			<PatientForm
				v-if="patient"
				:patient="patientRef"
				:is-test="true"
			/>
			<!-- FORM BUTTON -->
			<hr class="my-5" />
			<div class="flex justify-end items-center">
				<button
					v-if="errors.length > 0"
					type="button"
					class="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto me-4"
					@click="$emit('form-submit')"
				>
					Salta
				</button>
				<AppButton color="green"> Conferma </AppButton>
			</div>
		</form>
	</div>
</template>

<style scoped></style>
