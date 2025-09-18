import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MemberStatus = 'working' | 'break' | 'meeting' | 'offline';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: MemberStatus;
  lastActivity: string;
  tasksCount: number;
}

interface MembersState {
  members: TeamMember[];
  statusFilter: MemberStatus | 'all';
  sortBy: 'name' | 'tasks' | 'status';
}

// Initial mock data
const initialMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👨‍💻',
    role: 'Full Stack Developer',
    status: 'working',
    lastActivity: new Date().toISOString(),
    tasksCount: 3,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: '👩‍💼',
    role: 'Project Manager',
    status: 'meeting',
    lastActivity: new Date().toISOString(),
    tasksCount: 2,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: '👨‍🔬',
    role: 'UI/UX Designer',
    status: 'break',
    lastActivity: new Date().toISOString(),
    tasksCount: 1,
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: '👩‍🎨',
    role: 'Frontend Developer',
    status: 'working',
    lastActivity: new Date().toISOString(),
    tasksCount: 4,
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    avatar: '👨‍💼',
    role: 'Backend Developer',
    status: 'offline',
    lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    tasksCount: 0,
  },
  {
    id: '6',
    name: 'Lisa Kim',
    email: 'lisa@example.com',
    avatar: '👩‍💻',
    role: 'QA Engineer',
    status: 'working',
    lastActivity: new Date().toISOString(),
    tasksCount: 2,
  },
  {
    id: '7',
    name: 'David Thompson',
    email: 'david@example.com',
    avatar: '👨‍🔧',
    role: 'DevOps Engineer',
    status: 'meeting',
    lastActivity: new Date().toISOString(),
    tasksCount: 1,
  },
];

const initialState: MembersState = {
  members: initialMembers,
  statusFilter: 'all',
  sortBy: 'name',
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    updateMemberStatus: (state, action: PayloadAction<{ id: string; status: MemberStatus }>) => {
      const member = state.members.find(m => m.id === action.payload.id);
      if (member) {
        member.status = action.payload.status;
        member.lastActivity = new Date().toISOString();
      }
    },
    setStatusFilter: (state, action: PayloadAction<MemberStatus | 'all'>) => {
      state.statusFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'tasks' | 'status'>) => {
      state.sortBy = action.payload;
    },
    updateTasksCount: (state, action: PayloadAction<{ memberId: string; increment: boolean }>) => {
      const member = state.members.find(m => m.id === action.payload.memberId);
      if (member) {
        if (action.payload.increment) {
          member.tasksCount += 1;
        } else {
          member.tasksCount = Math.max(0, member.tasksCount - 1);
        }
      }
    },
    addMember: (state, action: PayloadAction<Omit<TeamMember, 'id'>>) => {
      const newMember: TeamMember = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.members.push(newMember);
    },
  },
});

export const {
  updateMemberStatus,
  setStatusFilter,
  setSortBy,
  updateTasksCount,
  addMember,
} = membersSlice.actions;

export default membersSlice.reducer;