<script lang="ts" setup>
import { Cell, Patient } from '@/assets/data/interfaces';

interface Props {
	patient: Patient;
	cells: Cell<Patient>[];
}

defineProps<Props>();
</script>

<template>
	<!-- TABLE ROW -->
	<tr class="text-gray-700 hover:bg-gray-100 transition-colors">
		<td
			v-for="cell in cells"
			:key="cell.key"
			class="px-4 py-3 text-ms border"
			:class="{ 'font-semibold': cell.key === 'fname' || cell.key === 'lname' }"
		>
			{{ patient[cell.key] }}
		</td>
		<td class="px-4 py-3 text-sm border text-center">
			<router-link :to="{ name: 'patients.show', params: { id: patient.id } }">
				<span
					class="px-3 py-2 font-semibold leading-tight text-sky-700 bg-sky-100 rounded-sm cursor-pointer select-none hover:bg-sky-200 transition-colors"
				>
					Dettagli
				</span>
			</router-link>
		</td>
	</tr>
</template>
