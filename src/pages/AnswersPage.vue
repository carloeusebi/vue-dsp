<script lang="ts" setup>
import { ref, watch } from 'vue';
import { isAxiosError } from 'axios';

import AppAlert from '@/components/AppAlert.vue';
import ResultItem from '@/components/results/ResultItem.vue';

import { Question, QuestionItemI, Survey } from '@/assets/data/interfaces';
import { useLoaderStore, useSurveysStore } from '@/stores';
import AppCheckbox from '@/components/AppCheckbox.vue';

interface PrintableQuestion extends Question {
	printable: boolean;
}

interface Props {
	survey?: Survey;
}

const props = defineProps<Props>();

const onlyShowAnswersWithComment = ref(false);
const editMode = ref(false);
const checkboxes = ref<Array<boolean[]>>([]);
const loader = useLoaderStore();
const refItems = ref<HTMLLIElement[]>();
const errorBeep = new Audio(new URL(`../assets/sounds/error.mp3`, import.meta.url).href);

watch(
	() => props.survey,
	survey => {
		if (!survey) return;
		checkboxes.value = fillCheckboxes();
		survey.questions = makeQuestionsPrintable(survey.questions);

		survey.questions.forEach(question => {
			question.items.forEach(item => {
				itemsArray.push(item);
			});
		});
	}
);

const min = (type: Question['type']): number => (type === 'EDI' ? 0 : parseInt(type.at(0) as string));

const fillCheckboxes = () => {
	const checkboxes: Array<boolean[]> = [];
	if (!props.survey) return checkboxes;
	props.survey.questions.forEach(question => {
		const legends = [];
		for (let i = 0; i < question.legend.length; i++) {
			legends.push(false);
		}
		checkboxes.push(legends);
	});
	return checkboxes;
};

/**
 * Adds the printable propriety to each questionnaire
 * @param questions The questions to modify
 */
const makeQuestionsPrintable = (questions: Question[]): PrintableQuestion[] =>
	questions.map(q => ({ ...q, printable: true })) as PrintableQuestion[];

/**
 * Saves the survey and uses the store to make an ajax call
 */
const saveUpdates = async () => {
	if (!props.survey) return;
	loader.setLoader();
	try {
		await useSurveysStore().save({ ...props.survey });
	} catch (err) {
		if (isAxiosError(err)) alert(err.response?.data);
		else alert(err);
	} finally {
		loader.unsetLoader();
		editMode.value = false;
	}
};

/**
 * Checks if ha Questionnaire has comments. Used to show a Questionnaire only if it has comments.
 */
const questionHasComments = (question: Question): boolean => {
	return question.items.reduce((hasComments, item) => hasComments || item.hasOwnProperty('comment'), false);
};

const thereAreComments = (questions: Question[]): boolean => {
	return questions.reduce((hasComments, question) => hasComments || questionHasComments(question), false);
};

const toggleEditMode = () => {
	editMode.value = !editMode.value;

	if (editMode.value && refItems.value) {
		active.value = 0;
		refItems.value[active.value].scrollIntoView({ block: 'center', behavior: 'smooth' });
	}
};

/**
 * ANSWER BY KEYPAD
 */
const active = ref(0);
const itemsArray: QuestionItemI[] = [];

window.addEventListener('keydown', e => {
	const getQuestion = (questions: Question[], active: number) => {
		let visitedItems = 0;
		return questions.find(question => {
			visitedItems += question.items.length;
			console.log(visitedItems, active);
			return visitedItems >= active;
		});
	};
	const getValidValues = (questions: Question[], active: number): number[] => {
		const question = getQuestion(questions, active);
		if (!question || question.type === 'MUL') return [];

		const validValues: number[] = [];
		const minValue = min(question.type);
		question.legend.forEach((_value, i) => validValues.push(minValue + i));

		return validValues;
	};

	const keyPress = parseInt(e.key);

	if (isNaN(keyPress) || !editMode.value || !props.survey) return;

	const validValues: Array<number> = getValidValues(props.survey?.questions, active.value);

	if (!validValues.includes(keyPress)) {
		// console.log(validValues);
		// console.log(keyPress);
		errorBeep.play();
		return;
	}
	itemsArray[active.value].answer = keyPress;
	active.value++;
	if (refItems.value) refItems.value[active.value].scrollIntoView({ block: 'center' });
});

const countItems = (questionIndex: number, itemIndex: number): number => {
	if (questionIndex === 0) return itemIndex;
	let previousQuestionsItems = 0;
	for (let i = 0; i < questionIndex; i++) {
		previousQuestionsItems += props.survey?.questions[i].items.length || 0;
	}
	return previousQuestionsItems + itemIndex;
};
</script>

