import { useState } from 'react';
import { Server, HardDrive, Wifi, Shield, Database, Clock, ExternalLink, Plus, X, Tag, Home } from 'lucide-react';
import LogStream from '@/components/dashboard/LogStream';
import { toast } from 'sonner';

const systemInfo = [
  { label: 'Hostname', value: 'edgehub-rpi4', icon: Server },
  { label: 'OS', value: 'RPi OS Lite (64-bit)', icon: HardDrive },
  { label: 'IP', value: '192.168.1.50', icon: Wifi },
  { label: 'Uptime', value: '12d 4h 32m', icon: Clock },
  { label: 'MQTT', value: 'v2.0.18 — running', icon: Database },
  { label: 'Firewall', value: 'Active — 3 rules', icon: Shield },
];

const defaultCategories = ['lighting', 'sensor', 'switch', 'camera', 'thermostat', 'plug'];
const defaultRooms = ['Sala', 'Quarto', 'Cozinha', 'Garagem', 'Entrada', 'Escritório', 'Banheiro'];

type SettingsTab = 'system' | 'config';

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('system');
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [rooms, setRooms] = useState<string[]>(defaultRooms);
  const [newCategory, setNewCategory] = useState('');
  const [newRoom, setNewRoom] = useState('');

  const addCategory = () => {
    const val = newCategory.trim().toLowerCase();
    if (!val) return;
    if (categories.includes(val)) { toast.error('Categoria já existe'); return; }
    setCategories(prev => [...prev, val]);
    setNewCategory('');
    toast.success(`Categoria "${val}" adicionada`);
  };

  const removeCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
    toast.success(`Categoria "${cat}" removida`);
  };

  const addRoom = () => {
    const val = newRoom.trim();
    if (!val) return;
    if (rooms.includes(val)) { toast.error('Cômodo já existe'); return; }
    setRooms(prev => [...prev, val]);
    setNewRoom('');
    toast.success(`Cômodo "${val}" adicionado`);
  };

  const removeRoom = (room: string) => {
    setRooms(prev => prev.filter(r => r !== room));
    toast.success(`Cômodo "${room}" removido`);
  };

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: 'system', label: 'Sistema' },
    { key: 'config', label: 'Configurações' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-medium text-foreground">System</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Host configuration & diagnostics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-px bg-muted rounded-lg p-0.5 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t.key ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'system' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-medium text-foreground">System Info</h3>
              </div>
              <div className="p-4 space-y-0">
                {systemInfo.map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                        <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-mono text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Data Retention</h3>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Edit <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="p-4 space-y-0">
                {[
                  { label: 'System logs', value: '7 days' },
                  { label: 'Sensor data', value: '30 days' },
                  { label: 'Automation events', value: '90 days' },
                  { label: 'Auto backup', value: 'Daily 03:00' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-mono text-foreground bg-muted px-2.5 py-1 rounded-md">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <LogStream />
        </>
      )}

      {tab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Categories */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">Categorias</h3>
              <span className="text-xs text-muted-foreground ml-auto">{categories.length}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCategory()}
                  placeholder="Nova categoria..."
                  className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
                />
                <button
                  onClick={addCategory}
                  disabled={!newCategory.trim()}
                  className="px-3 py-2 rounded-lg bg-accent text-foreground text-sm hover:bg-accent/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-xs text-foreground font-mono group"
                  >
                    {cat}
                    <button
                      onClick={() => removeCategory(cat)}
                      className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Home className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">Cômodos</h3>
              <span className="text-xs text-muted-foreground ml-auto">{rooms.length}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  value={newRoom}
                  onChange={e => setNewRoom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRoom()}
                  placeholder="Novo cômodo..."
                  className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring"
                />
                <button
                  onClick={addRoom}
                  disabled={!newRoom.trim()}
                  className="px-3 py-2 rounded-lg bg-accent text-foreground text-sm hover:bg-accent/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {rooms.map(room => (
                  <span
                    key={room}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-xs text-foreground font-mono group"
                  >
                    {room}
                    <button
                      onClick={() => removeRoom(room)}
                      className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
