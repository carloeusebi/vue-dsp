<script lang="ts" setup>
import axiosInstance from '@/assets/axios';
import { FileRecord } from '@/assets/data/interfaces';
import { useLoaderStore, usePatientsStore } from '@/stores';
import { isAxiosError } from 'axios';

interface Props {
	file: FileRecord;
}

defineProps<Props>();

const deleteFile = async (file: FileRecord) => {
	const loader = useLoaderStore();
	loader.setLoader();

	const { id, patient_id } = file;

	try {
		await axiosInstance.delete(`file/${id}`);
		if (patient_id) {
			usePatientsStore().deletePatientFile(patient_id, id);
		}
	} catch (err) {
		if (isAxiosError(err)) console.warn(err.response?.data);
		else console.error(err);
	} finally {
		loader.unsetLoader();
	}
};
</script>

<template>
	<div
		class="absolute bg-white px-4 py-2 z-10 border border-gray-200 left-20 top-3 text-sm cursor-pointer shadow-md hover:bg-gray-50 select-none"
		@click="deleteFile(file)"
	>
		Cancella {{ file.name }}
	</div>
</template>

<style scoped></style>
