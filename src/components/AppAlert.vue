<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
	show: Boolean,
	type: String,
	message: String,
	title: String,
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

const actualTitle = computed(() => {
	if (props.title || props.title === '') return props.title;
	switch (props.type) {
		case 'warning':
			return 'Attenzione';
		case 'success':
			return 'Successo';
		default:
			return 'Ops';
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
			v-if="actualTitle"
			class="font-bold"
		>
			{{ actualTitle }}
		</p>
		<slot></slot>
		<span>{{ message }}</span>
	</div>
</template>
