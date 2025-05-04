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

    const {
      schedule,
      updateSchedule,
      addCoverItem,
      addEtcItem,
      disabledDrops
    } = useScheduleStore.getState();

    const updatedSchedule = { ...schedule };

    for (let i = 0; i < plan.mainEduContentIds.length; i++) {
      const contentIds = plan.mainEduContentIds[i];
      if (!contentIds.length) continue;

      const contents = await Promise.all(
        contentIds.map(id => searchContent(id))
      );

      const [cognitive, daily] = contents;
      const day = i + 1;

      // ✅ Check if either cognitive or daily drop is disabled for the day
      const cognitiveDisabled = disabledDrops.has(`${day}-cognitive`);
      const dailyDisabled = disabledDrops.has(`${day}-daily`);

      const daySchedule: Record<string, ScheduleItem> = {};

      if (!cognitiveDisabled && cognitive) {
        daySchedule.cognitive = {
          id: cognitive.eduContentId!,
          content: cognitive.title
        };
      }

      if (!dailyDisabled && daily) {
        daySchedule.daily = {
          id: daily.eduContentId!,
          content: daily.title
        };
      }

      // ✅ Only assign if there's at least one valid entry
      if (Object.keys(daySchedule).length > 0) {
        updatedSchedule[day] = daySchedule;
      }

      // ✅ Cover & etc는 기존 로직 유지 (cover는 첫 날만)
      if (i === 0 && cognitive && !cognitiveDisabled) {
        addCoverItem({
          id: cognitive.eduContentId!,
          content: cognitive.title
        });
      }

      if (daily && !dailyDisabled) {
        addEtcItem({
          id: daily.eduContentId!,
          content: daily.title
        });
      }
    }

    updateSchedule(updatedSchedule);
  } catch (error) {
    console.error('Error while auto-registering the plan:', error);
  }
};
