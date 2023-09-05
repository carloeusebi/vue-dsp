<script lang="ts" setup>
import { Ref, computed, ref } from 'vue';
import draggable from 'vuedraggable';

import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppButtonBlank from '@/components/AppButtonBlank.vue';
import AppCheckbox from '../AppCheckbox.vue';
import AppInputElement from '@/components/AppInputElement.vue';
import AppModal from '@/components/AppModal.vue';
import AppSearchbar from '../AppSearchbar.vue';
import QuestionTags from '@/components/questions/tags/QuestionTags.vue';

import { Patient, Survey } from '@/assets/data/interfaces';
import { emptySurvey } from '@/assets/data/data';
import {
	useFilterQuestionsByTags,
	useSaveToStore,
	useSearchFilter,
	useSort,
	useStringifyQuestionTags,
} from '@/composables';
import { usePatientsStore, useQuestionsStore, useSurveysStore } from '@/stores';
import router from '@/routes';
import { storeToRefs } from 'pinia';

interface Props {
	patient?: Patient;
}

const props = defineProps<Props>();
if (props.patient) emptySurvey.patient_id = props.patient.id as number;
const showModal = ref(false);
const patients = computed(() => useSort(usePatientsStore().patients, { by: 'lname', direction: 'down' }));

const newSurvey: Ref<Survey> = ref({ ...(emptySurvey as Survey) });

const errors = ref<Array<string[]>>([]);

/**
 * Checks for errors
 */
const handleFormSubmit = () => {
	// check for errors
	errors.value = [];

	if (!newSurvey.value.title) {
		errors.value.push(['Il nome per il Sondaggio è obbligatorio']);
	}

	if (!newSurvey.value.patient_id) {
		errors.value.push(['Nessun Paziente selezionato, il Paziente è obbligatorio']);
	}

	const selectedQuestions = questions.value.filter(({ selected }) => selected);
	if (!selectedQuestions.length) {
		errors.value.push(['Nessun questionario selezionato, selezionarne almeno uno']);
	}

	if (errors.value.length) return;

	newSurvey.value.questionIds = selectedQuestions.map(({ id }) => id);
	saveSurvey();
};

/**
 * Let the store handle the saving
 */
const saveSurvey = async () => {
	const surveyStore = useSurveysStore();
	errors.value = await useSaveToStore(newSurvey.value, surveyStore);

	if (!errors.value.length) {
		showModal.value = false;
		newSurvey.value = { ...(emptySurvey as Survey) };
		questions.value = questions.value.map(q => {
			q.selected = false;
			return q;
		});

		const id = surveyStore.lastInsertedId;
		router.push({ name: 'surveys.show', params: { id } });
	}
};

//**************************************************** */
//**************** QUESTIONS ************************* */
//**************************************************** */

const questionsStore = useQuestionsStore();
const { questions } = storeToRefs(questionsStore);
questions.value.forEach(q => (q.selected = false));
const questionsFilter = ref('');
const searchableQuestions = computed(() => useStringifyQuestionTags(questions.value));

let selectedTagsIds = ref<number[]>([]);

const handleKeyBarPress = (word: string) => {
	questionsFilter.value = word;
};

/**
 * Updates `selectedTagsIds` at the change from the `QuestionTags` component. Used to filter the Questionnaires by Tag.
 * @param newValue New Value coming for the change event.
 */
const handleChangeSelection = (newValue: number[]) => {
	selectedTagsIds.value = [...newValue];
};

/**
 * A list of Questions filtered by Tags, if no Tag is selected a list of all Questions.
 */
const questionsWithSelectedTags = computed(() =>
	useFilterQuestionsByTags(searchableQuestions.value, selectedTagsIds.value)
);

/**
 * Returns an array of IDs because the draggable component can't reorder a computed property
 */
const filteredQuestionsIds = computed(() => {
	if (!searchableQuestions) return [];
	const filteredQuestions = useSearchFilter(questionsWithSelectedTags.value, questionsFilter.value, [
		'question',
		'tagsString',
	]);
	return filteredQuestions.map(({ id }) => id);
});

