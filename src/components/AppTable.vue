<script lang="ts" setup>
import AppTableHead from './AppTableHead.vue';

import { Cell, Order, Patient, Survey } from '@/assets/data/interfaces';

interface Props {
	cells: Cell<any>[];
	resetTo?: Order<any>;
	canSort?: boolean;
}

withDefaults(defineProps<Props>(), {
	canSort: () => true,
});

const emit = defineEmits(['sort-change']);

const handle = (newOrder: Order<Patient | Survey>) => {
	emit('sort-change', newOrder);
};
</script>

<template>
	<div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
		<div class="w-full overflow-x-auto">
			<table class="w-full">
				<!-- TABLE HEAD -->
				<AppTableHead
					@sort-change="handle"
					:cells="cells"
					:reset-to="resetTo"
					:can-sort="canSort"
				/>

				<!-- TBODY -->
				<tbody class="bg-white">
					<slot name="tbody"></slot>
				</tbody>
			</table>
		</div>
	</div>
</template>
