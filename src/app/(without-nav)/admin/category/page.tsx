import { Category } from '@/components/admin/category';

const CategoryPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">카테고리 관리</h1>
      <Category />
    </div>
  );
};

export default CategoryPage;
