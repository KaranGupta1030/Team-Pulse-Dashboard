import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setUser, switchRole } from '@/store/slices/roleSlice';
import { setTheme } from '@/store/slices/themeSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Moon, Sun, Bell, Shield, Database, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { currentRole, currentUser } = useAppSelector((state) => state.role);
  const { theme } = useAppSelector((state) => state.theme);
  const { members } = useAppSelector((state) => state.members);
  const { tasks } = useAppSelector((state) => state.tasks);
  
  const [userName, setUserName] = useState(currentUser);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveProfile = () => {
    if (userName.trim()) {
      dispatch(setUser(userName.trim()));
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    }
  };

  const handleExportData = () => {
    const data = {
      members,
      tasks,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-pulse-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleRoleSwitch = (newRole: string) => {
    dispatch(switchRole(newRole as 'lead' | 'member'));
    toast({
      title: "Role Switched",
      description: `You are now viewing as ${newRole === 'lead' ? 'Team Lead' : 'Team Member'}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Settings</span>
              </CardTitle>
              <CardDescription>Manage your personal information and role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userName">Display Name</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentRole">Current Role</Label>
                  <Select value={currentRole} onValueChange={handleRoleSwitch}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Team Member</SelectItem>
                      <SelectItem value="lead">Team Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={currentRole === 'lead' ? 'default' : 'secondary'}>
                  {currentRole === 'lead' ? 'Team Lead' : 'Team Member'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Current role determines your dashboard view and permissions
                </span>
              </div>
              
              <Button onClick={handleSaveProfile}>
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <Select value={theme} onValueChange={(value) => dispatch(setTheme(value as any))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose your preferred theme or sync with system settings
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about task assignments and updates
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-save Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your progress and settings
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Data Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Team Members</span>
                <Badge variant="outline">{members.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Tasks</span>
                <Badge variant="outline">{tasks.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Tasks</span>
                <Badge variant="outline">
                  {tasks.filter(t => t.completed).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Members</span>
                <Badge variant="outline">
                  {members.filter(m => m.status !== 'offline').length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export and manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Export all your team data including members and tasks in JSON format.
              </p>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Storage</span>
                  <Badge variant="outline" className="text-xs">Local</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-save</span>
                  <Badge variant="outline" className="text-xs">
                    {autoSave ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Your data is stored locally in your browser. No external servers are used.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}