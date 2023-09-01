<script lang="ts" setup>
import { Question } from '@/assets/data/interfaces';

interface Props {
	question: Question;
}

const props = defineProps<Props>();
</script>

<template>
	<router-link :to="{ name: 'questions.show', params: { id: props.question.id } }">
		<li
			class="py-4 border-y border-gray-200 bg-gray-50 hover:bg-gray-100 transition duration-150 cursor-pointer md:px-4"
		>
			<div class="flex flex-col sm:flex-row items-start sm:items-center gap-1">
				<!-- title -->
				<div class="font-semibold me-2">{{ question.question }}</div>
				<!-- tags -->
				<div class="max-w-screen-lg overflow-x-hidden">
					<ul class="flex gap-2 overflow-hidden">
						<li
							v-for="tag in question.tags"
							:key="tag.id"
							:style="`background-color: ${tag.color}10; color: ${tag.color}; border: 1px solid ${tag.color}50`"
							class="inline-flex items-center rounded-md px-2 py-[2px] text-xs font-medium"
						>
							{{ tag.tag }}
						</li>
					</ul>
				</div>
			</div>
			<!-- description -->
			<p class="text-sm hidden md:inline">{{ question.description }}</p>
		</li>
	</router-link>
</template>
