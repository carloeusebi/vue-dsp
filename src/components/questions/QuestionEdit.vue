<script lang="ts" setup>
import { ref } from 'vue';

import AppButtonBlank from '../AppButtonBlank.vue';
import AppButton from '../AppButton.vue';
import AppModal from '../AppModal.vue';

import { Alert, Question } from '@/assets/data/interfaces';
import { useQuestionsStore } from '@/stores';
import { useSaveToStore } from '@/composables';

interface Props {
	question: Question;
}

const props = defineProps<Props>();
const emit = defineEmits(['attempt', 'update-question']);
const showEditModal = ref(false);
const errors = ref<string[]>([]);
const appAlert: Alert = {
	show: true,
	title: 'Successo',
	type: 'success',
	message: `${props.question.question} salvato con successo.`,
};

const handleUpdateQuestion = async () => {
	errors.value = [];
	emit('attempt');

	const questionsStore = useQuestionsStore();
	errors.value = await useSaveToStore(props.question, questionsStore);

	showEditModal.value = false;

	if (errors.value.length) {
		const errorsString = errors.value.reduce((str, error) => (str += `<li>${error}</li>`), '');
		appAlert.title = 'Attenzione';
		appAlert.type = 'warning';
		appAlert.message = `<ul>${errorsString}</ul>`;
	}

	emit('update-question', appAlert);
};
</script>

<template>
	<AppButtonBlank
		@click="showEditModal = true"
		from="question-form"
		color="green"
		label="Salva"
		icon="floppy-disk"
	/>

	<AppModal
		dimensions="max-w-md"
		:open="showEditModal"
		@close="showEditModal = false"
	>
		<template #content>
			<h2>Salva le modifiche</h2>

			<hr class="my-5" />
			<p>Sei sicuro di voler salvare le modifiche?</p>
		</template>
		<template #button>
			<AppButton
				@click="handleUpdateQuestion"
				color="green"
				>Salva le modifiche</AppButton
			>
		</template>
	</AppModal>
</template>

<style scoped></style>
