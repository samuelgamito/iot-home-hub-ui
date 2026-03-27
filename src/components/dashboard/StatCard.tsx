import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

const variantStyles = {
  default: 'text-foreground',
  success: 'text-status-online',
  danger: 'text-status-offline',
  warning: 'text-status-warning',
};

export default function StatCard({ label, value, icon: Icon, variant = 'default' }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <p className={`text-xl font-medium font-mono ${variantStyles[variant]}`}>{value}</p>
    </div>
  );
}
