import {
  Building2,
  Check,
  ChevronDown,
  Columns3,
  Download,
  FileSearch,
  FileText,
  Filter,
  HardDrive,
  MoreVertical,
  Plus,
  Search,
  Server,
  ShieldAlert,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import {
  contracts,
  customers,
  documentationPages,
  dueSoonDays,
  files,
  hardwareWithLifecycle,
  incompleteCustomers,
  internetServices,
  overdueHardware
} from "@/lib/demo-data";
import { formatDate } from "@/lib/lifecycle";

function lifecycleLabel(status: string) {
  switch (status) {
    case "due-soon":
      return "Due soon";
    case "overdue":
      return "Overdue";
    case "healthy":
      return "Healthy";
    case "retired":
      return "Retired";
    default:
      return "Unknown";
  }
}

export default function DashboardPage() {
  const activeHardware = hardwareWithLifecycle.filter((asset) => asset.status !== "retired");
  const dueHardware = activeHardware.filter((asset) => asset.lifecycleStatus === "due-soon").length;
  const activeContracts = contracts.filter((contract) => contract.status !== "expired");

  return (
    <AppShell>
      <div className="topbar">
        <div className="breadcrumb">
          <Building2 size={22} />
          <span>All customers</span>
        </div>
        <button className="primary-button">
          <Plus size={20} />
          Add customer
        </button>
      </div>

      <div className="content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              High-level customer health, lifecycle urgency, documentation gaps, and recently updated records.
            </p>
          </div>
          <div className="pill-row">
            <span className="pill blue">Due soon: {dueSoonDays} days</span>
            <span className="pill">Disk storage</span>
          </div>
        </header>

        <section className="metrics-grid" aria-label="Dashboard metrics">
          <div className="metric">
            <div className="metric-label">
              <Building2 size={18} />
              Customers
            </div>
            <div className="metric-value">{customers.length}</div>
            <div className="metric-detail">One MSP installation</div>
          </div>
          <div className="metric">
            <div className="metric-label">
              <ShieldAlert size={18} />
              Overdue replacements
            </div>
            <div className="metric-value">{overdueHardware.length}</div>
            <div className="metric-detail">Hidden only when retired</div>
          </div>
          <div className="metric">
            <div className="metric-label">
              <HardDrive size={18} />
              Due soon
            </div>
            <div className="metric-value">{dueHardware}</div>
            <div className="metric-detail">Editable default window</div>
          </div>
          <div className="metric">
            <div className="metric-label">
              <FileSearch size={18} />
              Documentation gaps
            </div>
            <div className="metric-value">{incompleteCustomers.length}</div>
            <div className="metric-detail">Customer completeness below 100%</div>
          </div>
        </section>

        <div className="toolbar">
          <div className="toolbar-left">
            <label className="search">
              <Search size={21} />
              <input placeholder="Search customers, assets, contracts, files..." />
            </label>
            <button className="toolbar-button">
              <ChevronDown size={18} />
              Actions
            </button>
            <button className="toolbar-button">
              <Check size={18} />
              Snooze
            </button>
          </div>
          <div className="toolbar-right">
            <button className="toolbar-button">
              <Download size={18} />
              Export CSV
            </button>
            <button className="toolbar-button">
              <Filter size={18} />
              Add filter
            </button>
            <button className="toolbar-button">
              <Columns3 size={18} />
              Columns
            </button>
          </div>
        </div>

        <section className="data-panel" aria-label="Hardware lifecycle table">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>
                  <input aria-label="Select all hardware" type="checkbox" />
                </th>
                <th>Hardware</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Replacement</th>
                <th>Tags</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {activeHardware.map((asset, index) => (
                <tr key={asset.id}>
                  <td>
                    <input aria-label={`Select ${asset.name}`} type="checkbox" />
                  </td>
                  <td>
                    <div className="name-cell">
                      <div className={`record-icon ${index % 3 === 1 ? "green" : index % 3 === 2 ? "orange" : ""}`}>
                        {asset.type === "Server" ? <Server size={24} /> : <HardDrive size={24} />}
                      </div>
                      <div>
                        <div className="record-title">{asset.name}</div>
                        <div className="record-meta">
                          {asset.manufacturer} {asset.model} / {asset.serialNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusPill label={lifecycleLabel(asset.lifecycleStatus)} status={asset.lifecycleStatus} />
                  </td>
                  <td>
                    <div className="record-title">{asset.customerName}</div>
                    <div className="record-meta">{asset.location}</div>
                  </td>
                  <td>
                    <div className="record-title">{formatDate(asset.replacementDate)}</div>
                    <div className="record-meta">{asset.replacementIntervalMonths ?? "No"} month interval</div>
                  </td>
                  <td>
                    <div className="pill-row">
                      {asset.tags.map((tag) => (
                        <span className="pill" key={tag}>
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button className="icon-button" aria-label={`Open actions for ${asset.name}`}>
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="split-grid">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Documentation completeness</h2>
              <span className="pill blue">Open gaps</span>
            </div>
            <div className="alert-list">
              {incompleteCustomers.map((customer) => (
                <div className="alert-item" key={customer.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div className="record-title">{customer.name}</div>
                      <div className="record-meta">
                        Missing {customer.missing.map((item) => item.label).join(", ")}
                      </div>
                    </div>
                    <span className="pill amber">{customer.completion}%</span>
                  </div>
                  <div className="progress" aria-label={`${customer.name} completion ${customer.completion}%`}>
                    <div className="progress-bar" style={{ width: `${customer.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Contracts expiring soon</h2>
              <span className="pill">90 days</span>
            </div>
            <div className="alert-list">
              {activeContracts.map((contract) => (
                <div className="alert-item" key={contract.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div className="record-title">{contract.name}</div>
                      <div className="record-meta">
                        {contract.customerName} / {contract.provider}
                      </div>
                    </div>
                    <StatusPill label={contract.status === "expiring soon" ? "Expiring" : "Active"} status={contract.status} />
                  </div>
                  <div className="record-meta">Renews {contract.renewalDate} / Notice by {contract.cancellationNoticeDate}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="split-grid">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Recent documentation pages</h2>
              <button className="toolbar-button">
                <Plus size={17} />
                New page
              </button>
            </div>
            <div className="doc-list">
              {documentationPages.map((page) => (
                <div className="doc-item" key={page.id}>
                  <div className="name-cell">
                    <div className="record-icon green">
                      <FileText size={23} />
                    </div>
                    <div>
                      <div className="record-title">{page.title}</div>
                      <div className="record-meta">{page.folder}</div>
                    </div>
                  </div>
                  <div className="muted">{page.excerpt}</div>
                  <div className="record-meta">
                    Updated {page.updatedAt} by {page.updatedBy}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Files and internet services</h2>
              <span className="pill">25 MB max</span>
            </div>
            <div className="doc-list">
              {files.map((file) => (
                <div className="doc-item" key={file.id}>
                  <div className="record-title">{file.name}</div>
                  <div className="record-meta">{file.folder}</div>
                  <div className="pill-row">
                    <span className="pill blue">{file.type}</span>
                    <span className="pill">v{file.version}</span>
                    <span className="pill">{file.size}</span>
                  </div>
                </div>
              ))}
              {internetServices.map((service) => (
                <div className="doc-item" key={service.id}>
                  <div className="record-title">{service.provider}</div>
                  <div className="record-meta">
                    {service.customerName} / {service.location} / {service.speed}
                  </div>
                  <div className="pill-row">
                    <span className="pill green">{service.type}</span>
                    <span className="pill">{service.staticIps}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
