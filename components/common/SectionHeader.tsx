interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  badge,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
      {/* Left: title + subtitle */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-slate-100 leading-tight truncate">
            {title}
          </h2>
          {badge && <span className="flex-shrink-0">{badge}</span>}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-400 leading-snug">{subtitle}</p>
        )}
      </div>

      {/* Right: action */}
      {action && (
        <div className="flex-shrink-0 flex items-center">{action}</div>
      )}
    </div>
  );
}
