<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { authStore } from '$lib/stores';

	onMount(() => {
		// Initialize auth from localStorage
		authStore.init();

		// Check session validity
		authStore.checkSession();
	});
</script>

<SEO />

<div class="flex flex-col min-h-screen bg-gray-950">
	<Header />

	<main class="flex-1">
		<slot />
	</main>

	<Footer />
</div>
