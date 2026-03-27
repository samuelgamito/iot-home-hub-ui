import { useState } from 'react';
import { Plus, Zap, Clock } from 'lucide-react';
import { mockAutomations, AutomationRule } from '@/data/mockDevices';
import NewRuleModal from '@/components/automation/NewRuleModal';

function timeAgo(dateStr?: string) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>(mockAutomations);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const addRule = (data: { name: string; trigger: string; action: string }) => {
    const newRule: AutomationRule = {
      id: String(Date.now()),
      name: data.name,
      enabled: true,
      trigger: data.trigger,
      action: data.action,
    };
    setRules(prev => [newRule, ...prev]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Automation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Local automation rules</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Rule
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-card rounded-lg border border-border p-4 transition-opacity ${!rule.enabled ? 'opacity-40' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">{rule.name}</h3>
              </div>
              <button
                onClick={() => toggleRule(rule.id)}
                className={`relative w-8 h-4 rounded-full transition-colors ${rule.enabled ? 'bg-status-online' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-foreground transition-transform ${rule.enabled ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block mb-1">IF</span>
                <span className="text-foreground font-mono bg-muted px-2 py-1 rounded">{rule.trigger}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">THEN</span>
                <span className="text-foreground font-mono bg-muted px-2 py-1 rounded">{rule.action}</span>
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(rule.lastTriggered)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewRuleModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addRule} />
    </div>
  );
}
