<script lang="ts" setup>
import { QuestionVariableI, Survey } from '@/assets/data/interfaces';

interface Props {
	scores: Survey;
}
defineProps<Props>();

const hasScored = (variable: QuestionVariableI): boolean => {
	return variable.cutoffs.reduce((scored, cutoff) => scored || cutoff.scored || false, false);
};
</script>

<template>
	<ul v-if="scores">
		<li
			v-for="question in scores.questions"
			:key="question.id"
			class="mb-3"
		>
			<div>
				<strong>{{ question.question }}</strong>
			</div>
			<ul class="ms-3">
				<li
					v-for="variable in question.variables"
					:key="variable.id"
				>
					<span
						class="p-1 rounded-lg"
						:class="{ 'bg-yellow-200': hasScored(variable) }"
					>
						{{ variable.name }}: {{ variable.score }}
					</span>
				</li>
			</ul>
		</li>
	</ul>
</template>

<style scoped></style>
