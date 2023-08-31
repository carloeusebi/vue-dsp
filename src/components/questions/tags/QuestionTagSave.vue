<script lang="ts" setup>
import { Ref, ref } from 'vue';

import AppModal from '@/components/AppModal.vue';
import AppAlert from '@/components/AppAlert.vue';
import AppButton from '@/components/AppButton.vue';
import AppInputElement from '@/components/AppInputElement.vue';

import { NewTag, Tag } from '@/assets/data/interfaces';
import { useSaveToStore } from '@/composables';
import { useTagsStore } from '@/stores';

interface Props {
	open: boolean;
	type?: 'create' | 'update';
	tag?: Tag | NewTag;
}

const props = withDefaults(defineProps<Props>(), {
	tag: () => ({ tag: '', color: '#000000' }),
	type: () => 'create',
});
const emit = defineEmits(['close']);

const tagRef = ref(props.tag);
const title = props.type === 'create' ? 'Crea un nuovo tag' : `Modifica ${props.tag.tag}`;
const errors: Ref<string[]> = ref([]);

const saveTag = async () => {
	errors.value = [];
	errors.value = await useSaveToStore(props.tag, useTagsStore());
	if (!errors.value.length) {
		//timeout give time to modals to close before emptying the text
		setTimeout(() => {
			tagRef.value = { ...{ tag: '', color: '#000000' } };
		}, 500);
		emit('close');
	}
};
</script>

<template>
	<!-- MODAL -->
	<AppModal
		:open="open"
		@close="emit('close')"
		dimensions="max-w-xs"
	>
		<template #content>
			<h2>{{ title }}</h2>
			<hr class="my-5" />

			<!-- ALERT -->
			<AppAlert
				:show="errors.length > 0"
				type="warning"
				title="Attenzione"
				class="my-4"
			>
				<ul>
					<li
						v-for="error in errors"
						:key="error"
					>
						{{ error }}
					</li>
				</ul>
			</AppAlert>

			<!-- FORM -->
			<form
				id="new-tag-from"
				class="flex items-end gap-6"
				@submit.prevent="saveTag"
			>
				<AppInputElement
					label="Nome del tag"
					v-model="tagRef.tag"
					:required="true"
				/>
				<input
					type="color"
					v-model="tagRef.color"
					required
				/>
			</form>
		</template>
		<template #button>
			<AppButton form="new-tag-from"> Salva </AppButton>
		</template>
	</AppModal>
</template>

<style scoped></style>
