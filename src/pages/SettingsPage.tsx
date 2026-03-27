import { Server, HardDrive, Wifi, Shield, Database, Clock } from 'lucide-react';
import LogStream from '@/components/dashboard/LogStream';

const systemInfo = [
  { label: 'Hostname', value: 'edgehub-rpi4', icon: Server },
  { label: 'OS', value: 'RPi OS Lite (64-bit)', icon: HardDrive },
  { label: 'IP', value: '192.168.1.50', icon: Wifi },
  { label: 'Uptime', value: '12d 4h 32m', icon: Clock },
  { label: 'MQTT', value: 'v2.0.18 — running', icon: Database },
  { label: 'Firewall', value: 'Active — 3 rules', icon: Shield },
];

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-medium text-foreground">System</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Host configuration & diagnostics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">System Info</h3>
          <div className="space-y-2">
            {systemInfo.map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-mono text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Data Retention</h3>
          <div className="space-y-3">
            {[
              { label: 'System logs', value: '7 days' },
              { label: 'Sensor data', value: '30 days' },
              { label: 'Automation events', value: '90 days' },
              { label: 'Auto backup', value: 'Daily 03:00' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LogStream />
    </div>
  );
}
