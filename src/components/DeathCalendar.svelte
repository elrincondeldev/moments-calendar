<script lang="ts">
	interface Props {
		dateOfBirth: string;
		compact?: boolean;
	}

	let { dateOfBirth, compact = false }: Props = $props();

	const TOTAL_YEARS = 100;
	const WEEKS_PER_YEAR = 52;

	const weeksLived = $derived.by(() => {
		if (!dateOfBirth) return 0;

		const birth = new Date(dateOfBirth);
		const now = new Date();
		if (isNaN(birth.getTime())) return 0;

		let age = now.getFullYear() - birth.getFullYear();
		const monthDiff = now.getMonth() - birth.getMonth();
		const dayDiff = now.getDate() - birth.getDate();

		if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
			age--;
		}

		const lastBirthday = new Date(birth);
		lastBirthday.setFullYear(birth.getFullYear() + age);

		const timeSinceLastBirthday = now.getTime() - lastBirthday.getTime();
		const weeksSinceLastBirthday = Math.floor(timeSinceLastBirthday / (1000 * 60 * 60 * 24 * 7));

		return (age - 1) * 52 + weeksSinceLastBirthday;
	});

	const yearsArray = Array.from({ length: TOTAL_YEARS }, (_, i) => i);
	const weeksArray = Array.from({ length: WEEKS_PER_YEAR }, (_, i) => i);
</script>

<div class="calendar-container {compact ? 'compact' : ''}">
	<div class="calendar-header">
		<div class="header-content">
			<span class="header-icon">✦✦✦</span>
			<span class="header-text">CADA CÍRCULO ES UNA SEMANA DE TU VIDA /// MOVE ON</span>
			<span class="header-icon">✦✦✦</span>
		</div>
	</div>

	<div class="calendar-scroll no-scrollbar">
		<div class="calendar-grid">
			{#each yearsArray as year}
				<div class="year-row">
					<div class="dots-wrapper">
						{#each weeksArray as week}
							{@const weekIndex = year * WEEKS_PER_YEAR + week}
							<div
								class="week-dot"
								class:passed={weekIndex < weeksLived}
								class:current={weekIndex === weeksLived}
								class:group-end={(week + 1) % 10 === 0 && week < 50}
								title="Año {year + 1}, Semana {week + 1}"
							></div>
						{/each}
					</div>
					<span class="year-label">{year + 1}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.calendar-container {
		height: 100vh;
		background: linear-gradient(to bottom right, #dc2626, #dc2626);
		color: white;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	.calendar-header {
		padding: 1.5rem 1rem;
		background: rgba(220, 38, 38, 0.98);
		backdrop-filter: blur(10px);
		z-index: 10;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		flex-shrink: 0;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		font-weight: 700;
		font-size: 0.875rem;
		letter-spacing: 0.1em;
	}

	.calendar-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 2rem 1rem;
		-webkit-overflow-scrolling: touch;
	}

	.calendar-grid {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		max-width: fit-content;
		margin: 0 auto;
		contain: content;
	}

	.year-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.dots-wrapper {
		display: flex;
		gap: 0.25rem;
	}

	.week-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 1);
		background: rgba(255, 255, 255, 0.9);
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.week-dot.passed {
		background: rgba(0, 0, 0, 0.7);
	}

	.week-dot.current {
		background: #ffd700;
		box-shadow: 0 0 10px #ffd700;
		animation: pulse 2s infinite;
		z-index: 1;
	}

	.week-dot.group-end {
		margin-right: 0.5rem;
	}

	.year-label {
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.75rem;
		font-family: monospace;
		min-width: 2rem;
		text-align: right;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.3);
			opacity: 0.8;
		}
	}

	@media (hover: hover) {
		.week-dot:hover {
			transform: scale(1.3);
			box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
		}
	}

	@media (max-width: 768px) {
		.week-dot {
			width: 8px;
			height: 8px;
		}
		.dots-wrapper {
			gap: 0.15rem;
		}
	}

	@media (max-width: 480px) {
		.week-dot {
			width: 6px;
			height: 6px;
		}
		.dots-wrapper {
			gap: 0.1rem;
		}
		.week-dot.group-end {
			margin-right: 0.25rem;
		}
	}
</style>
