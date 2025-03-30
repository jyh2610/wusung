export interface ICategory {
  categoryId: number;
  parentId: number | null;
  name: string;
  isUsed: boolean;
  children: ICategory[];
}
