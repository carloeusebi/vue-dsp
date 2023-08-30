<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { usePatientsStore } from '@/stores';
import { storeToRefs } from 'pinia';

import PatientRow from '@/components/patients/PatientRow.vue';
import AppAlert from '@/components/AppAlert.vue';
import PatientSave from '@/components/patients/PatientSave.vue';
import AppSearchbar from '@/components/AppSearchbar.vue';
import AppTable from '../components/AppTable.vue';
import AppPagination from '@/components/AppPagination.vue';

import { Cell, Order, Patient } from '@/assets/data/interfaces';
import { usePagination } from '@/composables';

const PATIENTS_PER_PAGE = 25;

const patientsStore = usePatientsStore();
const { patients } = storeToRefs(patientsStore);

const tableCells: Ref<Cell<Patient>[]> = ref([
	{ label: 'Nome', key: 'fname' },
	{ label: 'Cognome', key: 'lname' },
	{ label: 'Età', key: 'age' },
	{ label: 'Email', key: 'email' },
	{
		label: `<div><span class="hidden md:inline">Data </span>Inizio<span class="hidden xl:inline"> Terapia</span></div>`,
		key: 'begin',
	},
]);

const changeOrder = (newOrder: Order<Patient>) => {
	order.value = { ...newOrder };
};

const { handleSearchbarKeypress, order, pages, activePage, filteredAndOrdered } = usePagination(
	patients,
	['fname', 'lname'],
	{ by: 'id', direction: 'down' },
	PATIENTS_PER_PAGE
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
			<!-- CREATE PATIENTS -->
		</div>
		<div class="flex justify-between my-3 px-3">
			<h1 class="text-3xl font-bold">Pazienti</h1>
			<PatientSave
				icon="plus"
				title="Aggiungi un paziente"
				button-label="Aggiungi"
			/>
		</div>

		<!-- PAGINATION -->
		<AppPagination
			:total-pages="pages.length"
			:current-page="activePage"
			:showing-per-page="PATIENTS_PER_PAGE"
			:results="filteredAndOrdered.length"
			@page-click="handlePageClick"
		/>

		<!-- TABLE -->
		<AppTable
			v-if="filteredAndOrdered.length > 0"
			@sort-change="changeOrder"
			:cells="tableCells"
			:has-reset="true"
		>
			<template v-slot:tbody>
				<PatientRow
					v-for="patient in pages[activePage]"
					:cells="tableCells"
					:patient="patient"
					:key="patient.id || patient.lname + patient.fname"
				/>
			</template>
		</AppTable>
		<div v-else>
			<AppAlert
				:show="true"
				title="Ops!"
			>
				Nessun paziente trovato!
			</AppAlert>
		</div>
	</section>
</template>

<style scoped>
:deep(tr td:nth-child(5)) {
	min-width: 120px;
}

/* fname and lname */
:deep(th:nth-of-type(1)),
:deep(th:nth-of-type(2)) {
	width: 200px;
}

/* age */
:deep(th:nth-of-type(3)) {
	width: 35px;
	text-align: center;
}

:deep(th:nth-of-type(3)),
:deep(td:nth-of-type(3)),
:deep(th:nth-of-type(4)),
:deep(td:nth-of-type(4)),
:deep(th:nth-of-type(5)),
:deep(td:nth-of-type(5)) {
	display: none;
}

/* tablet */
@media screen and (min-width: 768px) {
	:deep(th:nth-of-type(3)),
	:deep(td:nth-of-type(3)),
	:deep(th:nth-of-type(5)),
	:deep(td:nth-of-type(5)) {
		display: table-cell;
	}
}

/* laptop */
@media screen and (min-width: 992px) {
	:deep(th:nth-of-type(4)),
	:deep(td:nth-of-type(4)) {
		display: table-cell;
	}
}
</style>
