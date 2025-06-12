import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function UpcomingSchedule() {
  // Sample data - in a real app, this would come from an API
  const upcomingSchedule = [
    {
      id: 1,
      title: '월간 뉴스레터',
      date: '2024-04-01',
      time: '09:00',
      type: '이메일'
    },
    {
      id: 2,
      title: '신제품 홍보 영상',
      date: '2024-04-03',
      time: '12:00',
      type: '비디오'
    },
    {
      id: 3,
      title: '봄 시즌 프로모션',
      date: '2024-04-05',
      time: '10:00',
      type: '이벤트'
    },
    {
      id: 4,
      title: '사용자 가이드 업데이트',
      date: '2024-04-08',
      time: '14:00',
      type: '문서'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>예정된 콘텐츠</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSchedule.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.date} • {item.time}
                </p>
              </div>
              <Badge variant="outline">{item.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
