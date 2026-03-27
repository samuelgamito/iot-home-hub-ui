import { Wifi, Radio, Bluetooth, Globe, Lightbulb, Thermometer, Plug, Camera, ToggleRight, Gauge } from 'lucide-react';
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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function DeviceCard({ device }: { device: Device }) {
  const ProtoIcon = protocolIcons[device.protocol] || Globe;
  const CatIcon = categoryIcons[device.category] || Gauge;

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-muted-foreground/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
            <CatIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">{device.name}</h4>
            <p className="text-xs text-muted-foreground font-mono">{device.hardwareId}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusColor[device.status]}`} />
          <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ProtoIcon className="w-3 h-3" />
          <span>{device.protocol}</span>
        </div>
        <div>{device.room}</div>
        <div className="font-mono">{device.rssi} dBm</div>
        <div>{timeAgo(device.lastSeen)}</div>
        {device.battery !== undefined && (
          <div className={`font-mono ${device.battery < 20 ? 'text-status-offline' : ''}`}>
            {device.battery}%
          </div>
        )}
        {device.ip && (
          <div className="font-mono">{device.ip}</div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-mono">FW {device.firmware}</span>
        <button className="text-foreground hover:text-muted-foreground transition-colors">Configure →</button>
      </div>
    </div>
  );
}
