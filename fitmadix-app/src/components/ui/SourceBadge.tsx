import { ShieldCheck, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

type EvidenceLevel = "high" | "moderate" | "low" | "none";

interface SourceBadgeProps {
  level: EvidenceLevel;
  sourceCount?: number;
  className?: string;
}

export function SourceBadge({ level, sourceCount = 0, className = "" }: SourceBadgeProps) {
  const getBadgeStyle = () => {
    switch (level) {
      case "high":
        return {
          bg: "bg-green-500/10",
          text: "text-green-500",
          border: "border-green-500/20",
          icon: <ShieldCheck className="w-4 h-4 mr-1.5" />,
          label: "High Evidence"
        };
      case "moderate":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          border: "border-blue-500/20",
          icon: <CheckCircle2 className="w-4 h-4 mr-1.5" />,
          label: "Moderate Evidence"
        };
      case "low":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-600 dark:text-yellow-500",
          border: "border-yellow-500/20",
          icon: <ShieldAlert className="w-4 h-4 mr-1.5" />,
          label: "Limited Evidence"
        };
      default:
        return {
          bg: "bg-slate-500/10",
          text: "text-slate-500",
          border: "border-slate-500/20",
          icon: <FileText className="w-4 h-4 mr-1.5" />,
          label: "Unverified"
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border} ${className}`}>
      {style.icon}
      {style.label}
      {sourceCount > 0 && (
        <span className="ml-2 pl-2 border-l border-current/20">
          {sourceCount} {sourceCount === 1 ? 'Source' : 'Sources'}
        </span>
      )}
    </div>
  );
}
