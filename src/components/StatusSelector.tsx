import { Button } from '@/components/ui/button';
import type { MemberStatus } from '@/store/slices/membersSlice';

interface StatusSelectorProps {
  currentStatus: MemberStatus;
  onStatusChange: (status: MemberStatus) => void;
}

const statusOptions = [
  { value: 'working' as const, label: '💼 Working', color: 'bg-status-working hover:bg-status-working/90' },
  { value: 'break' as const, label: '☕ Break', color: 'bg-status-break hover:bg-status-break/90' },
  { value: 'meeting' as const, label: '📅 Meeting', color: 'bg-status-meeting hover:bg-status-meeting/90' },
  { value: 'offline' as const, label: '🔒 Offline', color: 'bg-status-offline hover:bg-status-offline/90' },
];

export const StatusSelector = ({ currentStatus, onStatusChange }: StatusSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {statusOptions.map((status) => (
        <Button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          variant={currentStatus === status.value ? 'default' : 'outline'}
          className={`${
            currentStatus === status.value
              ? `${status.color} text-white border-none`
              : 'hover:border-primary'
          } transition-smooth`}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
};