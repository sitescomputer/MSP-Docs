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

const navItems = [
  { label: "Dashboard", icon: Gauge, active: true },
  { label: "Customers", icon: Building2 },
  { label: "Hardware", icon: HardDrive, count: overdueHardware.length + dueSoonHardware.length },
  { label: "Contracts", icon: FileText, count: 2 },
  { label: "Internet Services", icon: Network },
  { label: "Files", icon: Archive },
  { label: "Documentation", icon: BookOpenText, count: incompleteCustomers.length },
  { label: "Reports", icon: Columns3 }
];

const adminItems = [
  { label: "Users", icon: Users },
  { label: "Activity", icon: Activity },
  { label: "Settings", icon: Settings }
];

const supportItems = [
  { label: "Support", icon: LifeBuoy },
  { label: "Docs", icon: HelpCircle },
  { label: "Security", icon: ShieldCheck }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="primary-sidebar">
        <div className="brand">
          <span className="brand-mark">MD</span>
          <span>MSP Docs</span>
        </div>

        <nav className="nav-section">
          {navItems.map((item) => (
            <button className={`nav-item ${item.active ? "active" : ""}`} key={item.label}>
              <item.icon size={21} />
              <span>{item.label}</span>
              {item.count ? <span className="badge">{item.count}</span> : null}
            </button>
          ))}
        </nav>

        <nav className="nav-section">
          {adminItems.map((item) => (
            <button className="nav-item" key={item.label}>
              <item.icon size={21} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav-spacer" />

        <nav className="nav-section">
          {supportItems.map((item) => (
            <button className="nav-item" key={item.label}>
              <item.icon size={21} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="user-card">
          <span className="avatar">AS</span>
          <div>
            <div className="record-title">Aaron Satko</div>
            <div className="record-meta">Admin</div>
          </div>
          <ChevronDown size={18} style={{ marginLeft: "auto" }} />
        </div>
      </aside>

      <aside className="secondary-sidebar">
        <h2 className="sidebar-title">Customers</h2>
        <button className="group-item active">
          <Archive size={21} />
          <span>All customers</span>
          <span className="badge">{customers.length}</span>
        </button>
        <button className="group-item">
          <Bell size={21} />
          <span>Needs attention</span>
          <span className="badge">{incompleteCustomers.length}</span>
        </button>
        <button className="group-item">
          <HardDrive size={21} />
          <span>Hardware due</span>
          <span className="badge">{dueSoonHardware.length + overdueHardware.length}</span>
        </button>

        <div className="section-label">Customer groups</div>
        {customers.map((customer) => (
          <button className="group-item" key={customer.id}>
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
