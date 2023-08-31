<script lang="ts" setup>
import AppCheckbox from '../AppCheckbox.vue';
import AppInputElement from '../AppInputElement.vue';
import { QuestionItemI } from '@/assets/data/interfaces';

interface Props {
	item: QuestionItemI;
	index: number;
}

defineProps<Props>();
const emit = defineEmits(['delete-item']);
</script>

<template>
	<div class="flex items-center">
		<!-- CHECKBOX -->
		<div>
			<AppCheckbox
				v-model="(item.reversed as boolean)"
				:id="`checkbox-${item.id}`"
			/>
		</div>
		<!-- ITEM -->
		<span class="me-2 self-center min-w-[25px] text-center cursor-move select-none">{{ index + 1 }}.</span>
		<AppInputElement
			class="grow"
			v-model="item.text"
			:id="`answer-${item.id}`"
		/>
		<div>
			<font-awesome-icon
				@click="emit('delete-item', item.id)"
				class="ms-3 cursor-pointer text-red-700 hover:text-red-800 mb-2 md:mb-0"
				:icon="['fas', 'trash-can']"
			/>
		</div>
	</div>
</template>
