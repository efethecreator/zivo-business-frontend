import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "pending" | "confirmed" | "cancelled" | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

// Enhance the status badge with subtle animations
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusLower = status?.toLowerCase() || "";

  let variant: "pending" | "confirmed" | "cancelled" | "default" = "default";
  let label = status;

  if (statusLower === "pending") {
    variant = "pending";
    label = "Pending";
  } else if (
    statusLower === "confirmed" ||
    statusLower === "completed" ||
    statusLower === "approved"
  ) {
    variant = "confirmed";
    label =
      statusLower === "confirmed"
        ? "Confirmed"
        : statusLower === "completed"
        ? "Completed"
        : "Approved";
  } else if (
    statusLower === "cancelled" ||
    statusLower === "rejected" ||
    statusLower === "declined"
  ) {
    variant = "cancelled";
    label =
      statusLower === "cancelled"
        ? "Cancelled"
        : statusLower === "rejected"
        ? "Rejected"
        : "Declined";
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <Badge
      variant={variant}
      className={cn(
        "font-medium px-3 py-1",
        className,
        `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 ${getStatusColor(
          statusLower
        )}`
      )}
    >
      {label}
    </Badge>
  );
}
