<script lang="ts" setup>
import { Survey } from '@/assets/data/interfaces';
import AppButtonBlank from '../AppButtonBlank.vue';
import axiosInstance from '@/assets/axios';
import { isAxiosError } from 'axios';
import { useLoaderStore } from '@/stores';

interface Props {
	survey: Survey;
	link: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['attempt', 'send-email']);
const loader = useLoaderStore();

/**
 * Sends the email
 */
const sendEmail = async () => {
	loader.setLoader();
	emit('attempt');
	let message = 'Email inviata correttamente.';
	let title: 'Successo' | 'Attenzione' = 'Successo';
	let type: 'success' | 'info' | 'warning' = 'success';

	const data = {
		email_to: props.survey?.patient.email,
		subject: 'Questionario per la valutazione',
		link: props.link,
	};

	try {
		await axiosInstance.post('/email/test-link', data);
	} catch (err) {
		if (isAxiosError(err)) {
			console.warn(err.response?.data);
			message = err.response?.data.message;
		} else message = err as string;

		title = 'Attenzione';
		type = 'warning';
	} finally {
		loader.unsetLoader();

		emit('send-email', { show: true, message, title, type });
	}
};
</script>

<template>
	<AppButtonBlank
		v-if="!survey.completed"
		label="Invia un'email"
		icon="envelope"
		@click="sendEmail"
	/>
</template>

<style scoped></style>
