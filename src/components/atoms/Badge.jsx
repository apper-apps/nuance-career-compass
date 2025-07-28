import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary border border-secondary/20",
    accent: "bg-gradient-to-r from-accent/10 to-accent/5 text-accent border border-accent/20",
    success: "bg-gradient-to-r from-success/10 to-success/5 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-warning/5 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-error/5 text-error border border-error/20",
    applied: "bg-gradient-to-r from-blue-50 to-blue-25 text-blue-700 border border-blue-200",
    reviewing: "bg-gradient-to-r from-yellow-50 to-yellow-25 text-yellow-700 border border-yellow-200",
    interview: "bg-gradient-to-r from-purple-50 to-purple-25 text-purple-700 border border-purple-200",
    rejected: "bg-gradient-to-r from-red-50 to-red-25 text-red-700 border border-red-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;