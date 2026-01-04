<script lang="ts">
	import { onMount } from 'svelte';
	import { signOut } from '$lib/auth';
	import { goto } from '$app/navigation';
	import Calendar from '../../components/Calendar.svelte';
	import type { PageData } from './$types';
	import type { Dayjs } from 'dayjs';
	import { getMoments, type Moment } from '$lib/moments';

	let { data } = $props<{ data: PageData }>();

	let moments = $state<Moment[]>([]);
	let isLoading = $state(true);

	async function loadMoments() {
		isLoading = true;
		const fetchedMoments = await getMoments();
		moments = fetchedMoments;
		isLoading = false;
	}

	onMount(() => {
		loadMoments();
	});

	async function handleSignOut() {
		await signOut();
		goto('/');
	}

	function handleDayClick(date: Dayjs) {
		console.log('Day clicked:', date.format('YYYY-MM-DD'));
	}

	function handleMomentCreated() {
		loadMoments();
	}
</script>

<div class="page-container">
	<div class="page-header">
		<div class="header-content">
			<div class="title-section">
				<h1 class="page-title">Life Calendar</h1>
				<p class="page-subtitle">Cada día es una oportunidad para crear momentos memorables</p>
			</div>
			<button onclick={handleSignOut} class="sign-out-button">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path
						d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Salir
			</button>
		</div>
	</div>

	<div class="calendar-section">
		{#if data.profile?.date_of_birth}
			{#if isLoading}
				<div class="loading-container">
					<div class="loading-spinner"></div>
					<p>Cargando momentos...</p>
				</div>
			{:else}
				<Calendar {moments} onDayClick={handleDayClick} onMomentCreated={handleMomentCreated} />

				<div class="info-card">
					<div class="info-icon">💡</div>
					<div class="info-content">
						<h3 class="info-title">¿Cómo funciona?</h3>
						<ul class="info-list">
							<li>Los días <strong>negros</strong> son días pasados sin momentos registrados</li>
							<li>Los días con <strong>colores vibrantes</strong> tienen momentos guardados</li>
							<li>El día <strong>morado</strong> es hoy</li>
							<li>Haz clic en cualquier día para agregar o ver momentos</li>
						</ul>
					</div>
				</div>
			{/if}
		{:else}
			<div class="warning-card">
				<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<h2>Completa tu perfil</h2>
				<p>Necesitas completar tu perfil para ver el calendario.</p>
				<button class="primary-button" onclick={() => goto('/onboarding')}> Ir al perfil </button>
			</div>
		{/if}
	</div>
</div>

<style>
	.page-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
		padding: 2rem;
	}

	.page-header {
		max-width: 1200px;
		margin: 0 auto 2rem;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.title-section {
		flex: 1;
	}

	.page-title {
		font-size: 2.5rem;
		font-weight: 800;
		color: #1a1a2e;
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.02em;
	}

	.page-subtitle {
		font-size: 1.125rem;
		color: #666;
		margin: 0;
	}

	.sign-out-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: white;
		border: 2px solid #e0e0e5;
		border-radius: 12px;
		color: #1a1a2e;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.sign-out-button:hover {
		background: #1a1a2e;
		color: white;
		border-color: #1a1a2e;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(26, 26, 46, 0.2);
	}

	.calendar-section {
		max-width: 1200px;
		margin: 0 auto;
	}

	.loading-container {
		background: white;
		border-radius: 16px;
		padding: 4rem 2rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		text-align: center;
	}

	.loading-spinner {
		width: 50px;
		height: 50px;
		margin: 0 auto 1rem;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #6c5ce7;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-container p {
		color: #666;
		font-size: 1.125rem;
	}

	.info-card {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		margin-top: 2rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
	}

	.info-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.info-content {
		flex: 1;
	}

	.info-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1a1a2e;
		margin: 0 0 1rem 0;
	}

	.info-list {
		margin: 0;
		padding-left: 1.5rem;
		color: #666;
		line-height: 1.8;
	}

	.info-list li {
		margin-bottom: 0.5rem;
	}

	.warning-card {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		text-align: center;
		max-width: 500px;
		margin: 4rem auto;
	}

	.warning-card svg {
		color: #ff6b6b;
		margin-bottom: 1rem;
	}

	.warning-card h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
		margin: 0 0 0.5rem 0;
	}

	.warning-card p {
		color: #666;
		margin: 0 0 2rem 0;
		font-size: 1.125rem;
	}

	.primary-button {
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
	}

	.primary-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
	}

	@media (max-width: 768px) {
		.page-container {
			padding: 1rem;
		}

		.page-title {
			font-size: 2rem;
		}

		.page-subtitle {
			font-size: 1rem;
		}

		.header-content {
			flex-direction: column;
			align-items: flex-start;
		}

		.info-card {
			flex-direction: column;
			padding: 1.5rem;
		}

		.warning-card {
			padding: 2rem 1.5rem;
		}
	}
</style>
