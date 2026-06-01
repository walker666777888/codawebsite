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
    <div className={cn("flex items-center text-[#4D4A45] font-mono text-[10px] sm:text-[12px] tracking-[0.18em] uppercase", className)} {...props}>
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
