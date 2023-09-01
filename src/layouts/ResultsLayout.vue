<script lang="ts" setup>
import { Survey } from '@/assets/data/interfaces';
import ResultsHeader from '@/components/results/ResultsHeader.vue';
import ResultsPatient from '@/components/results/ResultsPatient.vue';
import { useLoaderStore, useSurveysStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const surveyId = parseInt(useRoute().params.id as string);
const survey = ref<Survey | undefined>();
const loader = useLoaderStore();

onMounted(async () => {
	loader.setLoader();
	survey.value = await useSurveysStore().fetchById(surveyId);
	loader.unsetLoader();
});
</script>

<template>
	<div class="bg-white min-h-screen min-w-screen">
		<div class="container max-w-6xl mx-auto p-6">
			<header>
				<ResultsHeader :title="survey?.title || ''" />
				<ResultsPatient
					v-if="survey?.patient && !loader.isLoading"
					:patient="survey?.patient"
				/>
			</header>
			<main>
				<router-view :survey="survey"></router-view>
			</main>
		</div>
	</div>
</template>

<style lang="scss">
.printable {
	display: none;
}

// PRINT MEDIA
@media print {
	.non-printable {
		display: none;
	}

	.printable {
		display: block;
	}
}
</style>
