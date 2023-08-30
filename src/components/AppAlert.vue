<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
	show: Boolean,
	type: String,
	message: String,
	title: {
		type: String,
		default: 'Ops',
	},
});

const className = computed((): string => {
	switch (props.type) {
		case 'warning':
			return 'orange';
		case 'success':
			return 'teal';
		default:
			return 'blue';
	}
});
</script>

<template>
	<div
		v-if="show"
		:class="`top-10 bg-${className}-100 border-l-4 border-${className}-500 text-${className}-700 p-4`"
		role="alert"
	>
		<p
			v-if="title"
			class="font-bold"
		>
			{{ title }}
		</p>
		<slot></slot>
		<span>{{ message }}</span>
	</div>
</template>
