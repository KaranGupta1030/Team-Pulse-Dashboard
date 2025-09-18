import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'lead' | 'member';

interface RoleState {
  currentRole: UserRole;
  currentUser: string;
}

const initialState: RoleState = {
  currentRole: 'member',
  currentUser: 'John Doe',
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<UserRole>) => {
      state.currentRole = action.payload;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { switchRole, setUser } = roleSlice.actions;
export default roleSlice.reducer;