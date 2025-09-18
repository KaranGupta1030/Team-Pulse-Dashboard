import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setStatusFilter, setSortBy } from '@/store/slices/membersSlice';
import { addTask } from '@/store/slices/tasksSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberCard } from '@/components/MemberCard';
import { TaskForm } from '@/components/TaskForm';
import { StatusChart } from '@/components/StatusChart';
import { Plus, Users, Clock, Target, TrendingUp } from 'lucide-react';

export const TeamLeadView = () => {
  const dispatch = useAppDispatch();
  const { members, statusFilter, sortBy } = useAppSelector((state) => state.members);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Filter and sort members
  const filteredMembers = members.filter(member => 
    statusFilter === 'all' ? true : member.status === statusFilter
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'tasks':
        return b.tasksCount - a.tasksCount;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate statistics
  const statusCounts = members.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const avgProgress = tasks.length > 0 ? tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length : 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Lead Dashboard</h1>
          <p className="text-muted-foreground">Monitor your team's progress and assign tasks</p>
        </div>
        <Button 
          onClick={() => setShowTaskForm(true)}
          className="bg-gradient-primary text-white border-none hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Assign Task
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.working || 0} working • {statusCounts.meeting || 0} in meetings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks - completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed of {totalTasks}
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
              Across all active tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Status Overview */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Monitor your team's current status</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select value={statusFilter} onValueChange={(value: any) => dispatch(setStatusFilter(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="working">Working</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: any) => dispatch(setSortBy(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="tasks">Tasks</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution Chart */}
        <div>
          <StatusChart statusCounts={statusCounts} />
        </div>
      </div>

      {/* Task Assignment Modal */}
      {showTaskForm && (
        <TaskForm 
          members={members}
          onClose={() => setShowTaskForm(false)}
          onSubmit={(taskData) => {
            dispatch(addTask(taskData));
            setShowTaskForm(false);
          }}
        />
      )}
    </div>
  );
};