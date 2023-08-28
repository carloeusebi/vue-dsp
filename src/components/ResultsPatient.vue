<script lang="ts" setup>
import { Patient } from '@/assets/data/interfaces';

interface Props {
	patient: Patient;
}

defineProps<Props>();
</script>

<template>
	<section
		id="patient"
		class="border-b pb-2 mb-5"
	>
		<div>
			<h2 class="mb-3">Paziente:</h2>
			<strong>Nome e cognome: </strong>{{ patient?.fname }}
			{{ patient?.lname }}
		</div>
		<div>
			<span><strong>Età: </strong>{{ patient?.age }}</span>
			<span
				class="ms-3"
				v-if="patient?.weight"
				>| <strong>Peso: </strong>{{ patient?.weight }}kg</span
			>
			<span
				class="ms-3"
				v-if="patient?.height"
				>| <strong>Altezza: </strong>{{ patient?.height }}cm</span
			>
		</div>
		<div v-if="patient?.job"><strong>Professione: </strong>{{ patient?.job }}</div>
		<div v-if="patient?.cohabitants"><strong>Vive con: </strong>{{ patient?.cohabitants }}</div>
	</section>
</template>

<style scoped></style>
