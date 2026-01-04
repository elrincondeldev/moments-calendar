<script lang="ts">
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import type { Dayjs } from 'dayjs';
	import 'dayjs/locale/es';
	import weekday from 'dayjs/plugin/weekday';
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
	import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
	import { createCalendar } from '$lib/hooks/createCalendar';
	import type { Moment } from '$lib/moments';
	import { createMoment, deleteMoment } from '$lib/moments';

	dayjs.extend(weekday);
	dayjs.extend(isSameOrBefore);
	dayjs.extend(isSameOrAfter);
	dayjs.locale('es');

	interface Props {
		onDayClick?: (date: Dayjs) => void;
		moments?: Moment[];
		onMomentCreated?: () => void;
	}

	let { onDayClick, moments = [], onMomentCreated }: Props = $props();

	let currentDate = $state(dayjs());
	let selectedDay = $state<Dayjs | null>(null);
	let showMomentModal = $state(false);
	let momentTitle = $state('');
	let momentDescription = $state('');
	let isSaving = $state(false);

	let days = $derived(createCalendar(currentDate));
	let monthName = $derived(currentDate.format('MMMM YYYY'));

	const today = dayjs().startOf('day');

	function hasMoments(date: Dayjs): boolean {
		return moments.some(
			(moment) => dayjs(moment.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
		);
	}

	function getMomentsForDay(date: Dayjs): Moment[] {
		return moments.filter(
			(moment) => dayjs(moment.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
		);
	}

	function getDayStatus(date: Dayjs): 'future' | 'today' | 'alive' | 'dead' {
		if (date.isAfter(today)) return 'future';
		if (date.isSame(today, 'day')) return 'today';
		if (hasMoments(date)) return 'alive';
		return 'dead';
	}

	const nextMonth = () => (currentDate = currentDate.add(1, 'month'));
	const prevMonth = () => (currentDate = currentDate.subtract(1, 'month'));
	const goToToday = () => (currentDate = dayjs());

	function handleDayClick(date: Dayjs) {
		selectedDay = date;
		if (onDayClick) {
			onDayClick(date);
		}
		if (!date.isAfter(today)) {
			showMomentModal = true;
		}
	}

	function closeModal() {
		showMomentModal = false;
		momentTitle = '';
		momentDescription = '';
		selectedDay = null;
	}

	async function saveMoment() {
		if (!selectedDay || !momentTitle.trim() || isSaving) return;

		isSaving = true;

		try {
			const newMoment = await createMoment({
				title: momentTitle.trim(),
				description: momentDescription.trim() || undefined,
				date: selectedDay.format('YYYY-MM-DD')
			});

			if (newMoment) {
				if (onMomentCreated) {
					onMomentCreated();
				}

				momentTitle = '';
				momentDescription = '';
			} else {
				alert('Error al guardar el momento. Por favor, intenta de nuevo.');
			}
		} catch (error) {
			console.error('Error saving moment:', error);
			alert('Error al guardar el momento. Por favor, intenta de nuevo.');
		} finally {
			isSaving = false;
		}
	}

	async function handleDeleteMoment(momentId: string) {
		if (!confirm('¿Estás seguro de que quieres eliminar este momento?')) {
			return;
		}

		const success = await deleteMoment(momentId);

		if (success && onMomentCreated) {
			onMomentCreated();
		} else if (!success) {
			alert('Error al eliminar el momento. Por favor, intenta de nuevo.');
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && showMomentModal) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="calendar-wrapper">
	<div class="calendar-header">
		<button class="nav-button" onclick={prevMonth} aria-label="Mes anterior">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<div class="header-center">
			<h2 class="month-title">{monthName}</h2>
			<button class="today-button" onclick={goToToday}>Hoy</button>
		</div>

		<button class="nav-button" onclick={nextMonth} aria-label="Mes siguiente">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</div>

	<div class="weekdays">
		{#each ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as day}
			<div class="weekday-label">{day}</div>
		{/each}
	</div>

	<div class="days-grid">
		{#each days as day}
			{@const status = getDayStatus(day)}
			{@const isCurrentMonth = day.month() === currentDate.month()}
			{@const dayMoments = getMomentsForDay(day)}
			<button
				class="day-cell"
				class:other-month={!isCurrentMonth}
				class:dead={status === 'dead'}
				class:alive={status === 'alive'}
				class:today={status === 'today'}
				class:future={status === 'future'}
				onclick={() => handleDayClick(day)}
				aria-label="Día {day.format('D')} de {day.format('MMMM')}"
			>
				<span class="day-number">{day.format('D')}</span>

				{#if dayMoments.length > 0}
					<div class="moment-indicators">
						{#each dayMoments.slice(0, 3) as moment}
							<div class="moment-dot" title={moment.title}></div>
						{/each}
					</div>
				{/if}

				{#if status === 'alive'}
					<div class="alive-glow"></div>
				{/if}
			</button>
		{/each}
	</div>

	<div class="legend">
		<div class="legend-item">
			<div class="legend-circle dead-legend"></div>
			<span>Día sin momentos</span>
		</div>
		<div class="legend-item">
			<div class="legend-circle alive-legend"></div>
			<span>Día con momentos</span>
		</div>
		<div class="legend-item">
			<div class="legend-circle today-legend"></div>
			<span>Hoy</span>
		</div>
	</div>
</div>

{#if showMomentModal && selectedDay}
	{@const dayMoments = getMomentsForDay(selectedDay)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div class="modal-overlay" onclick={closeModal} role="dialog" aria-modal="true" tabindex="-1">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3 class="modal-title">
					{selectedDay.format('D [de] MMMM, YYYY')}
				</h3>
				<button class="close-button" onclick={closeModal} aria-label="Cerrar">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							d="M18 6L6 18M6 6l12 12"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>

			<div class="modal-body">
				{#if dayMoments.length > 0}
					<div class="existing-moments">
						<h4 class="section-title">Momentos de este día</h4>
						{#each dayMoments as moment}
							<div class="moment-card">
								<div class="moment-card-content">
									<div>
										<h5 class="moment-title">{moment.title}</h5>
										{#if moment.description}
											<p class="moment-description">{moment.description}</p>
										{/if}
									</div>
									<button
										class="delete-moment-btn"
										onclick={() => handleDeleteMoment(moment.id)}
										aria-label="Eliminar momento"
										title="Eliminar momento"
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
										>
											<path
												d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				{#if !selectedDay.isAfter(today)}
					<div class="add-moment-form">
						<h4 class="section-title">
							{dayMoments.length > 0 ? 'Agregar otro momento' : 'Agregar momento'}
						</h4>

						<div class="form-group">
							<label for="moment-title">¿Qué hiciste hoy?</label>
							<input
								id="moment-title"
								type="text"
								bind:value={momentTitle}
								placeholder="Ej: Almuerzo con amigos, terminé un proyecto..."
								class="moment-input"
							/>
						</div>

						<div class="form-group">
							<label for="moment-description">Detalles (opcional)</label>
							<textarea
								id="moment-description"
								bind:value={momentDescription}
								placeholder="Describe este momento..."
								class="moment-textarea"
								rows="4"
							></textarea>
						</div>

						<div class="modal-actions">
							<button class="cancel-button" onclick={closeModal}>Cancelar</button>
							<button
								class="save-button"
								onclick={saveMoment}
								disabled={!momentTitle.trim() || isSaving}
							>
								{isSaving ? 'Guardando...' : 'Guardar momento'}
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.calendar-wrapper {
		background: #ffffff;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		max-width: 1000px;
		margin: 0 auto;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		gap: 1rem;
	}

	.header-center {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
		justify-content: center;
	}

	.month-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a2e;
		text-transform: capitalize;
		margin: 0;
	}

	.nav-button {
		width: 40px;
		height: 40px;
		border: none;
		background: #f5f5f7;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #1a1a2e;
	}

	.nav-button:hover {
		background: #e8e8ea;
		transform: scale(1.05);
	}

	.today-button {
		padding: 0.5rem 1rem;
		border: 1px solid #e0e0e5;
		background: white;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #1a1a2e;
	}

	.today-button:hover {
		background: #f5f5f7;
		border-color: #1a1a2e;
	}

	/* Weekdays */
	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.weekday-label {
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: #666;
		padding: 0.5rem;
	}

	/* Days Grid */
	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
	}

	.day-cell {
		aspect-ratio: 1;
		border: 2px solid #e0e0e5;
		border-radius: 12px;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		position: relative;
		transition: all 0.2s ease;
		padding: 0.5rem;
		min-height: 80px;
	}

	.day-cell:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.day-number {
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a2e;
		margin-bottom: 0.25rem;
	}

	/* Estados de los días */
	.day-cell.other-month {
		opacity: 0.3;
	}

	.day-cell.dead {
		background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
		border-color: #000;
		box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
	}

	.day-cell.dead .day-number {
		color: #666;
	}

	.day-cell.dead:hover {
		background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
	}

	.day-cell.alive {
		background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #ee5a6f 100%);
		border-color: #ffd700;
		box-shadow:
			0 0 20px rgba(255, 215, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		position: relative;
		overflow: hidden;
	}

	.day-cell.alive .day-number {
		color: white;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		font-weight: 700;
		position: relative;
		z-index: 2;
	}

	.alive-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3), transparent 70%);
		animation: glowPulse 2s ease-in-out infinite;
	}

	@keyframes glowPulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	.day-cell.today {
		background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
		border-color: #6c5ce7;
		box-shadow: 0 0 20px rgba(108, 92, 231, 0.5);
		animation: todayPulse 2s ease-in-out infinite;
	}

	.day-cell.today .day-number {
		color: white;
		font-weight: 700;
	}

	@keyframes todayPulse {
		0%,
		100% {
			box-shadow: 0 0 20px rgba(108, 92, 231, 0.5);
		}
		50% {
			box-shadow: 0 0 30px rgba(108, 92, 231, 0.8);
		}
	}

	.day-cell.future {
		background: white;
		border-color: #e0e0e5;
	}

	.day-cell.future:hover {
		border-color: #6c5ce7;
	}

	/* Moment indicators */
	.moment-indicators {
		display: flex;
		gap: 3px;
		margin-top: 4px;
		position: relative;
		z-index: 2;
	}

	.moment-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	/* Legend */
	.legend {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e0e0e5;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #666;
	}

	.legend-circle {
		width: 20px;
		height: 20px;
		border-radius: 6px;
		border: 2px solid #e0e0e5;
	}

	.dead-legend {
		background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
		border-color: #000;
	}

	.alive-legend {
		background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #ee5a6f 100%);
		border-color: #ffd700;
	}

	.today-legend {
		background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
		border-color: #6c5ce7;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 16px;
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e0e0e5;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1a1a2e;
		margin: 0;
		text-transform: capitalize;
	}

	.close-button {
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #666;
	}

	.close-button:hover {
		background: #f5f5f7;
		color: #1a1a2e;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.section-title {
		font-size: 1rem;
		font-weight: 600;
		color: #1a1a2e;
		margin: 0 0 1rem 0;
	}

	/* Existing moments */
	.existing-moments {
		margin-bottom: 2rem;
	}

	.moment-card {
		background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #ee5a6f 100%);
		padding: 1rem;
		border-radius: 12px;
		margin-bottom: 0.75rem;
		box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
	}

	.moment-card-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.moment-card-content > div {
		flex: 1;
	}

	.delete-moment-btn {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 8px;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		color: white;
		flex-shrink: 0;
	}

	.delete-moment-btn:hover {
		background: rgba(0, 0, 0, 0.4);
		border-color: rgba(255, 255, 255, 0.5);
		transform: scale(1.05);
	}

	.delete-moment-btn:active {
		transform: scale(0.95);
	}

	.moment-title {
		font-size: 1rem;
		font-weight: 600;
		color: white;
		margin: 0 0 0.5rem 0;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.moment-description {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.95);
		margin: 0;
		line-height: 1.5;
	}

	.add-moment-form {
		padding-top: 2rem;
		border-top: 1px solid #e0e0e5;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: #1a1a2e;
		margin-bottom: 0.5rem;
	}

	.moment-input,
	.moment-textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e5;
		border-radius: 8px;
		font-size: 1rem;
		font-family: inherit;
		transition: all 0.2s ease;
		background: white;
	}

	.moment-input:focus,
	.moment-textarea:focus {
		outline: none;
		border-color: #6c5ce7;
		box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
	}

	.moment-textarea {
		resize: vertical;
		min-height: 100px;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 2rem;
	}

	.cancel-button,
	.save-button {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
	}

	.cancel-button {
		background: #f5f5f7;
		color: #666;
	}

	.cancel-button:hover {
		background: #e8e8ea;
	}

	.save-button {
		background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
		color: white;
		box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
	}

	.save-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
	}

	.save-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.calendar-wrapper {
			padding: 1rem;
		}

		.month-title {
			font-size: 1.25rem;
		}

		.day-cell {
			min-height: 60px;
			border-radius: 8px;
		}

		.day-number {
			font-size: 0.875rem;
		}

		.legend {
			flex-wrap: wrap;
			gap: 1rem;
		}

		.modal-content {
			margin: 1rem;
		}
	}

	@media (max-width: 480px) {
		.calendar-wrapper {
			padding: 0.75rem;
		}

		.header-center {
			flex-direction: column;
			gap: 0.5rem;
		}

		.day-cell {
			min-height: 50px;
			padding: 0.25rem;
		}

		.day-number {
			font-size: 0.75rem;
		}

		.moment-dot {
			width: 4px;
			height: 4px;
		}

		.weekday-label {
			font-size: 0.75rem;
		}
	}
</style>
