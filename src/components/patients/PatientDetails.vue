<script lang="ts" setup>
import { computed } from 'vue';
import { Patient } from '@/assets/data/interfaces';
import { usePatientsStore } from '@/stores';

interface Props {
	patient: Patient;
}
const props = defineProps<Props>();

const labels = computed(() => usePatientsStore().labels);
const keys = Object.keys(labels.value) as Array<keyof Patient>;

/**
 * Maps the patient adding formatting to some fields
 */
const mappedPatient = computed(() => {
	const mappedPatient: Patient = { ...props.patient };

	if (mappedPatient.email)
		mappedPatient.email = `<a href="mailto:${props.patient.email}" class="font-medium text-blue-600 hover:underline">${props.patient.email}</a>`;

	if (mappedPatient.phone)
		mappedPatient.phone = `<a href="https://wa.me/${props.patient.phone}" target="_blank" class="font-medium text-blue-600 hover:underline">${props.patient.phone}</a>`;

	if (mappedPatient.weight) mappedPatient.weight = props.patient.weight + ' kg';
	if (mappedPatient.height) mappedPatient.height = props.patient.height + ' cm';

	return mappedPatient;
});
</script>

<template>
	<ul>
		<li
			v-for="key in keys"
			:key="key"
		>
			<div v-if="key !== 'id'">
				<strong>{{ labels[key] }}: </strong>
				<span v-html="mappedPatient[key] || 'n/d'"></span>
			</div>
		</li>
	</ul>
</template>

<style scoped></style>
