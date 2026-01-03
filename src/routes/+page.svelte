<script lang="ts">
	import { goto } from '$app/navigation';
	import type { LayoutServerData } from './$types';

	let { data } = $props<{ data: LayoutServerData }>();
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-8">
	<h1 class="text-2xl font-bold mb-8">This is a moments calendar</h1>

	{#if data.session}
		<div class="text-center space-y-4">
			<p class="text-gray-600">Welcome, {data.session.user?.email}!</p>
			<div class="space-x-4">
				<a
					href="/calendar"
					class="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
				>
					Go to Calendar Page
				</a>
			</div>
		</div>
	{:else}
		<div class="text-center space-y-4">
			<p class="text-gray-600">Please sign in to continue</p>
			<a
				href="/auth/login"
				class="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
			>
				Sign In
			</a>
		</div>
	{/if}
</div>
