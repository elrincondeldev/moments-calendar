<script lang="ts">
	import { supabase } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		// Listen for auth state changes
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
				// Handle sign out
				goto('/');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
