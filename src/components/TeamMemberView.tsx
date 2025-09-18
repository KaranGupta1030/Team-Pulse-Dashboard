import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { updateMemberStatus } from '@/store/slices/membersSlice';
import { updateTaskProgress } from '@/store/slices/tasksSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusSelector } from '@/components/StatusSelector';
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import type { MemberStatus } from '@/store/slices/membersSlice';

export const TeamMemberView = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.role);
  const members = useAppSelector((state) => state.members.members);
  const tasks = useAppSelector((state) => state.tasks.tasks);

  // Find current user's data
  const currentMember = members.find(member => member.name === currentUser);
  const userTasks = tasks.filter(task => task.assignedTo === currentMember?.id);

  const handleStatusUpdate = (status: MemberStatus) => {
    if (currentMember) {
      dispatch(updateMemberStatus({ id: currentMember.id, status }));
    }
  };

  const handleProgressUpdate = (taskId: string, increment: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newProgress = Math.max(0, Math.min(100, task.progress + increment));
      dispatch(updateTaskProgress({ id: taskId, progress: newProgress }));
    }
  };

  const completedTasks = userTasks.filter(task => task.completed).length;
  const avgProgress = userTasks.length > 0 ? userTasks.reduce((sum, task) => sum + task.progress, 0) / userTasks.length : 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {currentUser}!</h1>
        <p className="text-muted-foreground">Manage your status and track your task progress</p>
      </div>

      {/* Status Section */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Your Current Status</CardTitle>
          <CardDescription>Update your working status to keep your team informed</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusSelector 
            currentStatus={currentMember?.status || 'offline'}
            onStatusChange={handleStatusUpdate}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Last updated: {currentMember?.lastActivity ? new Date(currentMember.lastActivity).toLocaleString() : 'Never'}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userTasks.filter(task => {
                const dueDate = new Date(task.dueDate);
                const now = new Date();
                const diff = dueDate.getTime() - now.getTime();
                return diff > 0 && diff < 24 * 60 * 60 * 1000; // Within 24 hours
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks due today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>Track and update your task progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tasks assigned yet. Check back later!</p>
              </div>
            ) : (
              userTasks.map((task) => (
                <div key={task.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{task.title}</h3>
                    <Badge variant={task.completed ? 'default' : 'secondary'}>
                      {task.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                    
                    {!task.completed && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgressUpdate(task.id, -10)}
                          disabled={task.progress <= 0}
                        >
                          -10%
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgressUpdate(task.id, 10)}
                          disabled={task.progress >= 100}
                        >
                          +10%
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-primary text-white border-none hover:opacity-90"
                          onClick={() => handleProgressUpdate(task.id, 100 - task.progress)}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};