import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { getPlan, searchContent } from '../../api';

interface AutoRegisterParams {
  year: string;
  month: string;
  difficultyLevel: number;
}

export const autoRegisterPlan = async ({
  year,
  month,
  difficultyLevel
}: AutoRegisterParams) => {
  const plan = await getPlan({ year, month, difficultyLevel });

  if (!plan?.mainEduContentIds?.length) return;

  const { schedule, updateSchedule } = useScheduleStore.getState();

  const updatedSchedule = { ...schedule };

  for (let i = 0; i < plan.mainEduContentIds.length; i++) {
    const contentIds = plan.mainEduContentIds[i];

    if (!contentIds.length) continue; // ✅ 빈 배열은 skip

    const contents = await Promise.all(contentIds.map(id => searchContent(id)));

    const [cognitive, daily] = contents;

    const day = i + 1;

    updatedSchedule[day] = {
      ...(cognitive && {
        cognitive: {
          id: cognitive.eduContentId!,
          content: cognitive.title
        }
      }),
      ...(daily && {
        daily: {
          id: daily.eduContentId!,
          content: daily.title
        }
      })
    };
  }

  updateSchedule(updatedSchedule);
};
