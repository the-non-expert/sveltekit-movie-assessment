<script lang="ts">
	// Test component to verify Tailwind CSS and Google Fonts integration
</script>

<div class="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
	<div class="text-center space-y-6 p-8">
		<h1 class="text-6xl font-bebas text-[var(--color-primary)] tracking-wide">
			Welcome to SvelteKit
		</h1>
		<p class="text-xl font-outfit text-[var(--color-text-secondary)] font-light">
			TypeScript + Tailwind CSS v4 + Svelte 5
		</p>
		<div class="flex gap-4 justify-center mt-8">
			<button class="bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white font-outfit font-semibold px-6 py-3 rounded-md transition-colors">
				Get Started
			</button>
			<button class="border-2 border-[var(--color-border)] hover:border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] font-outfit font-semibold px-6 py-3 rounded-md transition-colors">
				Learn More
			</button>
		</div>
		<div class="mt-12 p-6 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
			<h2 class="text-3xl font-bebas text-[var(--color-secondary)] mb-3">
				Dark Cinema Theme
			</h2>
			<p class="font-outfit text-sm text-[var(--color-text-secondary)]">
				Custom theme with Bebas Neue and Outfit fonts
			</p>
		</div>
	</div>
</div>
