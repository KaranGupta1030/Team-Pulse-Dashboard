import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addTask, updateTaskProgress, deleteTask, markTaskComplete } from '@/store/slices/tasksSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Plus, Calendar, User, Trash2, CheckCircle, Clock } from 'lucide-react';
import { TaskForm } from '@/components/TaskForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);
  const { members } = useAppSelector((state) => state.members);
  const { currentRole, currentUser } = useAppSelector((state) => state.role);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Get current user's ID for member view
  const currentMember = members.find(m => m.name === currentUser);
  
  // Filter tasks based on role and filters
  const filteredTasks = tasks.filter(task => {
    // For team members, only show their tasks
    if (currentRole === 'member' && task.assignedTo !== currentMember?.id) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'overdue') {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        if (task.completed || dueDate > now) return false;
      }
    }
    
    // Assignee filter (only for leads)
    if (currentRole === 'lead' && assigneeFilter !== 'all' && task.assignedTo !== assigneeFilter) {
      return false;
    }
    
    return true;
  });

  const handleProgressUpdate = (taskId: string, increment: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newProgress = Math.max(0, Math.min(100, task.progress + increment));
      dispatch(updateTaskProgress({ id: taskId, progress: newProgress }));
    }
  };

  const getTaskStatusBadge = (task: any) => {
    if (task.completed) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
    }
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    if (dueDate < now) {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Overdue</Badge>;
    }
    
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 1) {
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Due Soon</Badge>;
    }
    
    return <Badge variant="outline">In Progress</Badge>;
  };

  const getAssigneeName = (assignedTo: string) => {
    const member = members.find(m => m.id === assignedTo);
    return member?.name || 'Unknown';
  };

  // Statistics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.completed).length;
  const overdueTasks = filteredTasks.filter(t => {
    if (t.completed) return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  const avgProgress = totalTasks > 0 
    ? Math.round(filteredTasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckSquare className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">
              {currentRole === 'lead' ? 'Manage and assign tasks to your team' : 'Track your assigned tasks and progress'}
            </p>
          </div>
        </div>
        
        {currentRole === 'lead' && (
          <Button onClick={() => setShowTaskForm(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Assign Task</span>
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {currentRole === 'lead' && (
              <div className="flex-1 min-w-48">
                <label className="text-sm font-medium">Assignee</label>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
          <CardDescription>
            {currentRole === 'lead' ? 'All team tasks' : 'Your assigned tasks'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{task.title}</h3>
                        {getTaskStatusBadge(task)}
                      </div>
                      
                      {task.description && (
                        <p className="text-muted-foreground text-sm mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {currentRole === 'lead' && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{getAssigneeName(task.assignedTo)}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Created: {format(new Date(task.createdAt), 'MMM dd')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {currentRole === 'lead' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(deleteTask(task.id))}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="w-full" />
                    
                    {currentRole === 'member' && !task.completed && (
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProgressUpdate(task.id, -10)}
                          disabled={task.progress <= 0}
                        >
                          -10%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProgressUpdate(task.id, 10)}
                          disabled={task.progress >= 100}
                        >
                          +10%
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => dispatch(markTaskComplete(task.id))}
                          disabled={task.completed}
                          className="ml-auto"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Complete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? (currentRole === 'lead' ? 'No tasks assigned yet' : 'No tasks assigned to you')
                  : `No ${statusFilter} tasks found`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  );
}