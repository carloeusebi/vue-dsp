<script lang="ts" setup>
import { ref } from 'vue';

import AppModal from '@/components/AppModal.vue';
import AppButton from '@/components/AppButton.vue';

import { useQuestionsStore } from '@/stores';
import { Question } from '@/assets/data/interfaces';
import { useDeleteFromStore } from '@/composables';
import AppButtonBlank from '../AppButtonBlank.vue';
import { RouteLocationRaw } from 'vue-router';

const showDeleteModal = ref(false);

interface Props {
	toDeleteQuestion: Question;
}

const props = defineProps<Props>();

const closeDeleteModal = () => {
	showDeleteModal.value = false;
};

const handleDeleteQuestion = async () => {
	const questionStore = useQuestionsStore();
	const id = props.toDeleteQuestion.id || -1;

	const alertType = 'success';
	const alertMessage = `${props.toDeleteQuestion.question} eliminato correttamente.`;

	const redirectTo: RouteLocationRaw = {
		name: 'questions.index',
		query: { alertType, alertMessage },
	};

	showDeleteModal.value = false;

	await useDeleteFromStore(questionStore, id, redirectTo);
};
</script>

<template>
	<AppButtonBlank
		@click="showDeleteModal = true"
		color="red"
		label="Elimina Questionario"
		icon="trash-can"
	/>

	<AppModal
		:open="showDeleteModal"
		@close="closeDeleteModal"
	>
		<!-- CONTENT -->
		<template v-slot:content>
			<h2 class="text-2xl font-medium">Elimina {{ toDeleteQuestion.question }}</h2>
			<hr class="my-3" />
			<p>
				Sei sicuro di voler eliminare <strong>{{ toDeleteQuestion.question }}?</strong>
			</p>
			<p>Questa operazione <strong>non è reversibile</strong>.</p>
			<!-- FORM -->
			<form
				@submit.prevent="handleDeleteQuestion"
				id="delete-form"
				class="flex items-center my-3"
			>
				<input
					class="cursor-pointer"
					type="checkbox"
					id="confirm-delete"
					required
				/>
				<label
					for="confirm-delete"
					class="ps-3 cursor-pointer"
					>Sono sicuro di voler eliminare <strong>{{ toDeleteQuestion.question }}</strong></label
				>
			</form>
		</template>
		<!-- BUTTON -->
		<template v-slot:button>
			<AppButton
				form="delete-form"
				color="red"
			>
				Elimina {{ toDeleteQuestion.question }}
			</AppButton>
		</template>
	</AppModal>
</template>
