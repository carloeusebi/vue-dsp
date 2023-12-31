<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import AppSearchbar from '@/components/AppSearchbar.vue';
import AppAlert from '@/components/AppAlert.vue';
import QuestionsRow from '@/components/questions/QuestionsRow.vue';
import QuestionCreate from '@/components/questions/QuestionCreate.vue';
import QuestionTags from '@/components/questions/tags/QuestionTags.vue';

import { useLoaderStore, useQuestionsStore } from '@/stores';
import {
	useExtractQueryParams,
	useFilterQuestionsByTags,
	useSearchFilter,
	useStringifyQuestionTags,
} from '@/composables';

const handleSearchbarKeypress = (word: string) => (searchWord.value = word.toLowerCase());

const questionsStore = useQuestionsStore();
const { questions } = storeToRefs(questionsStore);
const searchWord = ref('');
const loader = useLoaderStore();
const { alertType, alertMessage } = useExtractQueryParams();

let selectedTagsIds = ref<number[]>([]);
const searchableQuestions = computed(() => useStringifyQuestionTags(questions.value));

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
 * A list of Questions with selected Tags, filtered using the searchbox.
 */
const filteredQuestions = computed(() => {
	if (questions.value === null) return [];
	return useSearchFilter(questionsWithSelectedTags.value, searchWord.value, ['question', 'tagsString']);
});
</script>

<template>
	<section class="relative mt-6 mb-36 mx-auto max-w-screen-2xl min-h-[600px] overflow-x-hidden">
		<div class="relative flex items-center gap-6">
			<AppSearchbar @key-press="handleSearchbarKeypress" />
			<QuestionTags
				:editable="true"
				@change-selection="handleChangeSelection($event)"
			/>
		</div>
		<!-- @vue-ignore -->
		<AppAlert
			:show="alertMessage != undefined && alertType != undefined"
			:type="alertType"
			:message="alertMessage"
			class="my-5"
		/>
		<div class="flex justify-between h-[36px] my-3">
			<h1 class="text-3xl font-bold">Questionari</h1>
			<QuestionCreate />
		</div>

		<!-- QUESTIONS LIST -->
		<ul
			v-if="filteredQuestions.length > 0"
			class="px-5 lg:px-0"
		>
			<QuestionsRow
				v-for="question in filteredQuestions"
				:question="question"
				:key="question.id || question.question"
			/>
		</ul>
		<AppAlert
			v-else
			:show="!loader.isLoading"
		>
			Nessun questionario trovato!
		</AppAlert>
	</section>
</template>
