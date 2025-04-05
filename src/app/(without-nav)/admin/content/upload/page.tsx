import { ContentUploadForm } from '@/components/admin/content-upload-form';

export default function ContentUploadPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">콘텐츠 업로드</h1>
      </div>
      <ContentUploadForm />
    </div>
  );
}
