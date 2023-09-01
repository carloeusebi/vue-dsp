<script lang="ts" setup>
interface Props {
	modelValue: boolean;
	id?: string;
	label?: string;
}
defineProps<Props>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
	<div class="flex items-center">
		<div>
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
		<label
			v-if="label"
			:for="id"
			v-html="label"
			class="ms-7 cursor-pointer select-none"
		></label>
	</div>
</template>

<style lang="scss" scoped>
/* The container */
label.container {
	display: block;
	position: relative;
	cursor: pointer;
	font-size: 22px;
	bottom: 22px;
}

/* Hide the browser's default checkbox */
label.container input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

/* Create a custom checkbox */
.checkmark {
	position: absolute;
	top: 12px;
	left: 0;
	height: 20px;
	width: 20px;
	background-color: #eee;
}

/* On mouse-over or focus, add a grey background color */
label.container:hover input ~ .checkmark,
label.container input:focus ~ .checkmark {
	background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
	background-color: #2196f3;
}

// When the checkbox is checked and focused, add a darker background
.container input:checked:focus ~ .checkmark {
	background-color: #186cb1;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
	content: '';
	position: absolute;
	display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
	display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
	left: 9px;
	top: 5px;
	width: 5px;
	height: 10px;
	border: solid white;
	border-width: 0 3px 3px 0;
	transform: rotate(45deg);
}
</style>
