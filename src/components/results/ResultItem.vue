<script lang="ts" setup>
import { Question, QuestionItemI } from '@/assets/data/interfaces';
import { computed } from 'vue';

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
const emit = defineEmits(['update']);

const atLeastOneCheckboxIsChecked = computed(() => !props.checkboxes.every(cb => !cb));

/**
 * Checks if item should be visible.
 * It should not visible when `only show items with comment` checkbox is checked AND item has no comment
 * OR when question is being filtered by answer and the answer is not filtered.
 */
const showItem = computed(() => {
	const reverseAnswer = (answer: number): number => {
		let min = 0;
		let max = 5;
		if (props.type === 'MUL') return answer;
		else if (props.type !== 'EDI') {
			min = parseInt(props.type.at(0) as string);
			max = parseInt(props.type.at(-1) as string);
		}
		return min + max - answer;
	};

	const { item, onlyShowAnswersWithComment, checkboxes } = props;

	// if item has not been answered always show the item.
	if (!item.answer && item.answer !== 0) return true;

	// filter by comments
	let showBasedOnCommentFilter = !onlyShowAnswersWithComment || item.hasOwnProperty('comment');

	// filter by answer

	let showBasedOnAnswerFilter = checkboxes.every(cb => !cb); // when every checkbox is NOT checked, show the item!

	const answerValue = item.reversed ? reverseAnswer(item.answer) : item.answer;

	showBasedOnAnswerFilter = showBasedOnAnswerFilter || checkboxes[answerValue];

	return Boolean(showBasedOnCommentFilter && showBasedOnAnswerFilter);
});

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

	emit('update');
};
</script>

<template>
	<div>
		<div
			v-if="showItem"
			class="grid grid-cols-6 relative"
		>
			<!-- question -->
			<div
				:class="[
					item.text ? 'col-span-4' : 'col-span-1',
					{ 'bg-yellow-100': atLeastOneCheckboxIsChecked && item.reversed },
				]"
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
	</div>
</template>

<style lang="scss" scoped>
.answer-cell {
	transition: all 750ms;
}
.comment-container {
	position: absolute;
	top: 50%;
	left: 100.5%;
	transform: translateY(-50%);
	z-index: 1;

	.fa-comment-dots {
		z-index: -10;
	}

	&:hover .comment {
		display: flex;
	}
}

.comment {
	position: absolute;
	top: -10px;

	justify-content: center;
	align-items: center;
	display: none;
	background-color: #fff;
	padding: 1rem 2rem;
	box-shadow: 0 0 10px 2px black;
	z-index: 10;
	border-radius: 20px;
	right: 5px;
	min-width: max-content;
	max-width: 75vw;
}
</style>
