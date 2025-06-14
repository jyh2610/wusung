import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { getPlan, searchContent } from '../../api';
import { ScheduleItem } from '../../type.dto';

interface AutoRegisterParams {
  year: number;
  month: number;
  difficultyLevel: number;
}

export const autoRegisterPlan = async ({
  year,
  month,
  difficultyLevel
}: AutoRegisterParams) => {
  try {
    const plan = await getPlan({ year, month, difficultyLevel });
    if (!plan?.mainEduContentIds?.length) return;

    const { schedule, updateSchedule, addCoverItem, addEtcItem } =
      useScheduleStore.getState();

    const updatedSchedule = { ...schedule };

    for (let i = 0; i < plan.mainEduContentIds.length; i++) {
      const contentIds = plan.mainEduContentIds[i];
      if (!contentIds.length) continue;

      const contents = await Promise.all(
        contentIds.map(id => searchContent(id))
      );
      const [cognitive, daily] = contents;
      const day = i + 1;

      if (daily) {
        addEtcItem({
          id: daily.eduContentId!,
          content: daily.title
        });
      }

      // ✅ disabled 상태 고려 없이 모든 날짜에 등록
      updatedSchedule[day] = {
        ...(cognitive
          ? {
              cognitive: {
                id: cognitive.eduContentId!,
                content: cognitive.title
              }
            }
          : {}),
        ...(daily
          ? {
              daily: {
                id: daily.eduContentId!,
                content: daily.title
              }
            }
          : {})
      };
    }

    updateSchedule(updatedSchedule);
  } catch (error) {
    console.error('Error while auto-registering the plan:', error);
  }
};
