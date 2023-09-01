<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import AppAlert from '@/components/AppAlert.vue';
import AppBackButton from '@/components/AppBackButton.vue';
import QuestionDelete from '@/components/questions/QuestionDelete.vue';
import QuestionForm from '@/components/questions/QuestionForm.vue';
import QuestionTags from '@/components/questions/tags/QuestionTags.vue';

import { useLoaderStore, useQuestionsStore, useTagsStore } from '@/stores';
import { Alert, Question, Tag } from '@/assets/data/interfaces';
import QuestionEdit from '@/components/questions/QuestionEdit.vue';
import { useScrollTo } from '@/composables';

const id = parseInt(useRoute().params.id as string);
const questionsStore = useQuestionsStore();
const loader = useLoaderStore();

const originalQuestion = computed(() => questionsStore.getById(id));
const question = ref<Question | undefined>();

if (originalQuestion.value) {
	question.value = { ...originalQuestion.value };
}

watch(
	() => originalQuestion.value,
	newValue => {
		if (!newValue) return;
		question.value = { ...(newValue as Question) };
	}
);

const appAlert = ref<Alert>({
	show: false,
	type: 'info',
	title: '',
	message: '',
});

/**
 * Updates the selected tags for a question based on the new tag IDs provided.
 * @param newValue - An array of tag IDs to set as selected for the question.
 */
const handleTagSelectionChange = (newValue: number[]) => {
	if (!question.value) return;
	question.value.tags = [];
	newValue.forEach(tagId => {
		const tagToAdd = useTagsStore().getById(tagId);
		if (tagToAdd && question.value) {
			question.value.tags = [...(question.value.tags as Tag[]), tagToAdd];
		}
	});
};

const handleUpdateAttempt = () => {
	appAlert.value.show = false;
	useScrollTo(window, 10);
};

const handleUpdateQuestion = (alertConfig: Alert) => {
	appAlert.value = { ...alertConfig };
};

const scrollWindow = (height: number) => {
	setTimeout(() => {
		window.scrollBy(0, height);
	}, 15);
};
</script>

<template>
	<div class="max-w-6xl mx-auto">
		<header class="bg-gray-50 pt-3">
			<div class="container md:pt-0 mx-auto px-2 md:px-5 flex justify-between mt-5">
				<AppBackButton />
				<div
					v-if="question"
					class="flex justify-end gap-3"
				>
					<!-- tags -->
					<QuestionTags
						:starting-selection="question.tags?.map(({ id }) => id)"
						@change-selection="handleTagSelectionChange"
					/>
					<!-- save button -->
					<QuestionEdit
						:question="question"
						@attempt="handleUpdateAttempt"
						@update-question="handleUpdateQuestion"
					/>
					<QuestionDelete :to-delete-question="question" />
				</div>
			</div>
			<hr class="mt-5" />
		</header>

		<div class="my-3">
			<AppAlert
				:show="appAlert.show"
				:type="appAlert.type"
				:title="appAlert.title"
				:message="appAlert.message"
			/>
		</div>

		<div class="mb-24">
			<div v-if="question">
				<!-- TITLE	 -->
				<h1 class="text-3xl font-bold mb-3">{{ question?.question }}</h1>
				<!-- TAGS LIST -->
				<div class="max-w-screen-lg overflow-x-scroll">
					<ul class="flex gap-2 min-h-[22px]">
						<li
							v-for="tag in question.tags"
							:key="tag.id"
							:style="`background-color: ${tag.color}10; color: ${tag.color}; border: 1px solid ${tag.color}50`"
							class="inline-flex items-center rounded-md px-2 py-[2px] text-xs font-medium"
						>
							{{ tag.tag }}
						</li>
					</ul>
				</div>
				<hr class="my-5" />

				<QuestionForm
					:question="question"
					@answer-added="scrollWindow(42)"
					@variable-added="scrollWindow(90)"
				/>
			</div>
			<div v-else>
				<div class="my-5">
					<AppAlert
						:show="!loader.isLoading"
						message="Questionario non trovato."
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
header {
	position: sticky;
	top: 0;
	z-index: 2;
}
</style>
