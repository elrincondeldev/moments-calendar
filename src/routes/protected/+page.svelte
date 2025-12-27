<script lang="ts">
	import { signOut } from '$lib/auth';
	import { goto } from '$app/navigation';

	let { data } = $props();

	async function handleSignOut() {
		await signOut();
		goto('/');
	}
</script>

<div class="min-h-screen p-8">
	<div class="max-w-4xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold">Protected Page</h1>
			<button
				onclick={handleSignOut}
				class="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
			>
				Sign Out
			</button>
		</div>

		<div class="bg-white shadow rounded-lg p-6">
			<h2 class="text-xl font-semibold mb-4">Welcome!</h2>
			<p class="text-gray-600 mb-4">You are successfully authenticated.</p>
			<div class="bg-gray-50 p-4 rounded">
				<p class="text-sm text-gray-500">User Email: {data.session?.user?.email}</p>
				<p class="text-sm text-gray-500">User ID: {data.session?.user?.id}</p>
			</div>
		</div>
	</div>
</div>

