import { useScheduleStore } from '@/shared/stores/useScheduleStore';
import { getPlan, getContent, IPlan } from '../../api';
import { ScheduleItem } from '../../type.dto';

interface AutoRegisterParams {
  plan?: IPlan;
  year: number;
  month: number;
  difficultyLevel: number;
}

export const autoRegisterPlan = async ({
  plan,
  year,
  month,
  difficultyLevel
}: AutoRegisterParams) => {
  try {
    // plan이 제공되지 않으면 내부에서 가져오기
    let targetPlan = plan;
    if (!targetPlan) {
      targetPlan = await getPlan({ year, month, difficultyLevel });
    }

    if (!targetPlan) return;

    const {
      schedule,
      updateSchedule,
      addCoverItem,
      addEtcItem,
      clearCoverItems,
      clearEtcItems,
      saveSchedule
    } = useScheduleStore.getState();

    // 기존 데이터 초기화
    clearCoverItems();
    clearEtcItems();

    // 커버 데이터 설정
    if (targetPlan.coverEduContentId) {
      const coverContent = await getContent(targetPlan.coverEduContentId);
      if (coverContent) {
        addCoverItem({
          id: coverContent.eduContentId!,
          content: coverContent.title,
          thumbnailUrl: coverContent.thumbnailUrl
        });
      }
    }

    // 미들 데이터 설정
    if (
      targetPlan.middleEduContentIds &&
      targetPlan.middleEduContentIds.length > 0
    ) {
      const middleContents = await Promise.all(
        targetPlan.middleEduContentIds.map(id => getContent(id))
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
    if (!targetPlan.mainEduContentIds?.length) return;

    const updatedSchedule = { ...schedule };

    for (let i = 0; i < targetPlan.mainEduContentIds.length; i++) {
      const contentIds = targetPlan.mainEduContentIds[i];
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

    // getPlan이 성공적으로 실행되면 스케줄 저장
    const dateKey = `${year}-${month.toString().padStart(2, '0')}`;
    saveSchedule(dateKey, updatedSchedule);
  } catch (error) {
    console.error('Error while auto-registering the plan:', error);
  }
};
