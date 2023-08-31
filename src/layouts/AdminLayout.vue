<script lang="ts" setup>
import TheNavbar from '@/components/TheNavbar.vue';
</script>

<template>
	<header class="fixed top-0 left-0 right-0 z-10">
		<TheNavbar />
	</header>
	<div class="pt-16"></div>
	<div class="container mx-auto p-2 md:p-5">
		<main>
			<router-view></router-view>
		</main>
	</div>
</template>

<style scoped>
::-webkit-scrollbar {
	width: 0px;
}
</style>
