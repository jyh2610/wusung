import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { getPlan, searchContent } from '../../api';

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
    // Fetch the plan data
    const plan = await getPlan({ year, month, difficultyLevel });

    // If the plan doesn't contain any mainEduContentIds, exit early
    if (!plan?.mainEduContentIds?.length) return;

    // Get the current schedule and prepare for updates
    const { schedule, updateSchedule, addCoverItem, addEtcItem } =
      useScheduleStore.getState();
    const updatedSchedule = { ...schedule };

    // Loop through each set of contentIds in the plan
    for (let i = 0; i < plan.mainEduContentIds.length; i++) {
      const contentIds = plan.mainEduContentIds[i];

      if (!contentIds.length) continue; // Skip empty arrays

      // Fetch content details for the current contentIds
      const contents = await Promise.all(
        contentIds.map(id => searchContent(id))
      );

      const [cognitive, daily] = contents;

      // Prepare the day object (incremented by 1 for days)
      const day = i + 1;

      // Add to coverItems if this is the first day (you can change this logic as needed)
      if (i === 0 && cognitive) {
        addCoverItem({
          id: cognitive.eduContentId!,
          content: cognitive.title
        });
      }

      // Add to etcItems for other days
      if (daily) {
        addEtcItem({
          id: daily.eduContentId!,
          content: daily.title
        });
      }

      // Update the schedule for the day (this can be adjusted based on your schedule structure)
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

    // Update the global schedule state
    updateSchedule(updatedSchedule);
  } catch (error) {
    console.error('Error while auto-registering the plan:', error);
  }
};
