import { useAppSelector } from '@/hooks/useRedux';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { TeamLeadView } from '@/components/TeamLeadView';
import { TeamMemberView } from '@/components/TeamMemberView';

const Dashboard = () => {
  const currentRole = useAppSelector((state) => state.role.currentRole);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            {currentRole === 'lead' ? <TeamLeadView /> : <TeamMemberView />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;