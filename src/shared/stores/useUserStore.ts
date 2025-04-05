import { create } from 'zustand';
import { IUser } from '@/entities/program/type.dto';

interface UserState {
  users: IUser[];
  selectedUserId: number | null;
  setUsers: (users: IUser[]) => void;
  selectUser: (userId: number) => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserState>(set => ({
  users: [],
  selectedUserId: null,
  setUsers: users => set({ users }),
  selectUser: userId => set({ selectedUserId: userId }),
  clearUsers: () => set({ users: [], selectedUserId: null })
}));
