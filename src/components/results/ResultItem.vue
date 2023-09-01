<script lang="ts" setup>
import { Question, QuestionItemI } from '@/assets/data/interfaces';

interface Props {
	onlyShowAnswersWithComment: boolean;
	item: QuestionItemI;
	numberOfAnswers: number;
	itemNumber: number;
	checkboxes: boolean[];
	type: Question['type'];
	min: Function;
	editMode: boolean;
}
const props = defineProps<Props>();

const itemValue = (n: number): number => props.min(props.type) + n;

/**
 * Updates an answer
 * @param questionId the question where the answer to update is
 * @param itemId the item to update
 * @param answer the new answer
 */
const changeAnswer = (answer: number): void => {
	// return if we are not in question mode
	if (!props.editMode) return;
	const previousAnswer = props.item.answer || props.item.answer === 0 ? props.item.answer : -1;

	if (answer === previousAnswer) delete props.item.answer;
	else props.item.answer = answer;
};

/**
 * Handles the delete of a comment, prompts with a confirmation question and in case proceeds to delete the message
 */
const handleDeleteComment = () => {
	const proceed = confirm(
		`Sicuro di voler cancellare il commento\n"${props.item.comment}"\ndella domanda\n"${props.item.text}"?`
	);

	// if answer is negative return
	if (!proceed) return;

	delete props.item.comment;
};
</script>

<template>
	<div
		v-if="!onlyShowAnswersWithComment || item.hasOwnProperty('comment')"
		class="grid grid-cols-6 relative"
	>
		<!-- question -->
		<div
			:class="[item.text ? 'col-span-4' : 'col-span-1']"
			class="p-2 border border-black flex justify-between"
		>
			{{ itemNumber + 1 }}. {{ item.text }}
		</div>
		<!-- ANSWERS -->
		<div :class="[item.text ? 'col-span-2' : 'col-span-5']">
			<!-- ! IF MUL -->
			<div
				v-if="item.multipleAnswers"
				class="flex h-full"
			>
				<div
					v-for="ans in item.multipleAnswers"
					:style="`flex-basis: calc(100% / ${item.multipleAnswers.length})`"
					:key="ans.id"
				>
					<div
						class="answer-cell border border-black flex-grow flex justify-center items-center h-full p-2"
						:class="[ans.points === item.answer ? 'bg-green-500' : '', editMode ? 'cursor-pointer' : '']"
						@click="changeAnswer(ans.points)"
					>
						{{ ans.customAnswer }}
					</div>
				</div>
			</div>
			<!-- ! IF OTHER TYPE -->
			<div
				v-else
				class="flex h-full"
			>
				<!-- @vue-ignore -->
				<div
					v-for="(answer, n) in numberOfAnswers"
					:key="n"
					class="flex-grow h-full"
					:class="{ hidden: !checkboxes[n] && !checkboxes.every(cb => !cb) }"
				>
					<div
						class="answer-cell border border-black flex-grow flex justify-center items-center h-full"
						:class="[itemValue(n) === item.answer ? 'bg-green-500' : '', editMode ? 'cursor-pointer' : '']"
						@click="changeAnswer(itemValue(n))"
					>
						{{ type === 'EDI' ? (n < 2 ? 0 : n - 2) : itemValue(n) }}
					</div>
				</div>
			</div>
		</div>
		<!-- COMMENTS -->
		<!-- comment for the digital version -->
		<div
			class="comment-container non-printable"
			v-if="item.comment"
		>
			<div class="flex">
				<font-awesome-icon
					:icon="['far', 'comment-dots']"
					size="xl"
					class="p-2"
				/>
			</div>
			<div class="comment flex">
				<!-- comment delete button -->
				<span class="grow">{{ item.comment }}</span>
				<font-awesome-icon
					@click="handleDeleteComment()"
					:icon="['fas', 'trash-can']"
					size="sm"
					class="ms-1 text-red-500 z-0 self-start cursor-pointer p-2"
				/>
			</div>
		</div>
		<!-- comment for the print version -->
		<div
			v-if="item.comment"
			class="hidden printable"
		>
			*{{ item.comment }}
		</div>
	</div>
</template>

<style scoped></style>
