import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusChartProps {
  statusCounts: Record<string, number>;
}

const statusColors = {
  working: 'hsl(142, 71%, 45%)',
  break: 'hsl(48, 96%, 53%)',
  meeting: 'hsl(221, 83%, 53%)',
  offline: 'hsl(0, 0%, 45%)',
};

export const StatusChart = ({ statusCounts }: StatusChartProps) => {
  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: statusColors[status as keyof typeof statusColors] || '#8884d8',
  }));

  const totalMembers = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle>Team Status Distribution</CardTitle>
        <CardDescription>Current status breakdown of {totalMembers} team members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};