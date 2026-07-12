import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  TruckIcon,
  UsersIcon,
  MapPinIcon,
  WrenchIcon,
  FuelIcon,
  DollarSignIcon,
  BarChart3Icon,
  HomeIcon,
  SettingsIcon,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  {
    title: "Dashboard",
    icon: HomeIcon,
    to: "/dashboard",
    roles: ["FleetManager", "Dispatcher", "SafetyOfficer", "FinancialAnalyst"],
  },
  {
    title: "Vehicles",
    icon: TruckIcon,
    to: "/dashboard/vehicles",
    roles: ["FleetManager"],
  },
  {
    title: "Drivers",
    icon: UsersIcon,
    to: "/dashboard/drivers",
    roles: ["FleetManager", "SafetyOfficer", "Dispatcher"],
  },
  {
    title: "Trips",
    icon: MapPinIcon,
    to: "/dashboard/trips",
    roles: ["Dispatcher", "FleetManager"],
  },
  {
    title: "Maintenance",
    icon: WrenchIcon,
    to: "/dashboard/maintenance",
    roles: ["FleetManager"],
  },
  {
    title: "Fuel & Expenses",
    icon: DollarSignIcon,
    to: "/dashboard/fuel",
    roles: ["FleetManager", "FinancialAnalyst"],
  },
  {
    title: "Analytics",
    icon: BarChart3Icon,
    to: "/dashboard/analytics",
    roles: ["FleetManager", "FinancialAnalyst"],
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    to: "/dashboard/settings",
    roles: ["FleetManager", "Dispatcher", "SafetyOfficer", "FinancialAnalyst"],
  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <TruckIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            TransitOps
          </h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
