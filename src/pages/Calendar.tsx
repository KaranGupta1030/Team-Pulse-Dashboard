import { useState } from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, CheckSquare } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks } = useAppSelector((state) => state.tasks);
  const { members } = useAppSelector((state) => state.members);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  // Get member name by ID
  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.name || 'Unknown';
  };

  // Get upcoming tasks (next 7 days)
  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate <= nextWeek && !task.completed;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const upcomingTasks = getUpcomingTasks();

  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate < new Date() && !task.completed;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <CalendarIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and manage your team's schedule</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{upcomingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {members.filter(m => m.status !== 'offline').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{format(currentDate, 'MMMM yyyy')}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="px-3 py-1 text-sm border rounded hover:bg-accent"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm border rounded hover:bg-accent"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="px-3 py-1 text-sm border rounded hover:bg-accent"
                  >
                    →
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map(date => {
                  const dayTasks = getTasksForDate(date);
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isTodayDate = isToday(date);
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "min-h-20 p-1 border rounded-lg transition-colors",
                        isCurrentMonth ? "bg-background" : "bg-muted/50",
                        isTodayDate && "ring-2 ring-primary",
                        dayTasks.length > 0 && "border-primary/50"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        isTodayDate && "text-primary font-bold",
                        !isCurrentMonth && "text-muted-foreground"
                      )}>
                        {format(date, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map(task => (
                          <div
                            key={task.id}
                            className={cn(
                              "text-xs p-1 rounded truncate",
                              task.completed 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            )}
                            title={task.title}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Upcoming Tasks</span>
              </CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-start space-x-3 p-2 rounded-lg border">
                      <CheckSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{task.title}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
                          <span>•</span>
                          <span>{getMemberName(task.assignedTo)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {task.progress}% complete
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingTasks.length > 5 && (
                    <div className="text-sm text-muted-foreground text-center">
                      +{upcomingTasks.length - 5} more tasks
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No upcoming tasks</p>
              )}
            </CardContent>
          </Card>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <Card className="bg-gradient-card shadow-card border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <Clock className="w-5 h-5" />
                  <span>Overdue Tasks</span>
                </CardTitle>
                <CardDescription>Require immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-start space-x-3 p-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <CheckSquare className="w-4 h-4 mt-0.5 text-red-600" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{task.title}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>Due: {format(new Date(task.dueDate), 'MMM dd')}</span>
                          <span>•</span>
                          <span>{getMemberName(task.assignedTo)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {overdueTasks.length > 3 && (
                    <div className="text-sm text-red-600 text-center">
                      +{overdueTasks.length - 3} more overdue
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Status */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Team Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {members.slice(0, 4).map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{member.name}</span>
                    <Badge 
                      variant={member.status === 'working' ? 'default' : 'secondary'}
                      className={cn(
                        member.status === 'working' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                        member.status === 'break' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        member.status === 'meeting' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                        member.status === 'offline' && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      )}
                    >
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}