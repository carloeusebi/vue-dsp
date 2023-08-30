<script lang="ts" setup>
import { ref } from 'vue';
import { Cell, Patient, Survey } from '@/assets/data/interfaces';

const order = ref({ by: 'id', direction: 'down' });

interface Props {
	cells: Cell<Patient | Survey>[];
	hasReset: boolean;
	canSort: boolean;
}

defineProps<Props>();

const emit = defineEmits(['sort-change']);

const sort = (prop: string, direction = false) => {
	if (direction) {
		order.value.by = 'asc';
		order.value.direction = 'down';
	}
	if (prop === order.value.by) {
		order.value.direction = order.value.direction === 'up' ? 'down' : 'up';
	} else {
		order.value.direction = 'down';
	}
	order.value.by = prop;

	emit('sort-change', order.value);
};
</script>

<template>
	<thead>
		<tr
			class="cursor-pointer text-center select-none text-md font-semibold tracking-wide text-gray-900 bg-gray-100 uppercase border-b border-gray-600"
		>
			<th
				v-for="cell in cells"
				class="px-4 py-3"
				@click="sort(cell.key)"
				:key="cell.key"
			>
				<div class="flex justify-between items-center">
					<div
						class="grow"
						v-html="cell.label"
					></div>
					<font-awesome-icon
						v-if="canSort"
						:class="{ 'opacity-0': order.by !== cell.key }"
						:icon="`fa-solid fa-angle-${order.direction}`"
					/>
				</div>
			</th>
			<th
				v-if="hasReset"
				@click="sort('id', true)"
			>
				<div
					v-if="canSort"
					class="flex justify-center items-center"
				>
					Resetta
				</div>
			</th>
		</tr>
	</thead>
</template>
