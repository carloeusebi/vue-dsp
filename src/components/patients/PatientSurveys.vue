<script lang="ts" setup>
import { computed, ref } from 'vue';

import AppTable from '../AppTable.vue';
import SurveyRow from '../surveys/SurveyRow.vue';

import { useSurveysStore } from '@/stores';
import { Cell, Order, Survey } from '@/assets/data/interfaces';
import { useSort } from '@/composables';
import AppAlert from '../AppAlert.vue';

const props = defineProps({
	patientId: {
		type: Number,
		required: true,
	},
});

const surveys = computed(() => useSurveysStore().getByPatientId(props.patientId));

const surveyCells: Cell<Survey>[] = [
	{ label: 'Titolo', key: 'title' },
	{ label: 'Ultima modifica', key: 'updated_at' },
	{ label: '', key: 'completed' },
];
const order = ref<Order<Survey>>({ by: 'updated_at', direction: 'up' });

const changeOrder = (newOrder: Order<Survey>) => {
	order.value = { ...newOrder };
};

const orderedSurveys = computed(() => useSort(surveys.value, order.value));
</script>

<template>
	<div v-if="surveys.length > 0">
		<AppTable
			class="survey-table"
			:cells="surveyCells"
			@sort-change="changeOrder"
		>
			<template #tbody>
				<SurveyRow
					v-for="survey in orderedSurveys"
					:key="survey.id"
					:survey="survey"
					page="patients"
				/>
			</template>
		</AppTable>
	</div>
	<div v-else>
		<AppAlert
			:show="true"
			message="Nessun sondaggio."
		/>
	</div>
</template>

<style scoped lang="scss">
.survey-table {
	// completed row
	:deep(th:nth-of-type(3)),
	:deep(td:nth-of-type(3)) {
		padding: 8px;
		width: 30px;
	}

	// details row
	:deep(th:last-of-type),
	:deep(td:last-of-type) {
		width: 75px;
	}

	// last_update row
	:deep(th:nth-child(2)),
	:deep(td:nth-child(2)) {
		display: none;
	}

	@media screen and (min-width: 650px) {
		:deep(th:nth-child(2)),
		:deep(td:nth-child(2)) {
			display: table-cell;
		}
	}
}
</style>
