"use client";

import {
  Activity,
  Archive,
  Bell,
  BookOpenText,
  Building2,
  ChevronDown,
  Columns3,
  FileText,
  Gauge,
  HardDrive,
  HelpCircle,
  LifeBuoy,
  Network,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react";
import { customers, dueSoonHardware, incompleteCustomers, overdueHardware } from "@/lib/demo-data";

export type AppView =
  | "dashboard"
  | "customers"
  | "hardware"
  | "contracts"
  | "internet"
  | "files"
  | "documentation"
  | "reports"
  | "users"
  | "activity"
  | "settings";

export type CustomerScope = "all" | "attention" | "hardware-due" | string;

type NavItem = {
  id: AppView;
  label: string;
  icon: React.ElementType;
  count?: number;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "customers", label: "Customers", icon: Building2 },
  { id: "hardware", label: "Hardware", icon: HardDrive, count: overdueHardware.length + dueSoonHardware.length },
  { id: "contracts", label: "Contracts", icon: FileText, count: 2 },
  { id: "internet", label: "Internet Services", icon: Network },
  { id: "files", label: "Files", icon: Archive },
  { id: "documentation", label: "Documentation", icon: BookOpenText, count: incompleteCustomers.length },
  { id: "reports", label: "Reports", icon: Columns3 }
];

const adminItems: NavItem[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings }
];

const supportItems = [
  { label: "Support", icon: LifeBuoy },
  { label: "Docs", icon: HelpCircle },
  { label: "Security", icon: ShieldCheck }
];

export function AppShell({
  activeView,
  customerScope,
  onCustomerScopeChange,
  onSupportAction,
  onViewChange,
  children
}: {
  activeView: AppView;
  customerScope: CustomerScope;
  onCustomerScopeChange: (scope: CustomerScope) => void;
  onSupportAction: (label: string) => void;
  onViewChange: (view: AppView) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="primary-sidebar">
        <button className="brand button-reset" onClick={() => onViewChange("dashboard")}>
          <span className="brand-mark">MD</span>
          <span>MSP Docs</span>
        </button>

        <nav className="nav-section" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon size={21} />
              <span>{item.label}</span>
              {item.count ? <span className="badge">{item.count}</span> : null}
            </button>
          ))}
        </nav>

        <nav className="nav-section" aria-label="Admin navigation">
          {adminItems.map((item) => (
            <button
              className={`nav-item ${activeView === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon size={21} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav-spacer" />

        <nav className="nav-section" aria-label="Support navigation">
          {supportItems.map((item) => (
            <button className="nav-item" key={item.label} onClick={() => onSupportAction(item.label)}>
              <item.icon size={21} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="user-card button-reset" onClick={() => onViewChange("settings")}>
          <span className="avatar">AS</span>
          <span>
            <span className="record-title">Aaron Satko</span>
            <span className="record-meta">Admin</span>
          </span>
          <ChevronDown size={18} style={{ marginLeft: "auto" }} />
        </button>
      </aside>

      <aside className="secondary-sidebar">
        <h2 className="sidebar-title">Customers</h2>
        <button
          className={`group-item ${customerScope === "all" ? "active" : ""}`}
          onClick={() => onCustomerScopeChange("all")}
        >
          <Archive size={21} />
          <span>All customers</span>
          <span className="badge">{customers.length}</span>
        </button>
        <button
          className={`group-item ${customerScope === "attention" ? "active" : ""}`}
          onClick={() => onCustomerScopeChange("attention")}
        >
          <Bell size={21} />
          <span>Needs attention</span>
          <span className="badge">{incompleteCustomers.length}</span>
        </button>
        <button
          className={`group-item ${customerScope === "hardware-due" ? "active" : ""}`}
          onClick={() => onCustomerScopeChange("hardware-due")}
        >
          <HardDrive size={21} />
          <span>Hardware due</span>
          <span className="badge">{dueSoonHardware.length + overdueHardware.length}</span>
        </button>

        <div className="section-label">Customer groups</div>
        {customers.map((customer) => (
          <button
            className={`group-item ${customerScope === customer.id ? "active" : ""}`}
            key={customer.id}
            onClick={() => onCustomerScopeChange(customer.id)}
          >
            <Building2 size={21} />
            <span>{customer.name}</span>
            <span className="badge">{customer.locationCount}</span>
          </button>
        ))}
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

