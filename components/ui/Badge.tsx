import { cn } from "@/lib/utils";

export default function Badge({
  className,
  children,
  tone = "default"
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-sky-100 text-sky-700"
  }[tone];

  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", styles, className)}>{children}</span>;
}
