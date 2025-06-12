import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function RecentContent() {
  // Sample data - in a real app, this would come from an API
  const recentContent = [
    {
      id: 1,
      title: '2024년 트렌드 분석',
      type: '블로그',
      status: 'published',
      date: '2024-03-25'
    },
    {
      id: 2,
      title: '신제품 출시 안내',
      type: '뉴스',
      status: 'published',
      date: '2024-03-23'
    },
    {
      id: 3,
      title: '여름 이벤트 안내',
      type: '이벤트',
      status: 'draft',
      date: '2024-03-20'
    },
    {
      id: 4,
      title: '사용자 인터뷰',
      type: '비디오',
      status: 'published',
      date: '2024-03-18'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 콘텐츠</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentContent.map(content => (
            <div key={content.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {content.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {content.type} • {content.date}
                </p>
              </div>
              <Badge
                variant={content.status === 'published' ? 'default' : 'outline'}
              >
                {content.status === 'published' ? '게시됨' : '초안'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
