<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

import AppButtonBlank from '@/components/AppButtonBlank.vue';
import AppButton from '@/components/AppButton.vue';
import AppModal from '@/components/AppModal.vue';
import AppInputElement from '@/components/AppInputElement.vue';
import AppAlert from '@/components/AppAlert.vue';

import { useQuestionsStore } from '@/stores';
import { emptyQuestion, questionTypes } from '@/assets/data/data';
import { Question } from '@/assets/data/interfaces';
import { useSaveToStore } from '@/composables';

const questionStore = useQuestionsStore();
const labels = questionStore.labels;
const router = useRouter();
const showModal = ref(false);
const newQuestion = ref({ ...emptyQuestion } as Question);
const types = ref(questionTypes);
const errors: Ref<string[]> = ref([]);

const create = async () => {
	errors.value = [];

	newQuestion.value.legend = [];
	newQuestion.value.items = [];
	newQuestion.value.variables = [];

	errors.value = await useSaveToStore(newQuestion.value, questionStore);

	if (!errors.value.length) {
		showModal.value = false;
		const id = questionStore.lastInsertedId;
		router.push({ name: 'questions.show', params: { id } });
	}
};
</script>

<template>
	<AppButtonBlank
		@click="showModal = true"
		color="blue"
		icon="plus"
		label="Aggiungi un nuovo questionario"
	/>

	<AppModal
		:open="showModal"
		@close="showModal = false"
	>
		<template v-slot:content>
			<h2>Crea nuovo Questionario</h2>
			<hr class="my-5" />

			<!-- ALERT -->
			<AppAlert
				:show="errors.length > 0"
				type="warning"
				title="Attenzione"
				class="my-4"
				:transition="false"
			>
				<ul>
					<li
						v-for="error in errors"
						:key="error"
					>
						{{ error }}
					</li>
				</ul>
			</AppAlert>

			<!-- FORM -->
			<form
				id="question-create"
				@submit.prevent="create"
			>
				<div class="grid md:grid-cols-3 md:gap-6 mb-6">
					<!-- TITLE -->
					<div class="md:col-span-2 mb-4">
						<AppInputElement
							v-model="newQuestion.question"
							:label="labels.question"
						/>
					</div>

					<!-- TYPE -->
					<div class="md:col-span-1">
						<AppInputElement
							v-model="newQuestion.type"
							:label="labels.type"
							type="select"
						>
							<option
								v-for="t in types"
								:key="t"
								:value="t"
							>
								{{ t }}
							</option>
						</AppInputElement>
					</div>
				</div>

				<!-- DESCRIPTION TEXTAREA -->
				<div class="relative mb-6">
					<AppInputElement
						v-model="newQuestion.description"
						:label="labels.description"
						type="textarea"
					/>
				</div>
			</form>
		</template>
		<template v-slot:button>
			<AppButton form="question-create">Crea</AppButton>
		</template>
	</AppModal>
</template>
