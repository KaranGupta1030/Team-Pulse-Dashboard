import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { updateMemberStatus, setStatusFilter, setSortBy, addMember } from '@/store/slices/membersSlice';
import { MemberCard } from '@/components/MemberCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Filter, SortAsc } from 'lucide-react';
import { StatusChart } from '@/components/StatusChart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function TeamMembers() {
  const dispatch = useAppDispatch();
  const { members, statusFilter, sortBy } = useAppSelector((state) => state.members);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Filter and sort members
  const filteredMembers = members.filter(member => 
    statusFilter === 'all' || member.status === statusFilter
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

  // Calculate status counts
  const statusCounts = members.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      dispatch(addMember({
        name: newMemberName.trim(),
        email: `${newMemberName.toLowerCase().replace(' ', '.')}@example.com`,
        avatar: '👤',
        role: newMemberRole.trim(),
        status: 'offline',
        tasksCount: 0,
        lastActivity: new Date().toISOString(),
      }));
      setNewMemberName('');
      setNewMemberRole('');
      setShowAddMember(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-muted-foreground">Manage your team and monitor their activity</p>
          </div>
        </div>
        
        <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Add a new member to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter member name"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Enter member role"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddMember(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters & Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-48">
                  <Label>Filter by Status</Label>
                  <Select value={statusFilter} onValueChange={(value: any) => dispatch(setStatusFilter(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="working">Working</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 min-w-48">
                  <Label>Sort by</Label>
                  <Select value={sortBy} onValueChange={(value: any) => dispatch(setSortBy(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="tasks">Task Count</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Working: {statusCounts.working || 0}</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Break: {statusCounts.break || 0}</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Meeting: {statusCounts.meeting || 0}</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span>Offline: {statusCounts.offline || 0}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <StatusChart statusCounts={statusCounts} />
      </div>

      {/* Team Members Grid */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Team Members ({sortedMembers.length})</span>
            <Badge variant="outline">{statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</Badge>
          </CardTitle>
          <CardDescription>
            Monitor your team's current status and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? 'No team members found' 
                  : `No members with ${statusFilter} status`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}