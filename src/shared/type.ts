export interface ICategory {
  categoryId: number;
  parentId: number | null;
  name: string;
  isUsed: boolean;
  children: ICategory[];
}
export interface IRes<T> {
  data: T;
  message: string;
}
