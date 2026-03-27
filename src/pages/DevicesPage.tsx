import { useState } from 'react';
import { Search, ScanLine } from 'lucide-react';
import DeviceCard from '@/components/devices/DeviceCard';
import ScanModal from '@/components/devices/ScanModal';
import { mockDevices, DeviceProtocol, DeviceStatus } from '@/data/mockDevices';

const protocols: (DeviceProtocol | 'All')[] = ['All', 'WiFi', 'Zigbee', 'Bluetooth', 'Thread', 'MQTT'];
const statuses: (DeviceStatus | 'all')[] = ['all', 'online', 'offline', 'idle'];

export default function DevicesPage() {
  const [search, setSearch] = useState('');
  const [protocol, setProtocol] = useState<DeviceProtocol | 'All'>('All');
  const [status, setStatus] = useState<DeviceStatus | 'all'>('all');
  const [scanOpen, setScanOpen] = useState(false);

  const filtered = mockDevices.filter(d => {
    if (protocol !== 'All' && d.protocol !== protocol) return false;
    if (status !== 'all' && d.status !== status) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.hardwareId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Devices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{mockDevices.length} registered</p>
        </div>
        <button
          onClick={() => setScanOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <ScanLine className="w-3.5 h-3.5" />
          Scan
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
          />
        </div>
        <div className="flex gap-px bg-muted rounded-md p-0.5">
          {protocols.map(p => (
            <button
              key={p}
              onClick={() => setProtocol(p)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                protocol === p ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-px bg-muted rounded-md p-0.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                status === s ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(d => <DeviceCard key={d.id} device={d} />)}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12 text-sm">No devices found.</p>
      )}

      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} />
    </div>
  );
}
