import { mockLogs } from '@/data/mockDevices';

const levelColors = {
  info: 'text-muted-foreground',
  warn: 'text-status-warning',
  error: 'text-status-offline',
};

export default function LogStream() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Logs</h3>
        <div className="w-1.5 h-1.5 rounded-full bg-status-online" />
      </div>
      <div className="p-2 max-h-[280px] overflow-y-auto scrollbar-thin space-y-px">
        {mockLogs.map((log, i) => (
          <div key={i} className="flex gap-2 text-xs font-mono py-1 px-2 rounded hover:bg-muted/50">
            <span className="text-muted-foreground w-14 flex-shrink-0">{log.ts}</span>
            <span className={`w-10 flex-shrink-0 uppercase ${levelColors[log.level]}`}>
              {log.level}
            </span>
            <span className="text-muted-foreground w-16 flex-shrink-0">{log.source}</span>
            <span className="text-foreground/70">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
