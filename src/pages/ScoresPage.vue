<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { isAxiosError } from 'axios';

import ResultsHeader from '@/components/ResultsHeader.vue';
import ResultsPatient from '@/components/ResultsPatient.vue';

import { useLoaderStore } from '@/stores';
import axiosInstance from '@/assets/axios';
import { Question, QuestionVariableCutoff, Survey } from '@/assets/data/interfaces';

interface Scores {
	[string: string]: { [string: string]: number };
}

const id = useRoute().params.id;
const loader = useLoaderStore();
const survey = ref<Survey | null>(null);
const scores = ref<Scores | null>(null);
const error = ref('');

/**
 * On mount fetches all survey details and the survey scores
 */
onMounted(async () => {
	loader.setLoader();
	try {
		const res = await axiosInstance.get(`surveys/score/${id}`);
		survey.value = res.data.survey;
		scores.value = res.data.scores;
	} catch (err) {
		if (isAxiosError(err)) {
			if (err.response?.status === 403) alert("Devi aver effettuato l'accesso per vedere questa pagina");
			else if (err.response?.status === 404) error.value = 'Test non trovato';
			else if (err.response?.status === 422) error.value = err.response?.data.message;
		} else alert(err);
	} finally {
		loader.unsetLoader();
	}
});

const score = (question: Question['question'], variable: string): number => {
	return scores.value ? scores.value[question][variable] : 0;
};

const printCutoff = (cutoff: QuestionVariableCutoff): string => {
	let elementToPrint = '';
	const { type } = cutoff;

	if (type === 'greater-than') elementToPrint = `> ${cutoff.from}`;
	else if (type === 'lesser-than') elementToPrint = `< ${cutoff.from}`;
	else elementToPrint = `${cutoff.from} - ${cutoff.to}`;

	return elementToPrint;
};

const scored = (score: number, cutoff: QuestionVariableCutoff): boolean => {
	const { type } = cutoff;

	if (type === 'greater-than') {
		return score > cutoff.from;
	} else if (type === 'lesser-than') {
		return score < cutoff.from;
	} else {
		return score >= cutoff.from && score <= cutoff.to;
	}
};

const hasUnansweredItems = (question: Question): boolean => question.items.some(item => item.answer === -1);
</script>

<template>
	<div class="bg-white min-h-screen">
		<div class="container max-w-6xl mx-auto p-6">
			<!-- HEADER -->
			<ResultsHeader :title="survey?.title" />

			<!-- PATIENT -->
			<ResultsPatient
				v-if="survey?.patient"
				:patient="survey?.patient"
			/>

			<!-- error -->
			<h1
				class="text-xl font-bold"
				v-if="error"
			>
				! {{ error }}
			</h1>

			<!-- RESULTS -->
			<div v-if="scores">
				<section
					v-for="question in survey?.questions"
					:key="question.id"
					:id="question.id.toString()"
				>
					<!-- questionnaire's name -->
					<h2>
						{{ question.question }}
					</h2>
					<div
						v-if="hasUnansweredItems(question)"
						class="text-red-500 mb-3 print:hidden"
					>
						<font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
						Questo questionario ha domande senza risposta!
					</div>

					<!-- VARIABLES -->
					<ul>
						<li
							v-for="variable in question.variables"
							:key="variable.id"
						>
							<div class="font-bold mb-3">{{ variable.name }}: {{ score(question.question, variable.name) }}</div>
							<table class="table-auto">
								<thead>
									<tr>
										<td class="text-center min-w-[66px]">Cutoff</td>
										<td class="px-3 md:px-6"></td>
										<td>Indicazioni</td>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="cutoff in variable.cutoffs"
										:key="cutoff.id"
									>
										<td class="text-center align-top">{{ printCutoff(cutoff) }}</td>
										<td></td>
										<td :class="{ 'bg-yellow-200': scored(score(question.question, variable.name), cutoff) }">
											{{ cutoff.name }}
										</td>
									</tr>
								</tbody>
							</table>
							<hr class="my-3" />
						</li>
					</ul>

					<hr class="mb-8" />
				</section>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
