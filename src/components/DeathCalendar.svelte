<script lang="ts">
	interface Props {
		dateOfBirth: string;
	}

	let { dateOfBirth }: Props = $props();

	function calculateWeeksLived(birthDate: string): number {
		const birth = new Date(birthDate);
		const now = new Date();

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

		const totalWeeks = (age - 1) * 52 + weeksSinceLastBirthday;

		return totalWeeks;
	}

	const weeksLived = $derived(calculateWeeksLived(dateOfBirth));
	const totalYears = 100;
	const weeksPerYear = 52;

	const calendar = $derived(() => {
		const years = [];
		for (let year = 0; year < totalYears; year++) {
			const weeks = [];
			for (let week = 0; week < weeksPerYear; week++) {
				const weekNumber = year * weeksPerYear + week;
				weeks.push({
					week,
					year,
					isPassed: weekNumber < weeksLived,
					isCurrentWeek: weekNumber === weeksLived
				});
			}
			years.push({ year, weeks });
		}
		return years;
	});
</script>

<div class="min-h-screen bg-linear-to-br from-red-600 to-red-700 text-white p-4 md:p-8">
	<div class="text-center py-4">
		<div
			class="flex items-center justify-center gap-4 text-sm md:text-base font-bold tracking-wide"
		>
			<span class="opacity-80 text-lg">✦✦✦</span>
			<span>EACH CIRCLE IS A WEEK OF YOUR LIFE /// MOVE ON</span>
			<span class="opacity-80 text-lg">✦✦✦</span>
		</div>
	</div>

	<div class="flex items-center justify-center">
		<div class="flex flex-col gap-1 w-full p-4 md:p-8 justify-center items-center">
			{#each calendar() as { year, weeks }}
				<div class="flex gap-1 items-center">
					{#each weeks as { week, isPassed, isCurrentWeek }, i}
						{@const isLastInGroup = (i + 1) % 10 === 0 && i < 50}
						<div
							class="week-dot shrink-0 w-[10px] h-[10px] rounded-full transition-all duration-300 cursor-pointer {isPassed
								? 'bg-black/70 shadow-[inset_0_0_3px_rgba(0,0,0,0.5)]'
								: 'bg-white/90'} {isCurrentWeek ? 'current' : ''} {isLastInGroup ? 'mr-2' : ''}"
							title="Year {year + 1}, Week {week + 1}"
						></div>
					{/each}
					<span class="year-label text-white/70 text-xs ml-2 font-mono w-8 text-right"
						>{year + 1}</span
					>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.week-dot:hover {
		transform: scale(1.25);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
	}

	.week-dot.current {
		background: #ffd700;
		box-shadow: 0 0 10px #ffd700;
		animation: pulse 2s infinite;
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

	@media (max-width: 768px) {
		.week-dot {
			width: 8px;
			height: 8px;
		}
	}

	@media (max-width: 480px) {
		.week-dot {
			width: 6px;
			height: 6px;
		}
	}
</style>
