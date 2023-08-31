<script lang="ts" setup>
//@ts-ignore
import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

interface Props {
	items: Array<any>;
}
defineProps<Props>();

const showDropdown = ref(false);
const dropdownButton = ref<HTMLButtonElement>();
const route = useRoute();

/**
 * Closes the dropdown ONLY if there are no open modals
 */
const handleClickOutside = (event: Event) => {
	if (route.query.modal_id) return;
	const clickedElement = event.target as HTMLElement;
	if (dropdownButton.value?.contains(clickedElement)) return;
	showDropdown.value = false;
};
</script>

<template>
	<div
		as="div"
		class="relative inline-block text-left"
	>
		<div
			@click="showDropdown = !showDropdown"
			ref="dropdownButton"
		>
			<slot name="button"></slot>
		</div>

		<div
			v-if="showDropdown"
			v-click-out-side="handleClickOutside"
			class="absolute right-0 z-10 mt-2 w-68 px-4 py-2 origin-top-right rounded-md bg-white shadow-lg border-gray-300 ring-black ring-opacity-5 focus:outline-none"
		>
			<slot name="items"></slot>
		</div>
	</div>
</template>
