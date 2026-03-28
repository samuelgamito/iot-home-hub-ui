import { useState, useEffect, useCallback } from 'react';
import { X, Wifi, Radio, Bluetooth, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(['WiFi', 'Zigbee', 'Bluetooth', 'mDNS']);

  const reset = useCallback(() => {
    setPhase('idle');
    setDevices([]);
    setProgress(0);
    setAddedIds(new Set());
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const toggleProtocol = (p: string) => {
    setSelectedProtocols(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleAdd = (device: DiscoveredDevice) => {
    setAddedIds(prev => new Set(prev).add(device.id));
    toast.success(`${device.name} adicionado`, {
      description: `${device.hardwareId} · ${device.protocol}`,
    });
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

      if (elapsed === 1000) setDevices(prev => [...prev, mockDiscovered[0]]);
      if (elapsed === 1800) setDevices(prev => [...prev, mockDiscovered[1]]);
      if (elapsed === 2500) setDevices(prev => [...prev, mockDiscovered[2]]);

      if (elapsed >= duration) {
        clearInterval(timer);
        setPhase('done');
      }
    }, interval);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg w-full max-w-lg mx-4 overflow-hidden shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
              <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground">Network Scan</h2>
              <p className="text-xs text-muted-foreground">Discover unconfigured devices</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Protocol selection */}
          {phase === 'idle' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs text-muted-foreground block mb-2.5">Protocolos</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(protocolIcons).map(([name, Icon]) => (
                    <button
                      key={name}
                      onClick={() => toggleProtocol(name)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border text-xs transition-all ${
                        selectedProtocols.includes(name)
                          ? 'border-foreground/20 bg-accent text-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Scans local network via mDNS, SSDP, and protocol-specific discovery for unconfigured devices.
              </p>

              <button
                onClick={startScan}
                disabled={selectedProtocols.length === 0}
                className="w-full py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-30"
              >
                Start Scan
              </button>
            </div>
          )}

          {/* Scanning / Done */}
          {(phase === 'scanning' || phase === 'done') && (
            <div className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    {phase === 'scanning' && <Loader2 className="w-3 h-3 animate-spin" />}
                    {phase === 'scanning' ? 'Scanning...' : (
                      <span className="flex items-center gap-1.5 text-status-online">
                        <CheckCircle2 className="w-3 h-3" /> Scan complete
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground font-mono">{devices.length} found</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-100 ${phase === 'done' ? 'bg-status-online/50' : 'bg-foreground/30'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Discovered devices */}
              <div className="space-y-2">
                {devices.map(device => {
                  const Icon = protocolIcons[device.protocol] || Globe;
                  const isAdded = addedIds.has(device.id);
                  return (
                    <div
                      key={device.id}
                      className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                        isAdded ? 'bg-status-online/5 border-status-online/20' : 'bg-muted/30 border-border hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{device.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {device.hardwareId}{device.ip ? ` · ${device.ip}` : ''} · {device.rssi} dBm
                          </p>
                        </div>
                      </div>
                      {isAdded ? (
                        <span className="text-xs text-status-online flex items-center gap-1 px-2.5 py-1.5">
                          <CheckCircle2 className="w-3 h-3" /> Adicionado
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAdd(device)}
                          className="text-xs text-foreground hover:text-muted-foreground transition-colors px-2.5 py-1.5 rounded-md border border-border hover:bg-muted"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
                {devices.length === 0 && phase === 'scanning' && (
                  <div className="text-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Listening for devices...</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {phase === 'done' && (
                <div className="flex justify-between pt-2 border-t border-border">
                  <button
                    onClick={reset}
                    className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Scan Again
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
