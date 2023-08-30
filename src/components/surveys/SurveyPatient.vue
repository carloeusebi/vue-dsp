<script lang="ts" setup>
import { Patient } from '@/assets/data/interfaces';

interface Props {
	patient: Patient;
}
defineProps<Props>();
</script>

<template>
	<ul>
		<!-- name -->
		<li>
			<strong>Nome del paziente: </strong>
			<router-link
				:to="{ name: 'patients.show', params: { id: patient.id } }"
				class="font-medium text-blue-600 hover:underline"
			>
				{{ patient.fname }} {{ patient.lname }}
			</router-link>
		</li>
		<!-- email -->
		<li>
			<strong>Email: </strong>
			<a
				v-if="patient.email"
				:href="`mailto:${patient.email}`"
				class="font-medium text-blue-600 hover:underline"
			>
				{{ patient.email }}
			</a>
			<span v-else>n/d</span>
		</li>
		<!-- phone -->
		<li>
			<strong>Numero di telefono: </strong>
			<a
				v-if="patient.phone"
				:href="`https://wa.me/:${patient.phone}`"
				target="_blank"
				class="font-medium text-blue-600 hover:underline"
				>{{ patient.phone }}</a
			>
			<span v-else>Nessun numero di telefono inserito</span>
		</li>
	</ul>
</template>
