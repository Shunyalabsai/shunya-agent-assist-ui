import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { Button } from '@/components/ui/button';
import { useDashboardConfig } from '@/stores/use-dashboard-config';
import { DashboardMetricCard } from '@/features/dashboards/components/dashboard-metric-card';
import { DashboardChartCard } from '@/features/dashboards/components/dashboard-chart-card';
import { DashboardTableCard } from '@/features/dashboards/components/dashboard-table-card';
import { UserListTable } from '@/features/shared/components/user-list-table';
import { mockMetricsData, mockChartsData, mockTablesData } from '@/features/dashboards/data/mock-dashboard-data';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { getEnabledWidgets } = useDashboardConfig();
  const enabledWidgets = getEnabledWidgets();

  // Group widgets by type for layout
  const kpiWidgets = enabledWidgets.filter(w => w.type === 'kpi-card');
  const chartWidgets = enabledWidgets.filter(w => ['line-chart', 'bar-chart', 'pie-chart'].includes(w.type));
  const tableWidgets = enabledWidgets.filter(w => w.type === 'data-table');

  return (
    <div className="space-y-6">
      <ConfigHeader
        title="Enterprise Overview"
        description="Real-time performance and AI interaction insights."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button variant="default" size="sm" className="h-8">
                Last 24h
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                Last 7d
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                Last 30d
              </Button>
            </div>
            <Link href="/admin/configuration">
              <Button variant="outline" size="sm">
                <Settings className="size-4" />
                Configure
              </Button>
            </Link>
          </div>
        }
      />

      {enabledWidgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Settings className="size-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Widgets Selected</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Configure your dashboard by selecting widgets in the configuration page.
          </p>
          <Link href="/admin/configuration">
            <Button>
              <Settings className="size-4" />
              Go to Configuration
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          {kpiWidgets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiWidgets.map((widget) => {
                const data = mockMetricsData[widget.id];
                return data ? (
                  <DashboardMetricCard key={widget.id} data={data} />
                ) : null;
              })}
            </div>
          )}

          {/* Charts Grid */}
          {chartWidgets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartWidgets.map((widget) => {
                const data = mockChartsData[widget.id];
                return data ? (
                  <DashboardChartCard key={widget.id} data={data} />
                ) : null;
              })}
            </div>
          )}

          {/* Tables */}
          {tableWidgets.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {tableWidgets.map((widget) => {
                const data = mockTablesData[widget.id];
                return data ? (
                  <DashboardTableCard key={widget.id} data={data} />
                ) : null;
              })}
            </div>
          )}

          {/* User List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">User Overview</h2>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <UserListTable />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
