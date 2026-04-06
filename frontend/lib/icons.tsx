import React from "react";
import {
  Zap,
  BarChart3,
  TrendingUp,
  Lock,
  Droplets,
  Palette,
  Sprout,
  Link2,
  Vote,
  Scale3d,
  DollarSign,
  Key,
  Bot,
  Search,
  CheckCircle2,
  CheckCircle,
  CreditCard,
  FileText,
  Star,
} from "lucide-react";

type IconName =
  | "Zap" | "BarChart3" | "TrendingUp" | "Lock" | "Droplets"
  | "Palette" | "Sprout" | "Link2" | "Vote" | "Scale3d"
  | "DollarSign" | "Key" | "Bot" | "Search" | "CheckCircle2"
  | "CheckCircle" | "CreditCard" | "FileText" | "Star";

const iconMap: Record<IconName, React.ComponentType<any>> = {
  Zap,
  BarChart3,
  TrendingUp,
  Lock,
  Droplets,
  Palette,
  Sprout,
  Link2,
  Vote,
  Scale3d,
  DollarSign,
  Key,
  Bot,
  Search,
  CheckCircle2,
  CheckCircle,
  CreditCard,
  FileText,
  Star,
};

export function getIcon(iconName: string | undefined, props?: any) {
  if (!iconName || !iconMap[iconName as IconName]) {
    return null;
  }
  const IconComponent = iconMap[iconName as IconName];
  return <IconComponent {...props} />;
}

export function renderIcon(iconName: string | undefined, size = 24) {
  return getIcon(iconName, { size, strokeWidth: 2 });
}
