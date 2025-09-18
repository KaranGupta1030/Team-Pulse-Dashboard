import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckSquare } from 'lucide-react';
import type { TeamMember } from '@/store/slices/membersSlice';

interface MemberCardProps {
  member: TeamMember;
}

const statusConfig = {
  working: { color: 'bg-status-working', label: '💼 Working' },
  break: { color: 'bg-status-break', label: '☕ Break' },
  meeting: { color: 'bg-status-meeting', label: '📅 Meeting' },
  offline: { color: 'bg-status-offline', label: '🔒 Offline' },
};

export const MemberCard = ({ member }: MemberCardProps) => {
  const statusInfo = statusConfig[member.status];
  const lastActivity = new Date(member.lastActivity);
  const isRecent = Date.now() - lastActivity.getTime() < 5 * 60 * 1000; // Within 5 minutes

  return (
    <Card className="bg-card hover:shadow-elevated transition-smooth">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-lg">
              {member.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{member.tasksCount} tasks</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{lastActivity.toLocaleTimeString()}</span>
                {isRecent && <span className="text-green-500">●</span>}
              </div>
            </div>
            
            <Badge 
              className={`${statusInfo.color} text-white border-none`}
              variant="default"
            >
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};