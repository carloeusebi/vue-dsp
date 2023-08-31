<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppAlert from '@/components/AppAlert.vue';
import AppBackButton from '@/components/AppBackButton.vue';
import AppButtonBlank from '@/components/AppButtonBlank.vue';
import QuestionDelete from '@/components/questions/QuestionDelete.vue';
import QuestionForm from '@/components/questions/QuestionForm.vue';
import QuestionTags from '@/components/questions/QuestionTags.vue';

import { useLoaderStore, useQuestionsStore, useTagsStore } from '@/stores';
import { Alert, Question, Tag } from '@/assets/data/interfaces';

const id = parseInt(useRoute().params.id as string);
const questionsStore = useQuestionsStore();
const loader = useLoaderStore();

const computedQuestion = computed(() => questionsStore.getById(id));
const question = ref({ ...(computedQuestion.value as Question) });

console.log(question.value);

const appAlert = ref<Alert>({
	show: false,
	type: 'info',
	title: '',
	message: '',
});

/**
 * Updates the selected tags for a question based on the new tag IDs provided.
 * @param {number[]} newValue - An array of tag IDs to set as selected for the question.
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
</script>

<template>
	<div class="max-w-6xl mx-auto mb-8">
		<header class="bg-gray-50">
			<div class="container mx-auto px-2 md:px-5 flex justify-between mt-5">
				<AppBackButton />
				<div
					v-if="question.id"
					class="flex justify-end gap-3"
				>
					<!-- tags -->
					<QuestionTags
						:starting-selection="question.tags?.map(({ id }) => id)"
						@change-selection="handleTagSelectionChange"
					/>
					<!-- save button -->
					<AppButtonBlank
						from="question-form"
						color="green"
						label="Salva"
						icon="floppy-disk"
					/>
					<QuestionDelete :to-delete-question="question" />
				</div>
			</div>
			<hr class="mt-5" />
		</header>

		<div class="mb-5">
			<AppAlert
				:show="appAlert.show"
				:type="appAlert.type"
				:title="appAlert.title"
				:message="appAlert.message"
			/>
		</div>

		<div class="my-24">
			<div v-if="question.id">
				<h1 class="text-3xl font-bold mb-3">{{ question?.question }}</h1>

				<!-- TAGS LIST -->
				<ul class="flex gap-2 min-h-[22px] mb-14">
					<li
						v-for="tag in question.tags"
						:key="tag.id"
						:style="`background-color: ${tag.color}10; color: ${tag.color}; border: 1px solid ${tag.color}50`"
						class="inline-flex items-center rounded-md px-2 py-[2px] text-xs font-medium"
					>
						{{ tag.tag }}
					</li>
				</ul>

				<QuestionForm :question="question" />
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
	position: fixed;
	z-index: 2;
	padding-top: 7px;
	top: 75px;
	left: 0;
	right: 0;
}
</style>
