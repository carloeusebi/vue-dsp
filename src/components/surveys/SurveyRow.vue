<script lang="ts" setup>
import { Ref, computed, ref } from 'vue';

import AppModal from '@/components/AppModal.vue';
import AppButton from '@/components/AppButton.vue';
import AppAlert from '@/components/AppAlert.vue';
import SurveyDelete from './SurveyDelete.vue';

import axiosInstance from '@/assets/axios';
import { useLoaderStore, usePatientsStore } from '@/stores';
import { Patient, Survey } from '@/assets/data/interfaces';
import { isAxiosError } from 'axios';
import PatientRow from '../patients/PatientRow.vue';

// interfaces

interface Props {
	survey: Survey;
	page: 'patients' | 'surveys';
}

interface Alert {
	show: boolean;
	title?: string;
	message?: string;
	type?: 'warning' | 'success';
}
const emailAlert: Ref<Alert> = ref({ show: false });

const props = defineProps<Props>();
const loader = useLoaderStore();
const token = props.survey.token;
const link = `${import.meta.env.VITE_BASE_URL}/admin/questionario/${token}`;

const createdAt = computed(() => new Date(props.survey.created_at as string).toLocaleDateString());
const updatedAt = computed(() => {
	if (!props.survey.updated_at) return '-';

	return new Date(props.survey.updated_at).toLocaleDateString();
});

const completedIcon = computed(() => {
	return props.survey.completed ? 'square-check' : 'square';
});

const copyUrl = async () => {
	try {
		await navigator.clipboard.writeText(link);
	} catch (e) {
		alert(e);
	}
};

const showWarningAlert = () => {
	emailAlert.value.show = true;
	emailAlert.value.title = 'Qualcosa è andato storto';
	emailAlert.value.message = errorsStr.value;
	emailAlert.value.type = 'warning';
};

const showSuccessAlert = () => {
	emailAlert.value.show = true;
	emailAlert.value.title = 'Successo';
	emailAlert.value.message = 'Email inviata correttamente';
	emailAlert.value.type = 'success';
};

/**
 * Sends the email
 */
const sendEmail = async () => {
	emailAlert.value.show = false;
	loader.setLoader();
	const data = {
		email_to: props.survey?.patient.email,
		subject: 'Questionario per la valutazione',
		link,
	};

	try {
		await axiosInstance.post('/email/test-link', data);
		showSuccessAlert();
	} catch (err) {
		if (isAxiosError(err)) {
			console.warn(err.response?.data);
			errors.value = err.response?.data;
			showWarningAlert();
		} else console.error(err);
	} finally {
		loader.unsetLoader();
	}
};
</script>

<template>
	<!-- TABLE ROW -->
	<tr class="text-gray-700 hover:bg-gray-100 transition-colors">
		<!-- name -->
		<td
			v-if="page === 'surveys'"
			class="px-4 py-3 text-ms border font-bold"
		>
			{{ survey.patient_name }}
		</td>
		<!-- title -->
		<td class="px-4 py-3 text-ms border">
			{{ survey.title }}
		</td>
		<!-- created_at -->
		<td
			v-if="page === 'surveys'"
			class="px-4 py-3 text-ms border"
		>
			{{ createdAt }}
		</td>
		<!-- updated_at -->
		<td class="px-4 py-3 text-ms border">
			{{ updatedAt }}
		</td>
		<!-- completed -->
		<td class="px-4 py-3 text-ms border">
			<font-awesome-icon
				:icon="['far', completedIcon]"
				size="xl"
			/>
		</td>

		<!-- DETAILS BUTTON -->
		<td class="px-4 py-3 text-sm border text-center">
			<router-link :to="{ name: 'surveys.show', params: { id: survey.id } }">
				<span
					class="px-3 py-2 font-semibold leading-tight text-sky-700 bg-sky-100 rounded-sm cursor-pointer select-none hover:bg-sky-200 transition-colors"
				>
					Dettagli
				</span>
			</router-link>
		</td>
	</tr>
</template>
