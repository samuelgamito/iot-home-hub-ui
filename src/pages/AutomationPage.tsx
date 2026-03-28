import { useState } from 'react';
import { Plus, Zap, Clock, Trash2 } from 'lucide-react';
import { mockAutomations, AutomationRule } from '@/data/mockDevices';
import NewRuleModal from '@/components/automation/NewRuleModal';
import { toast } from 'sonner';

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

  const removeRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    setRules(prev => prev.filter(r => r.id !== id));
    toast.success(`"${rule?.name}" removida`);
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
    toast.success(`"${data.name}" criada`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-foreground">Automation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{rules.length} rules · {rules.filter(r => r.enabled).length} active</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Rule
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`group bg-card rounded-lg border border-border p-4 transition-all hover:border-muted-foreground/15 ${!rule.enabled ? 'opacity-40' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                  <Zap className={`w-3.5 h-3.5 ${rule.enabled ? 'text-status-warning' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="text-sm font-medium text-foreground">{rule.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeRule(rule.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-status-offline transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${rule.enabled ? 'bg-status-online' : 'bg-muted'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${rule.enabled ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <span className="text-muted-foreground block mb-1.5">IF</span>
                <span className="text-foreground font-mono bg-muted px-2.5 py-1.5 rounded-md inline-block">{rule.trigger}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1.5">THEN</span>
                <span className="text-foreground font-mono bg-muted px-2.5 py-1.5 rounded-md inline-block">{rule.action}</span>
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(rule.lastTriggered)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-16">
          <Zap className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No automation rules yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first rule to automate device behavior.</p>
        </div>
      )}

      <NewRuleModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addRule} />
    </div>
  );
}