const select = (value: 'all' | 'none') => {
	questions.value.forEach(question => {
		question.selected = value === 'all' ? true : false;
	});
};
</script>

<template>
	<AppButtonBlank
		color="green"
		@click="showModal = true"
		icon="plus"
		label="Aggiungi un nuova batteria"
	/>

	<AppModal
		:id="'Create' + (patient?.id || -1)"
		dimensions="sm:max-w-7xl"
		:open="showModal"
		@close="showModal = false"
	>
		<template #content>
			<h2>
				Crea una nuova Batteria
				<span v-if="patient"> per {{ patient.fname }} {{ patient.lname }}</span>
			</h2>

			<!-- ALERT -->
			<AppAlert
				:show="errors.length > 0"
				type="warning"
				title="Attenzione"
				class="my-4"
				:errors="errors"
			/>
			<hr class="my-8" />

			<!-- FORM -->
			<form
				@submit.prevent="handleFormSubmit"
				id="survey-create"
			>
				<!-- TITLE -->

				<AppInputElement
					class="mb-5"
					v-model.trim="newSurvey.title"
					label="Nome della Batteria"
					:required="true"
				/>

				<!-- PATIENT -->

				<AppInputElement
					v-if="!patient"
					v-model="newSurvey.patient_id"
					type="select"
					label="Seleziona un paziente"
					:required="true"
				>
					<option
						v-for="patient in patients"
						:key="patient.id"
						:value="patient.id"
					>
						{{ patient.fname }} {{ patient.lname }}
					</option>
				</AppInputElement>

				<!-- QUESTIONS -->
				<p class="text-black my-5 text-xl">Seleziona i questionari da aggiungere alla Batteria e il loro ordine</p>

				<!-- SEARCHBAR -->
				<div class="searchbar-container flex items-center gap-5 my-5">
					<div class="relative grow">
						<AppSearchbar @key-press="handleKeyBarPress" />
					</div>
					<QuestionTags @change-selection="handleChangeSelection($event)" />
				</div>

				<!-- SELECT ALL -->
				<div class="flex gap-5 mb-3">
					<button
						type="button"
						class="p-1"
						@click.prevent="select('all')"
					>
						Seleziona tutti
					</button>
					<button
						type="button"
						class="p-1"
						@click.prevent="select('none')"
					>
						Deseleziona tutti
					</button>
				</div>

				<!-- QUESTIONS CONTAINER -->
				<div class="questions-container min-h-[300px]">
					<div v-if="filteredQuestionsIds.length">
						<draggable
							item-key="id"
							tag="ul"
							v-model="questions"
							:animation="150"
							:delay="250"
							:delay-on-touch-only="true"
						>
							<template #item="{ element: question }">
								<li
									v-if="filteredQuestionsIds.includes(question.id)"
									class="select-none flex gap-3 items-center my-1"
								>
									<!-- CHECKBOX -->
									<AppCheckbox
										v-model="question.selected"
										:label="question.question"
										:id="question.id.toString()"
									/>
									<!-- question tags -->
									<ul class="md:flex gap-1 hidden">
										<li
											v-for="tag in question.tags"
											:key="tag.id"
											:style="`background-color: ${tag.color}10; color: ${tag.color}; border: 1px solid ${tag.color}50`"
											class="inline-flex items-center rounded-md px-1 h-5 text-[9px] font-medium"
										>
											{{ tag.tag }}
										</li>
									</ul>
								</li>
							</template>
						</draggable>
					</div>
					<div v-else>
						<AppAlert
							:show="true"
							title="Oops!"
						>
							Nessun questionario trovato!
						</AppAlert>
					</div>
				</div>
			</form>
		</template>
		<template #button>
			<AppButton form="survey-create"> Crea </AppButton>
		</template>
	</AppModal>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/checkbox';

label.container {
	bottom: 10px;
}

:deep(.searchbar-container input) {
	width: 100%;
}
</style>
