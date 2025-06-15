import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { getPlan, getContent } from '../../api';
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
    if (!plan) return;

    const {
      schedule,
      updateSchedule,
      addCoverItem,
      addEtcItem,
      clearCoverItems,
      clearEtcItems
    } = useScheduleStore.getState();

    // 기존 데이터 초기화
    clearCoverItems();
    clearEtcItems();

    // 커버 데이터 설정
    if (plan.coverEduContentId) {
      const coverContent = await getContent(plan.coverEduContentId);
      if (coverContent) {
        addCoverItem({
          id: coverContent.eduContentId!,
          content: coverContent.title,
          thumbnailUrl: coverContent.thumbnailUrl
        });
      }
    }

    // 미들 데이터 설정
    if (plan.middleEduContentIds && plan.middleEduContentIds.length > 0) {
      const middleContents = await Promise.all(
        plan.middleEduContentIds.map(id => getContent(id))
      );

      middleContents.forEach(content => {
        if (content && content.eduContentId) {
          addEtcItem({
            id: content.eduContentId,
            content: content.title,
            thumbnailUrl: content.thumbnailUrl
          });
        }
      });
    }

    // 메인 데이터 설정
    if (!plan.mainEduContentIds?.length) return;

    const updatedSchedule = { ...schedule };

    for (let i = 0; i < plan.mainEduContentIds.length; i++) {
      const contentIds = plan.mainEduContentIds[i];
      if (!contentIds.length) continue;

      const contents = await Promise.all(contentIds.map(id => getContent(id)));
      const [cognitive, daily] = contents;
      const day = i + 1;

      updatedSchedule[day] = {
        ...(cognitive
          ? {
              cognitive: {
                id: cognitive.eduContentId!,
                content: cognitive.title,
                thumbnailUrl: cognitive.thumbnailUrl
              }
            }
          : {}),
        ...(daily
          ? {
              daily: {
                id: daily.eduContentId!,
                content: daily.title,
                thumbnailUrl: daily.thumbnailUrl
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
