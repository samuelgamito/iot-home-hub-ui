import { useState } from 'react';
import { Search, ScanLine } from 'lucide-react';
import DeviceCard from '@/components/devices/DeviceCard';
import DeviceEditModal from '@/components/devices/DeviceEditModal';
import ScanModal from '@/components/devices/ScanModal';
import { mockDevices, Device, DeviceProtocol, DeviceStatus } from '@/data/mockDevices';
import { toast } from 'sonner';

const protocols: (DeviceProtocol | 'All')[] = ['All', 'WiFi', 'Zigbee', 'Bluetooth', 'Thread', 'MQTT'];
const statuses: (DeviceStatus | 'all')[] = ['all', 'online', 'offline', 'idle'];

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [search, setSearch] = useState('');
  const [protocol, setProtocol] = useState<DeviceProtocol | 'All'>('All');
  const [status, setStatus] = useState<DeviceStatus | 'all'>('all');
  const [scanOpen, setScanOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);

  const filtered = devices.filter(d => {
    if (protocol !== 'All' && d.protocol !== protocol) return false;
    if (status !== 'all' && d.status !== status) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.hardwareId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSave = (updated: Device) => {
    setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
    toast.success(`${updated.name} atualizado`);
  };

  const handleRemove = (id: string) => {
    const device = devices.find(d => d.id === id);
    setDevices(prev => prev.filter(d => d.id !== id));
    toast.success(`${device?.name || 'Device'} removido`);
  };

  const online = devices.filter(d => d.status === 'online').length;
  const offline = devices.filter(d => d.status === 'offline').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Devices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {devices.length} registered · <span className="text-status-online">{online} online</span> · <span className="text-status-offline">{offline} offline</span>
          </p>
        </div>
        <button
          onClick={() => setScanOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <ScanLine className="w-3.5 h-3.5" />
          Scan
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
          />
        </div>
        <div className="flex gap-px bg-muted rounded-lg p-0.5">
          {protocols.map(p => (
            <button
              key={p}
              onClick={() => setProtocol(p)}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                protocol === p ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-px bg-muted rounded-lg p-0.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-2.5 py-1.5 rounded-md text-xs capitalize transition-colors ${
                status === s ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(d => (
          <DeviceCard key={d.id} device={d} onConfigure={setEditDevice} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">No devices found.</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or run a network scan.</p>
        </div>
      )}

      <ScanModal open={scanOpen} onClose={() => setScanOpen(false)} />
      <DeviceEditModal
        device={editDevice}
        onClose={() => setEditDevice(null)}
        onSave={handleSave}
        onRemove={handleRemove}
      />
    </div>
  );
}
