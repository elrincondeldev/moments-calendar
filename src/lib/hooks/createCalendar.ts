import dayjs from "dayjs";
import "dayjs/locale/es";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);
dayjs.locale("es");

export function createCalendar(date = dayjs()) {
  const startOfMonth = dayjs(date).startOf("month");

  const startOfCalendar = startOfMonth.weekday(0);

  return Array.from({ length: 42 }).map((_, i) => {
    return startOfCalendar.add(i, "day");
  });
}
