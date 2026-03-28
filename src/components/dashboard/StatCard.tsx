import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

const variantBg = {
  default: 'bg-card',
  success: 'bg-card',
  danger: 'bg-card',
  warning: 'bg-card',
};

const variantAccent = {
  default: 'text-foreground',
  success: 'text-status-online',
  danger: 'text-status-offline',
  warning: 'text-status-warning',
};

const variantIconBg = {
  default: 'bg-muted',
  success: 'bg-status-online/10',
  danger: 'bg-status-offline/10',
  warning: 'bg-status-warning/10',
};

export default function StatCard({ label, value, icon: Icon, variant = 'default' }: StatCardProps) {
  return (
    <div className={`${variantBg[variant]} rounded-lg border border-border p-4 hover:border-muted-foreground/15 transition-colors`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`w-7 h-7 rounded-md ${variantIconBg[variant]} flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${variantAccent[variant]}`} />
        </div>
      </div>
      <p className={`text-2xl font-medium font-mono ${variantAccent[variant]}`}>{value}</p>
    </div>
  );
}
