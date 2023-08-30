<script lang="ts" setup>
interface Props {
	modelValue: boolean;
	id?: string;
}
defineProps<Props>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
	<div class="inline-block me-7">
		<label class="container">
			<input
				:value="modelValue"
				:checked="modelValue"
				:id="id"
				@change="emit('update:modelValue', !modelValue)"
				type="checkbox"
				class="cursor-pointer"
			/>
			<span class="checkmark"></span>
		</label>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/checkbox';
</style>
