<script lang="ts" setup>
import { ref, Ref } from 'vue';

import AppModal from '@/components/AppModal.vue';
import AppAlert from '@/components/AppAlert.vue';
import AppButtonBlank from '@/components/AppButtonBlank.vue';
import AppButton from '@/components/AppButton.vue';
import PatientForm from './PatientForm.vue';

import { Patient } from '@/assets/data/interfaces';
import { emptyPatient } from '@/assets/data/data';
import { useSaveToStore, useScrollTo } from '@/composables';
import { usePatientsStore } from '@/stores';
import { useRouter } from 'vue-router';

interface Props {
	title: string;
	toEditPatient?: Patient;
	icon: string;
	buttonLabel: string;
}

// if no toEditPatient, patient default to an empty one
const props = withDefaults(defineProps<Props>(), {
	toEditPatient: () => ({ ...(emptyPatient as Patient) }),
});

const emit = defineEmits(['patient-save']);

const router = useRouter();
const showModal = ref(false);
const patientRef: Ref<Patient> = ref({ ...props.toEditPatient });
// modal component ref
const modalComponent = ref<InstanceType<typeof AppModal> | null>(null);

const errors = ref<string[]>([]);

/**
 * Prepares patient's info and then loads store
 */
const handleSavePatient = async () => {
	errors.value = [];

	const patientStore = usePatientsStore();
	errors.value = await useSaveToStore(patientRef.value, patientStore);

	if (!errors.value.length) {
		showModal.value = false;
		patientRef.value = { ...(props.toEditPatient || (emptyPatient as Patient)) };
		const id = patientStore.lastInsertedId;
		router.push({ name: 'patients.show', params: { id } });
		emit('patient-save');
	} else {
		// scrolls the modal to the top, needed to show errors when on smartphones
		useScrollTo(modalComponent.value?.$refs.modal as HTMLTemplateElement, 0);
	}
};
</script>

<template>
	<AppButtonBlank
		@click="showModal = true"
		:icon="icon"
		:label="title"
	/>

	<AppModal
		@close="showModal = false"
		:open="showModal"
		class="relative"
		ref="modalComponent"
	>
		<template v-slot:content>
			<h2>{{ title }}</h2>

			<!-- ALERT -->
			<AppAlert
				:show="errors.length > 0"
				type="warning"
				title="Attenzione"
				class="my-4"
			>
				<ul>
					<li
						v-for="error in errors"
						:key="error"
					>
						{{ error }}
					</li>
				</ul>
			</AppAlert>
			<hr class="mb-10" />

			<!-- FORM -->
			<form
				id="patient-form"
				@submit.prevent="handleSavePatient"
			>
				<PatientForm :patient="patientRef" />
			</form>
		</template>
		<template v-slot:button>
			<AppButton form="patient-form">
				{{ buttonLabel }}
			</AppButton>
		</template>
	</AppModal>
</template>
