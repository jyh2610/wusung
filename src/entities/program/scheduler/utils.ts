import { Schedule } from '../type.dto';

export function formatScheduleData(schedule: Schedule): number[][] {
  return Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    const daySchedule = schedule[day];

    if (!daySchedule) return []; // 스케줄이 없으면 빈 배열 반환

    const ids = [];
    if (daySchedule.cognitive) ids.push(daySchedule.cognitive.eduContentId);
    if (daySchedule.daily) ids.push(daySchedule.daily.eduContentId);

    return ids;
  });
}
