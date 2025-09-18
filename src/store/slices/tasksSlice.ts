import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string; // member ID
  assignedBy: string; // lead name
  dueDate: string;
  progress: number; // 0-100
  completed: boolean;
  createdAt: string;
}

interface TasksState {
  tasks: Task[];
}

// Initial mock tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Implement responsive navigation',
    description: 'Create a mobile-friendly navigation component with proper accessibility',
    assignedTo: '1',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    progress: 60,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design dashboard wireframes',
    description: 'Create wireframes for the new dashboard layout and user flows',
    assignedTo: '2',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
    progress: 30,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'API performance optimization',
    description: 'Optimize database queries and implement caching for better performance',
    assignedTo: '5',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 1 day from now
    progress: 90,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline',
    assignedTo: '7',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    progress: 45,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'User interface testing',
    description: 'Write comprehensive UI tests for critical user journeys',
    assignedTo: '6',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days from now
    progress: 20,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Frontend component library',
    description: 'Build reusable component library with Storybook documentation',
    assignedTo: '4',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
    progress: 75,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Database optimization',
    description: 'Optimize database schema and add proper indexing',
    assignedTo: '5',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago (overdue)
    progress: 85,
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: '8',
    title: 'Security audit report',
    description: 'Complete security assessment and vulnerability testing',
    assignedTo: '6',
    assignedBy: 'Team Lead',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days from now
    progress: 100,
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

const initialState: TasksState = {
  tasks: initialTasks,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    updateTaskProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.progress = Math.max(0, Math.min(100, action.payload.progress));
        task.completed = task.progress === 100;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    markTaskComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.progress = 100;
        task.completed = true;
      }
    },
  },
});

export const {
  addTask,
  updateTaskProgress,
  deleteTask,
  markTaskComplete,
} = tasksSlice.actions;

export default tasksSlice.reducer;