<template>
	<!-- QUESTIONNAIRE -->
	<section
		id="answers-table"
		v-if="survey"
	>
		<div class="non-printable">
			<AppCheckbox
				id="only-show-answer-with-comment"
				v-model="onlyShowAnswersWithComment"
				label="Mostra solo risposte con commento"
			/>
		</div>
		<ul>
			<!-- TITLE AND DESCRIPTION -->
			<li
				v-for="(question, i) in (survey?.questions as PrintableQuestion[])"
				:key="question.id"
			>
				<section
					v-if="!onlyShowAnswersWithComment || questionHasComments(question)"
					:id="question.id.toString()"
					class="my-10 border-b pb-5"
					:class="{ 'edit-mode': editMode, 'non-printable': !question.printable }"
				>
					<div
						class="inline-flex items-center gap-3 cursor-pointer mb-5"
						@click="question.printable = !question.printable"
					>
						<h2 class="mb-0">
							{{ question.question }}
						</h2>
						<font-awesome-icon
							:icon="['fas', question.printable ? 'eye' : 'eye-slash']"
							size="lg"
							class="text-gray-400 non-printable"
						/>
					</div>
					<p class="mb-5">{{ question.description }}</p>
					<!-- LEGEND -->
					<div
						v-if="question.type !== 'MUL'"
						class="border border-black my-5 p-2 grid md:grid-cols-2"
					>
						<div
							v-for="(legend, j) in question.legend"
							:key="j"
							class="uppercase font-bold"
						>
							<!-- checkbox -->
							<div class="flex items-center">
								<div class="non-printable">
									<AppCheckbox
										class="me-7"
										v-model="checkboxes[i][j]"
										:id="`cb-${i}-${j}`"
									/>
								</div>
								<label
									:for="`cb-${i}-${j}`"
									class="cursor-pointer"
									v-text="
										`${question.type === 'EDI' ? (j < 2 ? 0 : j - 2) : j + min(question.type)} = ${legend.legend}`
									"
								></label>
							</div>
						</div>
					</div>
					<!-- ITEMS -->
					<ul>
						<li
							ref="refItems"
							v-for="(item, itemNumber) in question.items"
							:key="item.id"
							:class="{ 'bg-slate-100': active === countItems(i, itemNumber) && editMode }"
							class="print:bg-white"
							@click="if (editMode) active = countItems(i, itemNumber);"
						>
							<ResultItem
								:only-show-answers-with-comment="onlyShowAnswersWithComment"
								:item="item"
								:number-of-answers="question.legend.length"
								:item-number="itemNumber"
								:checkboxes="checkboxes[i]"
								:type="question.type"
								:edit-mode="editMode"
								:min="min"
								@update="saveUpdates"
							/>
						</li>
					</ul>
				</section>
			</li>
		</ul>

		<!-- Alert -->
		<div
			v-if="survey?.questions"
			class="non-printable my-5"
		>
			<AppAlert
				:show="onlyShowAnswersWithComment && !thereAreComments(survey?.questions)"
				message="Non ci sono questionari con commenti."
			/>
		</div>

		<!-- EDIT BUTTON -->
		<div class="non-printable">
			<div
				class="edit-button"
				:class="[editMode ? 'bg-red-800 hover:bg-red-900' : 'bg-blue-800 hover:bg-blue-900']"
				@click="toggleEditMode"
			>
				<font-awesome-icon
					:icon="['fas', 'pen-to-square']"
					size="2xl"
				/>
			</div>

			<!-- SAVE BUTTON -->
			<div
				v-if="editMode"
				@click="saveUpdates"
				class="save-button bg-green-800 hover:bg-green-900"
			>
				<font-awesome-icon
					:icon="['fas', 'floppy-disk']"
					size="2xl"
				/>
			</div>

			<!-- EDIT ALERT -->
			<div
				v-if="editMode"
				class="edit-mode-alert text-center text-xl md:text-4xl text-red-600 font-extrabold top-12 md:top-32 w-auto uppercase"
			>
				Modalità modifica attiva
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/checkbox';
.checkmark {
	top: 3px;
}

* {
	-webkit-print-color-adjust: exact;
	print-color-adjust: exact;
}

.edit-button,
.save-button {
	position: fixed;
	left: 2rem;

	box-shadow: 0 0 20px 2px #888;
	color: white;
	border-radius: 50%;
	width: 75px;
	aspect-ratio: 1;

	display: flex;
	justify-content: center;
	align-items: center;

	cursor: pointer;
}

.edit-button {
	bottom: 2rem;
}

.save-button {
	bottom: 7.5rem;
}

.edit-mode-alert {
	position: fixed;
	left: 50%;
	transform: translateX(-50%);

	text-shadow: 0 0 10px #888;
	user-select: none;
}
</style>
