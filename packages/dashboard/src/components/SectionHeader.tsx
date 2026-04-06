interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ icon: Icon, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-xl bg-accent-light flex items-center justify-center">
          <Icon className="size-6 text-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-text">{title}</h2>
          {subtitle && <p className="text-md text-light mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
