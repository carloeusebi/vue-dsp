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
import SurveyScoreList from '@/components/surveys/SurveyScoreList.vue';
import SurveySendEmail from '@/components/surveys/SurveySendEmail.vue';
import { Alert } from '@/assets/data/interfaces';

const getScores = async (id: undefined | number) => {
	if (!id) return;
	isFetching.value = true;
	try {
		const { data } = await axiosInstance.get(`surveys/score/${id}`);
		scores.value = data;
	} catch (err) {
		console.error(err);
	} finally {
		isFetching.value = false;
	}
};

const copyUrl = async () => {
	try {
		await navigator.clipboard.writeText(link.value);
	} catch (e) {
		alert(e);
	}
};

const handleEmailSent = (alertConfig: Alert) => {
	appAlert.value = { ...alertConfig };
};

const id = parseInt(useRoute().params.id as string);
const isFetching = ref(false);
const loader = useLoaderStore();
const surveysStore = useSurveysStore();
const survey = computed(() => surveysStore.getById(id));
const scores = ref();
const appAlert = ref<Alert>({
	show: false,
	type: 'info',
	title: '',
	message: '',
});

const link = computed(() => `${import.meta.env.VITE_BASE_URL}/admin/questionario/${survey.value?.token}`);

getScores(id);
</script>

<template>
	<header class="flex justify-between mt-5">
		<AppBackButton />
		<div
			v-if="survey"
			class="flex gap-2 justify-end"
		>
			<!-- SCORES -->
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
			<!-- RESULTS -->
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
			<!-- EMAIL -->
			<SurveySendEmail
				:survey="survey"
				:link="link"
				@attempt="appAlert.show = false"
				@send-email="handleEmailSent"
			/>
			<SurveyDelete :to-delete-survey="survey" />
		</div>
	</header>

	<hr class="my-5" />

	<div class="mb-5">
		<AppAlert
			:show="appAlert.show"
			:type="appAlert.type"
			:title="appAlert.title"
			:message="appAlert.message"
		/>
	</div>

	<div v-if="survey">
		<div class="flex items-center gap-2 mb-3">
			<h1 class="text-3xl font-bold">{{ survey.title }} di {{ survey.patient_name }}</h1>
			<font-awesome-icon
				v-if="survey.completed"
				:icon="['far', 'square-check']"
				size="2xl"
			/>
		</div>
		<div class="grid lg:grid-cols-2 gap-3">
			<div>
				<SurveyDetails :survey="survey" />

				<!-- COPY LINK BUTTONS -->
				<AppButtonBlank
					v-if="!survey.completed"
					@click="copyUrl"
					class="my-3"
					label="Copia link negli appunti"
					icon="copy"
				/>
				<hr class="my-5 lg:hidden" />
			</div>
			<!-- SCORES -->
			<div class="scores lg:min-h-[400px] max-h-[400px] lg:max-h-[600px] overflow-y-scroll rounded-md p-3">
				<div
					v-if="isFetching"
					class="w-full h-full flex justify-center items-center"
				>
					<font-awesome-icon
						:icon="['fas', 'spinner']"
						spin
						size="2xl"
					/>
				</div>
				<SurveyScoreList
					v-if="scores"
					:scores="scores"
				/>
				<AppAlert
					v-else
					:show="!loader.isLoading && !isFetching"
					title="Aspetta"
					:message="`${survey.title} di ${survey.patient_name} non è stato ancora completato.`"
				/>
				<div class="px-5"></div>
			</div>
		</div>
	</div>

	<!-- SURVEY NOT FOUND -->
	<div v-else>
		<div class="my5">
			<AppAlert
				:show="!loader.isLoading && !isFetching"
				message="Nessun Sondaggio trovato."
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.scores {
	box-shadow: 0 0 30px 1px inset #ddd;
}
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
	scrollbar-width: thin;
	scrollbar-color: #a3a3a3 #ffffff;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
	width: 6px;
}

*::-webkit-scrollbar-track {
	background: transparent;
	margin: 10px;
}

*::-webkit-scrollbar-thumb {
	background-color: #a3a3a3;
	border-radius: 20px;
	border: 1px none #000000;
}
</style>
