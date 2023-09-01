<script lang="ts" setup>
interface Props {
	scores: Scores;
}

interface Scores {
	[key: string]: Question;
}

interface Question {
	[key: string]: Variable;
}

interface Variable {
	cutoffs: Cutoff[];
	score: number;
}

interface Cutoff {
	cutoff: string;
	scored: boolean;
}

const props = defineProps<Props>();
const questions = Object.keys(props.scores);
const variables = (question: string): string[] => Object.keys(props.scores[question]);

const hasScored = (variable: Variable) =>
	variable.cutoffs.reduce((scored: boolean, cutoffs) => cutoffs.scored || scored, false);
</script>

<template>
	<ul v-if="scores">
		<li
			v-for="question in questions"
			:key="question"
			class="mb-3"
		>
			<div>
				<strong>{{ question }}</strong>
			</div>
			<ul class="ms-3">
				<li
					v-for="variable in variables(question)"
					:key="variable"
				>
					<span
						class="p-1"
						:class="{ 'bg-yellow-200': hasScored(scores[question][variable]) }"
					>
						{{ variable }}: {{ scores[question][variable].score }}
					</span>
				</li>
			</ul>
		</li>
	</ul>
</template>

<style scoped></style>
