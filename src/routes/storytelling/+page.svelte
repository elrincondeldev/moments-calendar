<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { Motion } from 'svelte-motion';
	import DeathCalendar from '../../components/DeathCalendar.svelte';
	import { completeOnboarding } from '$lib/profile';
	import { getCurrentUserProfile, type Profile } from '$lib/profile';

	let profile: Profile | null = null;
	let currentStep = 0;

	const steps = [
		{
			id: 'intro',
			title: 'Cada día cuenta.',
			subtitle: 'Pero... ¿cuántos días tienes realmente?',
			color: '#1a1a2e'
		},
		{
			id: 'reality',
			title: 'Esta es tu vida.',
			subtitle: 'Cada círculo blanco es una semana. Los negros... ya pasaron.',
			color: '#dc2626',
			showCalendar: true
		},
		{
			id: 'passed',
			title: 'El tiempo no espera.',
			subtitle: 'Mira cuántas semanas ya viviste.',
			color: '#2d2d2d'
		},
		{
			id: 'future',
			title: 'Pero aún tienes oportunidades.',
			subtitle: 'Cada círculo blanco es una posibilidad.',
			color: '#ffffff',
			textDark: true
		},
		{
			id: 'question',
			title: '¿Qué harás con tu tiempo?',
			subtitle: 'Cada semana es una decisión.',
			color: '#ff6b6b'
		},
		{
			id: 'dead-day',
			title: 'Un día sin vivir...',
			subtitle: 'Es un círculo que se vuelve negro para siempre.',
			color: '#16213e'
		},
		{
			id: 'alive-day',
			title: 'Un día con momentos...',
			subtitle: 'Es un día que brillará en tu memoria.',
			color: '#ffd93d'
		},
		{
			id: 'choice',
			title: 'Life Calendar',
			subtitle: 'No dejes que tus días mueran en silencio.',
			color: '#6c5ce7'
		},
		{
			id: 'final',
			title: 'Empieza hoy.',
			subtitle: 'Llena cada día con momentos que merezcan ser recordados.',
			color: '#00b894'
		}
	];

	onMount(async () => {
		profile = await getCurrentUserProfile();
		if (!profile?.date_of_birth) {
			goto('/onboarding');
		}
	});

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			goto('/calendar');
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	function skipToCalendar() {
		completeOnboarding();
		goto('/calendar');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault();
			nextStep();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevStep();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="relative w-screen h-screen overflow-hidden text-white font-sans transition-colors duration-800"
	style="background: {steps[currentStep].color};"
>
	<div class="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center p-6 md:p-8">
		{#if currentStep > 0}
			<button class="nav-btn" on:click={prevStep} in:fade aria-label="Paso anterior">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path
						d="M15 18l-6-6 6-6"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{:else}
			<div></div>
		{/if}

		<button
			class="bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-xl text-sm font-medium tracking-wide hover:bg-white/30 hover:-translate-y-0.5"
			on:click={skipToCalendar}
			aria-label="Saltar al calendario"
		>
			Saltar
		</button>

		{#if currentStep < steps.length - 1}
			<button class="nav-btn" on:click={nextStep} in:fade aria-label="Siguiente paso">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
		{:else}
			<div></div>
		{/if}
	</div>

	<div
		class="w-full h-screen flex items-center justify-center relative"
		class:text-gray-900={steps[currentStep].textDark}
	>
		{#if steps[currentStep].showCalendar && profile?.date_of_birth}
			<div class="w-full h-screen flex flex-col items-center relative mt-10">
				<Motion
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					let:motion
				>
					<div use:motion class="calendar-story-header">
						<h1 class="calendar-story-title">{steps[currentStep].title}</h1>
						<p class="calendar-story-subtitle">{steps[currentStep].subtitle}</p>
						<div class="scroll-hint">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									d="M12 5v14M19 12l-7 7-7-7"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span>Desliza para ver tu vida completa</span>
						</div>
					</div>
				</Motion>

				<Motion
					initial={{ opacity: 0, scale: 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
					let:motion
				>
					<div use:motion class="flex-1 w-full relative overflow-hidden integrated-calendar">
						<DeathCalendar dateOfBirth={profile.date_of_birth} />
					</div>
				</Motion>

				<Motion
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 1 }}
					let:motion
				>
					<button use:motion class="continue-btn" on:click={nextStep}>
						Continuar
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								d="M9 18l6-6-6-6"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</Motion>
			</div>
		{:else}
			{#key currentStep}
				<button
					class="w-full h-full flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
					on:click={nextStep}
					aria-label="Continuar al siguiente paso"
				>
					<Motion
						initial={{ opacity: 0, y: 60 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						let:motion
					>
						<div use:motion class="max-w-4xl px-8 text-center">
							{#if steps[currentStep].id === 'passed'}
								<div class="mb-12 flex justify-center items-center min-h-[220px]">
									<Motion
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.6, delay: 0.2 }}
										let:motion
									>
										<div use:motion class="flex gap-4 flex-wrap justify-center max-w-2xl">
											{#each Array(10) as _, i}
												<Motion
													initial={{ scale: 0, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
													let:motion
												>
													<div use:motion class="mini-circle passed"></div>
												</Motion>
											{/each}
										</div>
									</Motion>
								</div>
							{:else if steps[currentStep].id === 'future'}
								<div class="mb-12 flex justify-center items-center min-h-[220px]">
									<Motion
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.6, delay: 0.2 }}
										let:motion
									>
										<div use:motion class="flex gap-4 flex-wrap justify-center max-w-2xl">
											{#each Array(10) as _, i}
												<Motion
													initial={{ scale: 0, opacity: 0 }}
													animate={{ scale: 1, opacity: 1 }}
													transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
													let:motion
												>
													<div use:motion class="mini-circle future"></div>
												</Motion>
											{/each}
										</div>
									</Motion>
								</div>
							{:else if steps[currentStep].id === 'dead-day'}
								<div class="mb-12 flex justify-center items-center min-h-[220px]">
									<Motion
										initial={{ scale: 0, rotate: -180 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ duration: 1, delay: 0.3 }}
										let:motion
									>
										<div use:motion class="day-circle dead">
											<div class="void"></div>
										</div>
									</Motion>
								</div>
							{:else if steps[currentStep].id === 'alive-day'}
								<div class="mb-12 flex justify-center items-center min-h-[220px]">
									<Motion
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ duration: 0.8, delay: 0.3 }}
										let:motion
									>
										<div use:motion class="day-circle alive">
											<div class="sparkles">
												{#each Array(6) as _, i}
													<div class="sparkle" style="--i: {i}">✨</div>
												{/each}
											</div>
										</div>
									</Motion>
								</div>
							{/if}

							<Motion
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.3 }}
								let:motion
							>
								<h1 use:motion class="story-title">{steps[currentStep].title}</h1>
							</Motion>

							<Motion
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.8, delay: 0.6 }}
								let:motion
							>
								<p use:motion class="story-subtitle">{steps[currentStep].subtitle}</p>
							</Motion>

							{#if currentStep === steps.length - 1}
								<Motion
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.9 }}
									let:motion
								>
									<button
										use:motion
										class="mt-12 px-10 py-5 text-xl font-semibold bg-white text-black border-none rounded-full cursor-pointer flex items-center gap-3 mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-[0_15px_60px_rgba(0,0,0,0.4)] active:translate-y-0 active:scale-100"
										on:click={skipToCalendar}
									>
										<span>Comenzar mi calendario</span>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												d="M5 12h14M12 5l7 7-7 7"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</button>
								</Motion>
							{:else}
								<Motion
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.8, delay: 1.2 }}
									let:motion
								>
									<p use:motion class="tap-hint">Toca para continuar o usa →</p>
								</Motion>
							{/if}
						</div>
					</Motion>
				</button>
			{/key}
		{/if}
	</div>

	<div class="fixed bottom-0 left-0 right-0 h-1 bg-white/10 z-100">
		<div
			class="h-full bg-linear-to-r from-[#667eea] to-[#764ba2] transition-all duration-600 shadow-[0_0_20px_rgba(102,126,234,0.6)]"
			style="width: {((currentStep + 1) / steps.length) * 100}%"
		></div>
	</div>

	<div
		class="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-100 bg-white/50 p-5 rounded-full"
	>
		{#each steps as step, i}
			<button
				class="w-3 h-3 rounded-full bg-white/30 border-2 border-transparent cursor-pointer transition-all duration-300 p-0 hover:bg-white/50 hover:scale-110"
				class:active-dot={i === currentStep}
				class:completed-dot={i < currentStep}
				on:click={() => (currentStep = i)}
				aria-label="Ir al paso {i + 1}"
			>
			</button>
		{/each}
	</div>
</div>

<style>
	.nav-btn {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		width: 3rem;
		height: 3rem;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		backdrop-filter: blur(20px);
	}

	.nav-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.nav-btn:active {
		transform: scale(0.95);
	}

	/* Calendar story header */
	.calendar-story-header {
		text-align: center;
		padding: 3rem 2rem 2rem;
		position: relative;
		z-index: 10;
		background: linear-gradient(
			180deg,
			rgba(220, 38, 38, 0.95) 0%,
			rgba(220, 38, 38, 0.7) 80%,
			transparent 100%
		);
	}

	.calendar-story-title {
		font-weight: 800;
		margin-bottom: 1rem;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: white;
		font-size: clamp(2.5rem, 6vw, 4rem);
		text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.calendar-story-subtitle {
		opacity: 0.95;
		font-weight: 400;
		line-height: 1.6;
		max-width: 700px;
		margin: 0 auto 2rem;
		color: white;
		font-size: clamp(1rem, 2.5vw, 1.5rem);
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	/* Scroll hint */
	.scroll-hint {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		opacity: 0.7;
		margin-top: 1rem;
		color: white;
		animation: hintPulse 2s ease-in-out infinite;
	}

	@keyframes hintPulse {
		0%,
		100% {
			opacity: 0.7;
			transform: translateY(0);
		}
		50% {
			opacity: 0.9;
			transform: translateY(5px);
		}
	}

	/* Calendar integration */
	.integrated-calendar :global(.calendar-container) {
		height: 100%;
		border-radius: 0;
	}

	.integrated-calendar :global(.calendar-header) {
		display: none;
	}

	.integrated-calendar :global(.calendar-scroll) {
		padding: 0 1rem 5rem;
	}

	.integrated-calendar :global(.calendar-grid) {
		margin-top: 0;
	}

	/* Continue button */
	.continue-btn {
		position: absolute;
		bottom: 7rem;
		left: 50%;
		transform: translateX(-50%);
		background: rgba(255, 255, 255, 0.95);
		color: #dc2626;
		padding: 1rem 2rem;
		border-radius: 9999px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		font-size: 1.125rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		z-index: 20;
		backdrop-filter: blur(10px);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.continue-btn:hover {
		transform: translateX(-50%) translateY(-5px);
		box-shadow:
			0 15px 50px rgba(0, 0, 0, 0.6),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		background: white;
		border-color: rgba(255, 255, 255, 0.5);
	}

	.continue-btn:active {
		transform: translateX(-50%) translateY(-2px);
	}

	/* Story content */
	.story-title {
		font-weight: 800;
		margin-bottom: 1.5rem;
		line-height: 1.1;
		letter-spacing: -0.02em;
		font-size: clamp(2.5rem, 8vw, 5rem);
		text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	}

	.story-subtitle {
		opacity: 0.9;
		font-weight: 400;
		line-height: 1.6;
		max-width: 700px;
		margin: 0 auto;
		letter-spacing: 0.01em;
		font-size: clamp(1.1rem, 3vw, 1.8rem);
	}

	/* Mini circles */
	.mini-circle {
		width: 40px;
		height: 40px;
		border-radius: 9999px;
		transition: all 0.3s ease;
	}

	.mini-circle.passed {
		background: #000;
		box-shadow:
			inset 0 0 10px rgba(0, 0, 0, 0.8),
			0 5px 20px rgba(0, 0, 0, 0.4);
		animation: passedPulse 3s ease-in-out infinite;
	}

	.mini-circle.future {
		background: #fff;
		box-shadow: 0 5px 30px rgba(255, 255, 255, 0.5);
		animation: futurePulse 3s ease-in-out infinite;
	}

	@keyframes passedPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.7;
		}
		50% {
			transform: scale(0.9);
			opacity: 0.5;
		}
	}

	@keyframes futurePulse {
		0%,
		100% {
			transform: scale(1);
			box-shadow: 0 5px 30px rgba(255, 255, 255, 0.5);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 8px 40px rgba(255, 255, 255, 0.8);
		}
	}

	/* Day circles */
	.day-circle {
		width: 180px;
		height: 180px;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.day-circle.dead {
		background: radial-gradient(circle, #1a1a1a 0%, #000 100%);
		box-shadow:
			inset 0 0 40px rgba(0, 0, 0, 0.9),
			0 10px 60px rgba(0, 0, 0, 0.6);
		animation: deadBreath 4s ease-in-out infinite;
	}

	.void {
		width: 80%;
		height: 80%;
		border-radius: 9999px;
		background: radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
		animation: voidSwirl 6s linear infinite;
	}

	@keyframes deadBreath {
		0%,
		100% {
			transform: scale(1);
			box-shadow:
				inset 0 0 40px rgba(0, 0, 0, 0.9),
				0 10px 60px rgba(0, 0, 0, 0.6);
		}
		50% {
			transform: scale(0.97);
			box-shadow:
				inset 0 0 50px rgba(0, 0, 0, 1),
				0 5px 40px rgba(0, 0, 0, 0.8);
		}
	}

	@keyframes voidSwirl {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.day-circle.alive {
		background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #ee5a6f 100%);
		box-shadow:
			0 0 80px rgba(255, 215, 0, 0.6),
			inset 0 0 30px rgba(255, 255, 255, 0.3);
		animation: aliveGlow 2s ease-in-out infinite;
	}

	@keyframes aliveGlow {
		0%,
		100% {
			transform: scale(1);
			box-shadow:
				0 0 80px rgba(255, 215, 0, 0.6),
				inset 0 0 30px rgba(255, 255, 255, 0.3);
		}
		50% {
			transform: scale(1.05);
			box-shadow:
				0 0 120px rgba(255, 215, 0, 0.9),
				inset 0 0 40px rgba(255, 255, 255, 0.5);
		}
	}

	.sparkles {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.sparkle {
		position: absolute;
		font-size: 2rem;
		animation: sparkleFloat 3s ease-in-out infinite;
		animation-delay: calc(var(--i) * 0.4s);
	}

	.sparkle:nth-child(1) {
		top: 5%;
		left: 20%;
	}
	.sparkle:nth-child(2) {
		top: 15%;
		right: 15%;
	}
	.sparkle:nth-child(3) {
		bottom: 20%;
		left: 10%;
	}
	.sparkle:nth-child(4) {
		bottom: 15%;
		right: 20%;
	}
	.sparkle:nth-child(5) {
		top: 50%;
		left: 5%;
	}
	.sparkle:nth-child(6) {
		top: 50%;
		right: 5%;
	}

	@keyframes sparkleFloat {
		0%,
		100% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
		50% {
			transform: translateY(-15px) scale(1.3);
			opacity: 0.6;
		}
	}

	/* Tap hint */
	.tap-hint {
		margin-top: 4rem;
		font-size: 0.95rem;
		opacity: 0.5;
		font-weight: 400;
		animation: hintFloat 2s ease-in-out infinite;
	}

	@keyframes hintFloat {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.5;
		}
		50% {
			transform: translateY(-8px);
			opacity: 0.7;
		}
	}

	/* Progress dots */
	.active-dot {
		background: white;
		transform: scale(1.4);
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
	}

	.completed-dot {
		background: rgba(255, 255, 255, 0.6);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.calendar-story-header {
			padding: 2rem 1.5rem 1.5rem;
		}

		.scroll-hint {
			font-size: 0.75rem;
		}

		.continue-btn {
			bottom: 2rem;
			padding: 0.85rem 1.75rem;
			font-size: 1rem;
		}

		.day-circle {
			width: 140px;
			height: 140px;
		}

		.mini-circle {
			width: 30px;
			height: 30px;
		}

		.sparkle {
			font-size: 1.5rem;
		}

		.integrated-calendar :global(.calendar-scroll) {
			padding: 1.5rem 0.5rem 4rem;
		}
	}

	@media (max-width: 480px) {
		.calendar-story-header {
			padding: 1.5rem 1rem 1rem;
		}

		.continue-btn {
			bottom: 1.5rem;
			padding: 0.75rem 1.5rem;
			font-size: 0.95rem;
		}

		.day-circle {
			width: 120px;
			height: 120px;
		}

		.mini-circle {
			width: 25px;
			height: 25px;
		}
	}
</style>
