<script lang="ts" setup>
defineProps({
	color: {
		type: String,
		default: 'blue',
	},
	label: String,
	icon: {
		type: String,
	},
});
</script>

<template>
	<button
		type="button"
		class="flex group items-stretch shadow-border text-sm font-sans font-bold rounded overflow-hidden"
		:class="[color === 'white' ? 'text-gray-600' : 'text-white']"
	>
		<div
			v-if="icon"
			class="flex items-center py-3 lg:py-1 lg:py-2 px-3"
			:class="[
				color === 'white' ? 'bg-gray-300 group-hover:bg-gray-400' : `bg-${color}-500 group-hover:bg-${color}-600`,
			]"
		>
			<font-awesome-icon :icon="['fas', icon]" />
		</div>
		<div
			class="flex items-center py-2 px-4 hidden lg:flex"
			:class="[
				color === 'white' ? 'bg-gray-200 group-hover:bg-gray-300' : `bg-${color}-600 group-hover:bg-${color}-700`,
			]"
		>
			{{ label }}
		</div>
	</button>
</template>

<style scoped></style>
