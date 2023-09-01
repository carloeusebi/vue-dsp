<script lang="ts" setup>
import TheNavbar from '@/components/TheNavbar.vue';
</script>

<template>
	<header>
		<TheNavbar />
	</header>
	<div class="container mx-auto p-2 md:px-5">
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
