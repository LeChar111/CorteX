interface BigStatProps {
  icon: React.ElementType;
  value: number | string;
  label: string;
}

export function BigStat({ icon: _Icon, value, label }: BigStatProps) {
  return (
    <div className="flex items-center gap-2">
      {/* <Icon className="w-4 h-4 text-muted" /> */}
      <span className="text-6xl font-black text-text tracking-tight">{value}</span>
      <span className="text-xl text-black self-end mb-1">{label}</span>
    </div>
  );
}
