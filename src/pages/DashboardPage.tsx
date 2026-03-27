import { Cpu, Wifi, WifiOff, BatteryLow } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import LogStream from '@/components/dashboard/LogStream';
import { mockDevices } from '@/data/mockDevices';

export default function DashboardPage() {
  const online = mockDevices.filter(d => d.status === 'online').length;
  const offline = mockDevices.filter(d => d.status === 'offline').length;
  const lowBattery = mockDevices.filter(d => d.battery !== undefined && d.battery < 20).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Visão geral do hub e dispositivos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total" value={mockDevices.length} icon={Cpu} />
        <StatCard label="Online" value={online} icon={Wifi} variant="success" />
        <StatCard label="Offline" value={offline} icon={WifiOff} variant="danger" />
        <StatCard label="Low Battery" value={lowBattery} icon={BatteryLow} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Host</h3>
            <div className="space-y-2.5">
              {[
                { label: 'CPU', value: '23%', pct: 23 },
                { label: 'RAM', value: '412 MB / 1 GB', pct: 40 },
                { label: 'Disk', value: '5.2 / 32 GB', pct: 16 },
                { label: 'Temp', value: '48°C', pct: 48 },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-mono text-foreground">{m.value}</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground/20 transition-all"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">Offline</h3>
            {mockDevices.filter(d => d.status === 'offline').map(d => (
              <div key={d.id} className="flex items-center gap-2.5 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-status-offline" />
                <div>
                  <p className="text-sm text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{d.hardwareId}</p>
                </div>
              </div>
            ))}
            {offline === 0 && <p className="text-xs text-muted-foreground">All devices online</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          <LogStream />
        </div>
      </div>
    </div>
  );
}
