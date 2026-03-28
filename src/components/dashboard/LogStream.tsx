import { mockLogs } from '@/data/mockDevices';

const levelColors = {
  info: 'text-muted-foreground',
  warn: 'text-status-warning',
  error: 'text-status-offline',
};

const levelBadge = {
  info: 'bg-muted',
  warn: 'bg-status-warning/10',
  error: 'bg-status-offline/10',
};

export default function LogStream() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Logs</h3>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-status-online animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="p-1.5 max-h-[320px] overflow-y-auto scrollbar-thin space-y-px">
        {mockLogs.map((log, i) => (
          <div key={i} className="flex gap-2 text-xs font-mono py-1.5 px-2.5 rounded-md hover:bg-muted/50 transition-colors">
            <span className="text-muted-foreground/60 w-14 flex-shrink-0">{log.ts}</span>
            <span className={`w-12 flex-shrink-0 uppercase px-1 rounded text-center ${levelColors[log.level]} ${levelBadge[log.level]}`}>
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
