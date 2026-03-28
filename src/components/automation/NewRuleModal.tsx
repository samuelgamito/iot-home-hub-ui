import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { mockDevices } from '@/data/mockDevices';

interface NewRuleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (rule: { name: string; trigger: string; action: string }) => void;
}

const triggerTypes = [
  { label: 'Schedule', prefix: 'Horário = ' },
  { label: 'Sensor', prefix: '' },
  { label: 'Device', prefix: '' },
  { label: 'Power', prefix: '' },
];

const actionTypes = [
  'Turn on',
  'Turn off',
  'Set brightness',
  'Notify',
  'Notify + Turn off',
];

export default function NewRuleModal({ open, onClose, onSave }: NewRuleModalProps) {
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState(triggerTypes[0].label);
  const [triggerValue, setTriggerValue] = useState('');
  const [targetDevice, setTargetDevice] = useState(mockDevices[0]?.name || '');
  const [action, setAction] = useState(actionTypes[0]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim() || !triggerValue.trim()) return;
    const prefix = triggerTypes.find(t => t.label === triggerType)?.prefix || '';
    onSave({
      name: name.trim(),
      trigger: `${prefix}${triggerValue}`,
      action: `${action} ${targetDevice}`,
    });
    setName('');
    setTriggerValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-status-warning/10 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-status-warning" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground">New Rule</h2>
              <p className="text-xs text-muted-foreground">Create a local automation</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Night mode"
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
            />
          </div>

          {/* Trigger type */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Trigger type</label>
            <div className="grid grid-cols-4 gap-1.5">
              {triggerTypes.map(t => (
                <button
                  key={t.label}
                  onClick={() => setTriggerType(t.label)}
                  className={`px-2 py-2 rounded-lg border text-xs transition-all ${
                    triggerType === t.label ? 'border-foreground/20 bg-accent text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Condition</label>
            <input
              value={triggerValue}
              onChange={e => setTriggerValue(e.target.value)}
              placeholder={triggerType === 'Schedule' ? '23:00' : 'Temperature > 30°C'}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-ring"
            />
          </div>

          {/* Target device */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Target device</label>
            <select
              value={targetDevice}
              onChange={e => setTargetDevice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-ring appearance-none"
            >
              {mockDevices.map(d => (
                <option key={d.id} value={d.name}>{d.name} — {d.hardwareId}</option>
              ))}
            </select>
          </div>

          {/* Action */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Action</label>
            <select
              value={action}
              onChange={e => setAction(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:border-ring appearance-none"
            >
              {actionTypes.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !triggerValue.trim()}
            className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Create Rule
          </button>
        </div>
      </div>
    </div>
  );
}
