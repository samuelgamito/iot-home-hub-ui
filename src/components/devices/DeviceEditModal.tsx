import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Device } from '@/data/mockDevices';

interface DeviceEditModalProps {
  device: Device | null;
  onClose: () => void;
  onSave: (updated: Device) => void;
  onRemove: (id: string) => void;
}

const rooms = ['Sala', 'Quarto', 'Cozinha', 'Garagem', 'Entrada', 'Escritório', 'Banheiro', 'Varanda'];
const categories: Device['category'][] = ['lighting', 'sensor', 'switch', 'camera', 'thermostat', 'plug'];

export default function DeviceEditModal({ device, onClose, onSave, onRemove }: DeviceEditModalProps) {
  const [name, setName] = useState(device?.name || '');
  const [room, setRoom] = useState(device?.room || '');
  const [category, setCategory] = useState<Device['category']>(device?.category || 'sensor');
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (!device) return null;

  const handleSave = () => {
    onSave({ ...device, name: name.trim() || device.name, room, category });
    onClose();
  };

  const handleRemove = () => {
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }
    onRemove(device.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-medium text-foreground">Configure Device</h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{device.hardwareId}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Nome</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
            />
          </div>

          {/* Room */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Cômodo</label>
            <select
              value={room}
              onChange={e => setRoom(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-ring appearance-none"
            >
              {rooms.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Categoria</label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-2 py-2 rounded-lg border text-xs capitalize transition-all ${
                    category === c
                      ? 'border-foreground/20 bg-accent text-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Read-only info */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Protocol</span>
              <span className="text-foreground font-mono">{device.protocol}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">RSSI</span>
              <span className="text-foreground font-mono">{device.rssi} dBm</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Firmware</span>
              <span className="text-foreground font-mono">{device.firmware}</span>
            </div>
            {device.ip && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">IP</span>
                <span className="text-foreground font-mono">{device.ip}</span>
              </div>
            )}
            {device.battery !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Battery</span>
                <span className={`font-mono ${device.battery < 20 ? 'text-status-offline' : 'text-foreground'}`}>{device.battery}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <button
            onClick={handleRemove}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all ${
              confirmRemove
                ? 'bg-destructive text-destructive-foreground'
                : 'text-muted-foreground hover:text-status-offline'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {confirmRemove ? 'Confirmar remoção' : 'Remover'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
