import { Schedule } from '../type.dto';

/**
 * year와 month를 기준으로, 스케줄 데이터를 날짜 순서대로 콘텐츠 ID 배열로 포맷
 */
export function formatScheduleData(
  schedule: Schedule,
  year: number,
  month: number
): number[][] {
  const daysInMonth = new Date(year, month, 0).getDate(); // ✅ 해당 월의 일 수 계산

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const daySchedule = schedule[day];

    if (!daySchedule) return [];

    const ids = [];

    if (daySchedule.cognitive) ids.push(daySchedule.cognitive.id);
    if (daySchedule.daily) ids.push(daySchedule.daily.id);

    return ids;
  });
}
