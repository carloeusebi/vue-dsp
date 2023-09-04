<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';

import AppSearchbar from '@/components/AppSearchbar.vue';
import AppAlert from '@/components/AppAlert.vue';
import AppTable from '../components/AppTable.vue';
import SurveyRow from '../components/surveys/SurveyRow.vue';
import SurveyCreate from '@/components/surveys/SurveyCreate.vue';
import AppPagination from '@/components/AppPagination.vue';

import { useLoaderStore, useSurveysStore } from '@/stores';
import { useExtractQueryParams, usePagination } from '@/composables';
import { Cell, Order, Survey } from '@/assets/data/interfaces';

const SURVEYS_PER_PAGE = 25;

const surveysStore = useSurveysStore();
const { surveys } = storeToRefs(surveysStore);
const { alertType, alertMessage } = useExtractQueryParams() as {
	alertType: 'success' | 'info' | 'warning';
	alertMessage: string;
};
const loader = useLoaderStore();

const tableCells: Ref<Cell<Survey>[]> = ref([
	{ label: 'Paziente', key: 'patient_name' },
	{ label: 'Titolo', key: 'title' },
	{ label: 'Creato il', key: 'created_at' },
	{ label: 'Ultima modifica', key: 'updated_at' },
	{ label: '<span class="hidden md:inline">Compl</span>', key: 'completed' },
]);

const defaultOrder: Order<Survey> = { by: 'created_at', direction: 'up' };

const changeOrder = (newOrder: Order<Survey>) => {
	order.value = { ...newOrder };
};

const { handleSearchbarKeypress, order, pages, activePage, filteredAndOrdered } = usePagination(
	surveys,
	['title', 'patient_name'],
	defaultOrder,
	SURVEYS_PER_PAGE
);

const handlePageClick = (newPage: number) => {
	activePage.value = newPage;
};
</script>

<template>
	<section class="relative mt-6">
		<!-- SEARCH -->
		<div class="relative flex justify-between w-full">
			<AppSearchbar @key-press="handleSearchbarKeypress" />
		</div>
		<AppAlert
			:show="alertMessage != undefined && alertType != undefined"
			:type="alertType"
			:message="alertMessage"
			class="my-5"
		/>

		<div class="flex justify-between my-3 px-3">
			<h1 class="text-3xl font-bold">Batterie</h1>
			<!-- CREATE BUTTON -->
			<div class="flex gap-2">
				<SurveyCreate />
				<!-- QUESTIONS BUTTON -->
			</div>
		</div>

		<!-- TABLE -->
		<AppPagination
			:total-pages="pages.length"
			:current-page="activePage"
			:showing-per-page="SURVEYS_PER_PAGE"
			:results="filteredAndOrdered.length"
			@page-click="handlePageClick"
		/>

		<AppTable
			v-if="filteredAndOrdered.length > 0"
			@sort-change="changeOrder"
			:cells="tableCells"
			:reset-to="defaultOrder"
		>
			<template #tbody>
				<SurveyRow
					v-for="survey in pages[activePage]"
					:survey="survey"
					:key="survey.id || survey.title"
					page="surveys"
				/>
			</template>
		</AppTable>
		<div v-else>
			<AppAlert
				:show="!loader.isLoading"
				title="Ops!"
			>
				Nessun sondaggio trovato!
			</AppAlert>
		</div>
	</section>
</template>

<style scoped>
/* name column */
:deep(td:first-of-type) {
	max-width: 100px;
}

/* min width to prevent dates to break line */
:deep(td:nth-child(3)),
:deep(td:nth-child(4)) {
	max-width: 100px;
}

/* completed column */
:deep(th:nth-of-type(5)),
:deep(td:nth-of-type(5)) {
	max-width: 30px;
	padding: 0.25rem;
	text-align: center;
}

:deep(th:nth-of-type(3)),
:deep(td:nth-of-type(3)),
:deep(th:nth-of-type(4)),
:deep(td:nth-of-type(4)) {
	display: none;
}

/* tablet */
@media screen and (min-width: 768px) {
	:deep(th:nth-of-type(3)),
	:deep(td:nth-of-type(3)),
	:deep(th:nth-of-type(4)),
	:deep(td:nth-of-type(4)),
	:deep(th:nth-of-type(5)),
	:deep(td:nth-of-type(5)) {
		display: table-cell;
	}

	:deep(th:nth-of-type(5)),
	:deep(td:nth-of-type(5)) {
		max-width: 50px;
	}
}
</style>
