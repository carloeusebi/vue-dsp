<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import AppAlert from '@/components/AppAlert.vue';
import AppBackButton from '@/components/AppBackButton.vue';
import AppButtonBlank from '@/components/AppButtonBlank.vue';
import SurveyDelete from '@/components/surveys/SurveyDelete.vue';
import SurveyDetails from '@/components/surveys/SurveyDetails.vue';

import axiosInstance from '@/assets/axios';
import { useLoaderStore, useSurveysStore } from '@/stores';

const getScores = async (id: undefined | number) => {
	if (!id) return;
	try {
		const { data } = await axiosInstance.get(`surveys/score/${id}`);
		scores.value = data;
	} catch (err) {
		console.error(err);
	}
};

const id = parseInt(useRoute().params.id as string);
const loader = useLoaderStore();
const surveysStore = useSurveysStore();
const survey = computed(() => surveysStore.getById(id));
const scores = ref();

getScores(id);
</script>

<template>
	<div>
		<AppAlert />
	</div>

	<header class="flex justify-between mt-5">
		<AppBackButton />
		<div
			v-if="survey"
			class="flex gap-2 justify-end"
		>
			<router-link
				v-if="survey.completed"
				target="_blank"
				:to="{ name: 'scores', params: { id: survey.id } }"
			>
				<AppButtonBlank
					label="Visualizza Risultati"
					color="green"
					icon="square-poll-vertical"
				/>
			</router-link>
			<router-link
				target="_blank"
				:to="{ name: 'results', params: { id: survey.id } }"
			>
				<AppButtonBlank
					label="Visualizza Risposte"
					icon="list-check"
					color="green"
				/>
			</router-link>
			<AppButtonBlank
				v-if="!survey.completed"
				label="Invia un'email"
				icon="envelope"
			/>
			<SurveyDelete :to-delete-survey="survey" />
		</div>
	</header>

	<hr class="my-5" />

	<div v-if="survey">
		<div class="flex items-center gap-2 mb-3">
			<h1 class="text-3xl font-bold">{{ survey.title }} di {{ survey.patient_name }}</h1>
			<font-awesome-icon
				v-if="survey.completed"
				:icon="['far', 'square-check']"
				size="2xl"
			/>
		</div>
		<div class="grid lg:grid-cols-2">
			<div>
				<SurveyDetails :survey="survey" />
				<hr class="my-5 lg:hidden" />
			</div>
			<!-- SCORES -->
			<div
				v-if="scores"
				class="scores max-h-[600px] overflow-y-scroll rounded-md p-3"
			>
				<ul>
					<li
						v-for="(variables, question) in scores.scores"
						:key="question"
						class="mb-3"
					>
						<div>
							<strong>{{ question }}</strong>
						</div>
						<ul>
							<li
								v-for="(score, variable) in variables"
								:key="variable"
								class="ps-3"
							>
								{{ variable }}: {{ score }}
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- SURVEY NOT FOUND -->
	<div v-else>
		<div class="my5">
			<AppAlert
				:show="!loader.isLoading"
				message="Nessun Sondaggio trovato."
			/>
		</div>
	</div>
</template>

<style scoped>
.scores {
	box-shadow: 0 0 30px 1px inset #ddd;
}
</style>
