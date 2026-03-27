import { useState, useEffect, useCallback } from 'react';
import { X, Wifi, Radio, Bluetooth, Globe, Loader2 } from 'lucide-react';

interface DiscoveredDevice {
  id: string;
  name: string;
  hardwareId: string;
  protocol: string;
  rssi: number;
  ip?: string;
}

const protocolIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Zigbee: Radio,
  Bluetooth: Bluetooth,
  mDNS: Globe,
};

const mockDiscovered: DiscoveredDevice[] = [
  { id: 'd1', name: 'Unknown ESP Device', hardwareId: 'ESP32-FF91A2', protocol: 'WiFi', rssi: -52, ip: '192.168.1.142' },
  { id: 'd2', name: 'Zigbee Motion Sensor', hardwareId: 'ZB-MOT-012', protocol: 'Zigbee', rssi: -68 },
  { id: 'd3', name: 'BLE Beacon', hardwareId: 'BLE-BCN-044', protocol: 'Bluetooth', rssi: -74 },
];

interface ScanModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ScanModal({ open, onClose }: ScanModalProps) {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [devices, setDevices] = useState<DiscoveredDevice[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(['WiFi', 'Zigbee', 'Bluetooth', 'mDNS']);

  const reset = useCallback(() => {
    setPhase('idle');
    setDevices([]);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const toggleProtocol = (p: string) => {
    setSelectedProtocols(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const startScan = () => {
    setPhase('scanning');
    setDevices([]);
    setProgress(0);

    const duration = 3000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min((elapsed / duration) * 100, 100));

      // Simulate device discovery at intervals
      if (elapsed === 1000) {
        setDevices(prev => [...prev, mockDiscovered[0]]);
      }
      if (elapsed === 1800) {
        setDevices(prev => [...prev, mockDiscovered[1]]);
      }
      if (elapsed === 2500) {
        setDevices(prev => [...prev, mockDiscovered[2]]);
      }

      if (elapsed >= duration) {
        clearInterval(timer);
        setPhase('done');
      }
    }, interval);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg w-full max-w-lg mx-4 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-medium text-foreground">Network Scan</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Protocol selection */}
        {phase === 'idle' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Scan protocols</label>
              <div className="flex gap-2">
                {Object.entries(protocolIcons).map(([name, Icon]) => (
                  <button
                    key={name}
                    onClick={() => toggleProtocol(name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors ${
                      selectedProtocols.includes(name)
                        ? 'border-foreground/30 bg-accent text-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Scans local network for unconfigured devices via mDNS, SSDP, and protocol-specific discovery.
            </p>

            <div className="flex justify-end">
              <button
                onClick={startScan}
                disabled={selectedProtocols.length === 0}
                className="px-3 py-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-30"
              >
                Start Scan
              </button>
            </div>
          </div>
        )}

        {/* Scanning */}
        {(phase === 'scanning' || phase === 'done') && (
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {phase === 'scanning' && <Loader2 className="w-3 h-3 animate-spin" />}
                  {phase === 'scanning' ? 'Scanning...' : 'Scan complete'}
                </span>
                <span className="text-muted-foreground font-mono">{devices.length} found</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground/30 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Discovered devices */}
            <div className="space-y-1">
              {devices.map(device => {
                const Icon = protocolIcons[device.protocol] || Globe;
                return (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">{device.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {device.hardwareId}{device.ip ? ` · ${device.ip}` : ''} · {device.rssi} dBm
                        </p>
                      </div>
                    </div>
                    <button className="text-xs text-foreground hover:text-muted-foreground transition-colors px-2 py-1 rounded border border-border">
                      Add
                    </button>
                  </div>
                );
              })}
              {devices.length === 0 && phase === 'scanning' && (
                <p className="text-xs text-muted-foreground text-center py-4">Listening for devices...</p>
              )}
            </div>

            {/* Footer */}
            {phase === 'done' && (
              <div className="flex justify-between">
                <button
                  onClick={reset}
                  className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Scan Again
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
