<script lang="ts" setup>
defineProps({
	scores: Object,
});
</script>

<template>
	<ul v-if="scores">
		<li
			v-for="(variables, question) in scores.scores"
			:key="question"
			class="mb-3"
		>
			<div>
				<strong>{{ question }}</strong>
			</div>
			<ul>
				<li
					v-for="(score, variable) in variables"
					:key="variable"
					class="ps-3"
				>
					{{ variable }}: {{ score }}
				</li>
			</ul>
		</li>
	</ul>
</template>

<style scoped></style>
