<script lang="ts">
	import { signOut } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { createCalendar } from '$lib/hooks/createCalendar';
	import dayjs from 'dayjs';
	import DeathCalendar from '../../components/DeathCalendar.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let currentDate = $state(dayjs());

	let days = $derived(createCalendar(currentDate));
	let monthName = $derived(currentDate.format('MMMM YYYY'));

	const nextMonth = () => (currentDate = currentDate.add(1, 'month'));
	const prevMonth = () => (currentDate = currentDate.subtract(1, 'month'));
	const goToToday = () => (currentDate = dayjs());

	async function handleSignOut() {
		await signOut();
		goto('/');
	}
</script>

<div class="min-h-screen p-8">
	<div class="max-w-4xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold">Calendar Page</h1>
			<button
				onclick={handleSignOut}
				class="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
			>
				Sign Out
			</button>
		</div>

		<div class="bg-white shadow rounded-lg p-6">
			{#if data.profile?.date_of_birth}
				<DeathCalendar dateOfBirth={data.profile.date_of_birth} />
			{:else}
				<p class="text-red-600">Please complete your profile to view the calendar.</p>
			{/if}
		</div>
	</div>
</div>
