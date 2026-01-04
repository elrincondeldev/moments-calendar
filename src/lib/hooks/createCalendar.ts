import dayjs from 'dayjs';
import 'dayjs/locale/es';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale('es');

export function createCalendar(date = dayjs()) {
	const startOfMonth = dayjs(date).startOf('month');

	const startDay = startOfMonth.day();

	const startOfCalendar = startOfMonth.subtract(startDay, 'day');

	return Array.from({ length: 42 }).map((_, i) => {
		return startOfCalendar.add(i, 'day');
	});
}
