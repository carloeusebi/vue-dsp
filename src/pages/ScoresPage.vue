<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { isAxiosError } from 'axios';

import { useLoaderStore } from '@/stores';
import axiosInstance from '@/assets/axios';
import { Question, Survey } from '@/assets/data/interfaces';
import { QuestionVariableCutoff } from '@/assets/data/interfaces';
import { QuestionVariableI } from '@/assets/data/interfaces';
import AppAlert from '@/components/AppAlert.vue';

const id = parseInt(useRoute().params.id as string);
const loader = useLoaderStore();
const survey = ref<Survey>();
const error = ref('');

/**
 * On mount fetches all survey details and the survey survey
 */
onMounted(async () => {
	loader.setLoader();
	try {
		const { data } = await axiosInstance.get(`surveys/${id}/results`);
		survey.value = data;
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

const hasUnansweredItems = (question: Question): boolean => question.items.some(item => item.answer === -1);

const printCutoff = (variable: QuestionVariableI, cutoff: QuestionVariableCutoff) => {
	let { from, to, type } = cutoff;

	//@ts-ignore sexScore is deprecated
	const isGenderBased = variable.genderBased || variable.sexScores;

	if (isGenderBased && survey.value?.patient.sex === 'F') {
		from ?? cutoff.femFrom;
		to ?? cutoff.femTo;
	}

	let printable = `${from} - ${to}`;
	if (type === 'greater-than') printable = `> ${from}`;
	if (type === 'lesser-than') printable = `< ${from}`;

	// if Variable is gender based also prints the cutoff
	return isGenderBased ? `${survey.value?.patient.sex} ${printable}` : printable;
};
</script>

<template>
	<!-- RESULTS -->
	<div v-if="survey">
		<section v-for="question in survey.questions">
			<!-- questionnaire's name -->
			<h2>
				{{ question.question }}
			</h2>

			<!-- UNANSWERED QUESTION ALERT -->
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
					<div class="font-bold mb-3">{{ variable.name }}: {{ variable.score }}</div>
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
								<td class="text-center align-top">{{ printCutoff(variable, cutoff) }}</td>
								<td></td>
								<td :class="{ 'bg-yellow-200': cutoff.scored }">
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
	<div v-else></div>
	<AppAlert
		:show="error.length > 0"
		type="warning"
		:message="error"
	/>
</template>

<style scoped></style>
