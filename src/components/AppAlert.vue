<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
	show: boolean;
	type?: 'warning' | 'success' | 'info';
	message?: string;
	title?: string;
	errors?: Array<string[]>;
}

const props = defineProps<Props>();

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
		<!-- MESSAGE HTML -->
		<span v-html="message"></span>
		<!-- ERRORS -->
		<ul v-if="errors">
			<li
				v-for="(fieldErrors, i) in errors"
				:key="i"
			>
				<ul>
					<li
						v-for="error in fieldErrors"
						:key="error"
					>
						{{ error }}
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>
