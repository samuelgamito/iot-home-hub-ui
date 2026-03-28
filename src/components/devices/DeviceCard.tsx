import { Wifi, Radio, Bluetooth, Globe, Lightbulb, Thermometer, Plug, Camera, ToggleRight, Gauge, Settings2 } from 'lucide-react';
import { Device } from '@/data/mockDevices';

const protocolIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Zigbee: Radio,
  Bluetooth: Bluetooth,
  Thread: Globe,
  MQTT: Globe,
};

const categoryIcons: Record<string, React.ElementType> = {
  lighting: Lightbulb,
  sensor: Gauge,
  switch: ToggleRight,
  camera: Camera,
  thermostat: Thermometer,
  plug: Plug,
};

const statusColor: Record<string, string> = {
  online: 'bg-status-online',
  offline: 'bg-status-offline',
  idle: 'bg-status-warning',
};

const statusGlow: Record<string, string> = {
  online: 'shadow-[0_0_6px_hsl(var(--status-online)/0.4)]',
  offline: '',
  idle: '',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

interface DeviceCardProps {
  device: Device;
  onConfigure?: (device: Device) => void;
}

export default function DeviceCard({ device, onConfigure }: DeviceCardProps) {
  const ProtoIcon = protocolIcons[device.protocol] || Globe;
  const CatIcon = categoryIcons[device.category] || Gauge;

  return (
    <div className="group bg-card rounded-lg border border-border p-4 hover:border-muted-foreground/20 transition-all hover:shadow-lg hover:shadow-black/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <CatIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">{device.name}</h4>
            <p className="text-xs text-muted-foreground font-mono">{device.hardwareId}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${statusColor[device.status]} ${statusGlow[device.status]}`} />
          <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ProtoIcon className="w-3 h-3" />
          <span>{device.protocol}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground/60">📍</span>
          <span>{device.room}</span>
        </div>
        <div className="font-mono">{device.rssi} dBm</div>
        <div>{timeAgo(device.lastSeen)}</div>
        {device.battery !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className={`w-4 h-1.5 rounded-full border ${device.battery < 20 ? 'border-status-offline' : 'border-border'} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${device.battery < 20 ? 'bg-status-offline' : 'bg-foreground/30'}`}
                style={{ width: `${device.battery}%` }}
              />
            </div>
            <span className={`font-mono ${device.battery < 20 ? 'text-status-offline' : ''}`}>
              {device.battery}%
            </span>
          </div>
        )}
        {device.ip && (
          <div className="font-mono">{device.ip}</div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-mono">FW {device.firmware}</span>
        <button
          onClick={() => onConfigure?.(device)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
        >
          <Settings2 className="w-3 h-3" />
          Configure
        </button>
      </div>
    </div>
  );
}
