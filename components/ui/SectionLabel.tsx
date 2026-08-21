import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: string | number;
  children: React.ReactNode;
}

export default function SectionLabel({ index, children, className, ...props }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center text-[var(--coda-ink-3)] font-mono text-[10px] sm:text-[12px] tracking-[0.18em] uppercase transition-colors duration-300", className)} {...props}>
      {index && (
        <>
          <span className="mr-3">[ {String(index).padStart(2, "0")} ]</span>
          <span className="mr-3">——</span>
        </>
      )}
      <span>{children}</span>
    </div>
  );
}
