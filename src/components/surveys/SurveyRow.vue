<script lang="ts" setup>
import { computed } from 'vue';
import { Survey } from '@/assets/data/interfaces';

// interfaces

interface Props {
	survey: Survey;
	page: 'patients' | 'surveys';
}

const props = defineProps<Props>();
const createdAt = computed(() => new Date(props.survey.created_at as string).toLocaleDateString());
const updatedAt = computed(() => {
	if (!props.survey.updated_at) return '-';

	return new Date(props.survey.updated_at).toLocaleDateString();
});

const completedIcon = computed(() => {
	return props.survey.completed ? 'square-check' : 'square';
});
</script>

<template>
	<!-- TABLE ROW -->
	<tr class="text-gray-700 hover:bg-gray-100 transition-colors">
		<!-- name -->
		<td
			v-if="page === 'surveys'"
			class="px-4 py-3 text-ms border font-bold"
		>
			{{ survey.patient_name }}
		</td>
		<!-- title -->
		<td class="px-4 py-3 text-ms border">
			{{ survey.title }}
		</td>
		<!-- created_at -->
		<td
			v-if="page === 'surveys'"
			class="px-4 py-3 text-ms border"
		>
			{{ createdAt }}
		</td>
		<!-- updated_at -->
		<td class="px-4 py-3 text-ms border">
			{{ updatedAt }}
		</td>
		<!-- completed -->
		<td class="px-4 py-3 text-ms border">
			<font-awesome-icon
				:icon="['far', completedIcon]"
				size="xl"
			/>
		</td>

		<!-- DETAILS BUTTON -->
		<td class="px-4 py-3 text-sm border text-center">
			<router-link :to="{ name: 'surveys.show', params: { id: survey.id } }">
				<span
					class="px-3 py-2 font-semibold leading-tight text-sky-700 bg-sky-100 rounded-sm cursor-pointer select-none hover:bg-sky-200 transition-colors"
				>
					Dettagli
				</span>
			</router-link>
		</td>
	</tr>
</template>
