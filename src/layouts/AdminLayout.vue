<script lang="ts" setup>
import TheNavbar from '@/components/TheNavbar.vue';
</script>

<template>
	<header>
		<TheNavbar />
	</header>
	<main>
		<div class="container mx-auto p-2 md:p-5">
			<router-view></router-view>
		</div>
	</main>
</template>

<style scoped>
::-webkit-scrollbar {
	width: 0px;
}
</style>
