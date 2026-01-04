<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getCurrentUserProfile, updatePersonalInfo, type Profile } from '$lib/profile';

	let profile: Profile | null = null;
	let loading = false;
	let error = '';

	let formData = {
		full_name: '',
		date_of_birth: ''
	};

	onMount(async () => {
		profile = await getCurrentUserProfile();
		if (profile?.onboarding_completed) goto('/calendar');
	});

	async function handleSubmit() {
		loading = true;
		error = '';

		try {
			const success = await updatePersonalInfo({
				full_name: formData.full_name,
				date_of_birth: formData.date_of_birth
			});

			if (success) {
				goto('/storytelling');
			} else {
				error = 'Error al actualizar el perfil';
			}
		} catch (e) {
			error = 'Error inesperado';
			console.error(e);
		} finally {
			loading = false;
		}
	}
</script>

<div class="onboarding-container">
	<h1>Completa tu perfil</h1>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="full_name">Nombre completo</label>
			<input
				id="full_name"
				type="text"
				bind:value={formData.full_name}
				required
				placeholder="Tu nombre"
			/>
		</div>

		<div class="form-group">
			<label for="date_of_birth">Fecha de nacimiento</label>
			<input id="date_of_birth" type="date" bind:value={formData.date_of_birth} required />
		</div>

		<button type="submit" disabled={loading}>
			{loading ? 'Guardando...' : 'Completar perfil'}
		</button>
	</form>
</div>

<style>
	.onboarding-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	h1 {
		margin-bottom: 1.5rem;
		color: #333;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #555;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #4a90e2;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background: #4a90e2;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover:not(:disabled) {
		background: #357abd;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error {
		padding: 0.75rem;
		background: #fee;
		color: #c33;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
</style>
