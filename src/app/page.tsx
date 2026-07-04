"use client";

import { useMemo, useState } from "react";
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
  ShieldAlert
} from "lucide-react";
import { AppShell, type AppView, type CustomerScope } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import {
  contracts,
  customers,
  documentationPages,
  dueSoonDays,
  files,
  hardwareWithLifecycle,
  incompleteCustomers,
  internetServices
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

function viewTitle(view: AppView) {
  const titles: Record<AppView, string> = {
    dashboard: "Dashboard",
    customers: "Customers",
    hardware: "Hardware",
    contracts: "Contracts",
    internet: "Internet Services",
    files: "Files",
    documentation: "Documentation",
    reports: "Reports",
    users: "Users",
    activity: "Activity",
    settings: "Settings"
  };

  return titles[view];
}

function scopeCustomerNames(scope: CustomerScope) {
  if (scope === "all") {
    return customers.map((customer) => customer.name);
  }

  if (scope === "attention") {
    return incompleteCustomers.map((customer) => customer.name);
  }

  if (scope === "hardware-due") {
    return hardwareWithLifecycle
      .filter((asset) => asset.lifecycleStatus === "due-soon" || asset.lifecycleStatus === "overdue")
      .map((asset) => asset.customerName);
  }

  const customer = customers.find((item) => item.id === scope);
  return customer ? [customer.name] : customers.map((customer) => customer.name);
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const [customerScope, setCustomerScope] = useState<CustomerScope>("all");
  const [query, setQuery] = useState("");
  const [showOnlyDue, setShowOnlyDue] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [snoozedAlerts, setSnoozedAlerts] = useState<string[]>([]);
  const [notice, setNotice] = useState("Prototype mode: navigation and controls are now wired to demo data.");

  const scopedCustomerNames = useMemo(() => new Set(scopeCustomerNames(customerScope)), [customerScope]);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredHardware = useMemo(() => {
    return hardwareWithLifecycle
      .filter((asset) => asset.status !== "retired")
      .filter((asset) => scopedCustomerNames.has(asset.customerName))
      .filter((asset) => !showOnlyDue || asset.lifecycleStatus === "due-soon" || asset.lifecycleStatus === "overdue")
      .filter((asset) => {
        if (!normalizedQuery) {
          return true;
        }

        return [asset.name, asset.customerName, asset.location, asset.type, asset.manufacturer, asset.model, asset.serialNumber]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      });
  }, [normalizedQuery, scopedCustomerNames, showOnlyDue]);

  const filteredCustomers = customers.filter((customer) => {
    if (!scopedCustomerNames.has(customer.name)) {
      return false;
    }

    return [customer.name, customer.legalName, customer.primaryContact, customer.accountManager, customer.primaryTechnician]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const filteredContracts = contracts.filter(
    (contract) =>
      scopedCustomerNames.has(contract.customerName) &&
      [contract.name, contract.customerName, contract.provider, contract.type].join(" ").toLowerCase().includes(normalizedQuery)
  );

  const filteredInternetServices = internetServices.filter(
    (service) =>
      scopedCustomerNames.has(service.customerName) &&
      [service.provider, service.customerName, service.location, service.type, service.circuitId]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
  );

  const filteredFiles = files.filter(
    (file) =>
      scopedCustomerNames.has(file.customerName) &&
      [file.name, file.customerName, file.folder, file.type].join(" ").toLowerCase().includes(normalizedQuery)
  );

  const filteredDocumentationPages = documentationPages.filter(
    (page) =>
      scopedCustomerNames.has(page.customerName) &&
      [page.title, page.customerName, page.folder, page.excerpt].join(" ").toLowerCase().includes(normalizedQuery)
  );

  const visibleIncompleteCustomers = incompleteCustomers.filter(
    (customer) => scopedCustomerNames.has(customer.name) && !snoozedAlerts.includes(customer.id)
  );
  const overdueCount = filteredHardware.filter((asset) => asset.lifecycleStatus === "overdue").length;
  const dueSoonCount = filteredHardware.filter((asset) => asset.lifecycleStatus === "due-soon").length;
  const activeContracts = filteredContracts.filter((contract) => contract.status !== "expired");

  function handleViewChange(view: AppView) {
    setActiveView(view);
    setShowActionMenu(false);
    setNotice(`Showing ${viewTitle(view)}.`);
  }

  function handleCustomerScopeChange(scope: CustomerScope) {
    setCustomerScope(scope);
    setSelectedRows([]);
    setShowActionMenu(false);
    setNotice(scope === "all" ? "Showing all customers." : "Customer scope updated.");
  }

  function toggleRow(id: string) {
    setSelectedRows((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function snoozeVisibleAlerts() {
    const alertIds = visibleIncompleteCustomers.map((customer) => customer.id);
    setSnoozedAlerts((current) => Array.from(new Set([...current, ...alertIds])));
    setNotice(alertIds.length ? `Snoozed ${alertIds.length} documentation alert(s).` : "No visible alerts to snooze.");
  }

  function exportCurrentView() {
    if (activeView === "customers") {
      downloadCsv("customers.csv", [
        ["Customer", "Status", "Primary Contact", "Account Manager", "Technician"],
        ...filteredCustomers.map((customer) => [
          customer.name,
          customer.status,
          customer.primaryContact,
          customer.accountManager,
          customer.primaryTechnician
        ])
      ]);
    } else if (activeView === "contracts") {
      downloadCsv("contracts.csv", [
        ["Customer", "Contract", "Provider", "Renewal", "Status"],
        ...filteredContracts.map((contract) => [
          contract.customerName,
          contract.name,
          contract.provider,
          contract.renewalDate,
          contract.status
        ])
      ]);
    } else {
      downloadCsv("hardware.csv", [
        ["Customer", "Hardware", "Type", "Serial", "Lifecycle", "Replacement"],
        ...filteredHardware.map((asset) => [
          asset.customerName,
          asset.name,
          asset.type,
          asset.serialNumber,
          lifecycleLabel(asset.lifecycleStatus),
          formatDate(asset.replacementDate)
        ])
      ]);
    }

    setNotice(`Exported ${viewTitle(activeView)} CSV.`);
  }

  return (
    <AppShell
      activeView={activeView}
      customerScope={customerScope}
      onCustomerScopeChange={handleCustomerScopeChange}
      onSupportAction={(label) => setNotice(`${label} will open once those pages are implemented.`)}
      onViewChange={handleViewChange}
    >
      <div className="topbar">
        <div className="breadcrumb">
          <Building2 size={22} />
          <span>{customerScope === "all" ? "All customers" : "Filtered customers"}</span>
        </div>
        <button className="primary-button" onClick={() => setNotice("Add flow placeholder: forms are next after database-backed CRUD.")}>
          <Plus size={20} />
          {activeView === "documentation" ? "New page" : activeView === "files" ? "Upload file" : "Add record"}
        </button>
      </div>

      <div className="content">
        <header className="page-header">
          <div>
            <h1 className="page-title">{viewTitle(activeView)}</h1>
            <p className="page-subtitle">
              {activeView === "dashboard"
                ? "High-level customer health, lifecycle urgency, documentation gaps, and recently updated records."
                : "Interactive prototype view backed by demo data until CRUD and authentication are connected."}
            </p>
          </div>
          <div className="pill-row">
            <span className="pill blue">Due soon: {dueSoonDays} days</span>
            <span className="pill">Disk storage</span>
          </div>
        </header>

        {notice ? (
          <div className="notice">
            <span>{notice}</span>
            <button className="button-reset notice-close" onClick={() => setNotice("")}>
              Dismiss
            </button>
          </div>
        ) : null}

        <section className="metrics-grid" aria-label="Dashboard metrics">
          <button className="metric button-reset" onClick={() => handleViewChange("customers")}>
            <div className="metric-label">
              <Building2 size={18} />
              Customers
            </div>
            <div className="metric-value">{filteredCustomers.length}</div>
            <div className="metric-detail">Click to view customer list</div>
          </button>
          <button className="metric button-reset" onClick={() => handleViewChange("hardware")}>
            <div className="metric-label">
              <ShieldAlert size={18} />
              Overdue replacements
            </div>
            <div className="metric-value">{overdueCount}</div>
            <div className="metric-detail">Hidden only when retired</div>
          </button>
          <button className="metric button-reset" onClick={() => handleViewChange("hardware")}>
            <div className="metric-label">
              <HardDrive size={18} />
              Due soon
            </div>
            <div className="metric-value">{dueSoonCount}</div>
            <div className="metric-detail">Editable default window</div>
          </button>
          <button className="metric button-reset" onClick={() => handleViewChange("documentation")}>
            <div className="metric-label">
              <FileSearch size={18} />
              Documentation gaps
            </div>
            <div className="metric-value">{visibleIncompleteCustomers.length}</div>
            <div className="metric-detail">Click to inspect gaps</div>
          </button>
        </section>

        <div className="toolbar">
          <div className="toolbar-left">
            <label className="search">
              <Search size={21} />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search customers, assets, contracts, files..."
                value={query}
              />
            </label>
            <div className="menu-wrap">
              <button className="toolbar-button" onClick={() => setShowActionMenu((value) => !value)}>
                <ChevronDown size={18} />
                Actions
              </button>
              {showActionMenu ? (
                <div className="action-menu">
                  <button onClick={() => setNotice(`${selectedRows.length} selected row(s). Bulk edit is not wired yet.`)}>
                    Bulk edit selected
                  </button>
                  <button onClick={() => setSelectedRows([])}>Clear selection</button>
                  <button onClick={() => setNotice("Retired asset history view is planned for the CRUD phase.")}>
                    View retired hardware
                  </button>
                </div>
              ) : null}
            </div>
            <button className="toolbar-button" onClick={snoozeVisibleAlerts}>
              <Check size={18} />
              Snooze
            </button>
          </div>
          <div className="toolbar-right">
            <button className="toolbar-button" onClick={exportCurrentView}>
              <Download size={18} />
              Export CSV
            </button>
            <button className={`toolbar-button ${showOnlyDue ? "active-control" : ""}`} onClick={() => setShowOnlyDue((value) => !value)}>
              <Filter size={18} />
              {showOnlyDue ? "Due only" : "Add filter"}
            </button>
            <button className={`toolbar-button ${showDetails ? "active-control" : ""}`} onClick={() => setShowDetails((value) => !value)}>
              <Columns3 size={18} />
              Columns
            </button>
          </div>
        </div>

        {activeView === "customers" ? (
          <CustomersTable customers={filteredCustomers} onOpen={(name) => setNotice(`Opened ${name} customer overview placeholder.`)} />
        ) : activeView === "contracts" ? (
          <ContractsTable contracts={filteredContracts} onOpen={(name) => setNotice(`Opened ${name} contract placeholder.`)} />
        ) : activeView === "internet" ? (
          <InternetTable services={filteredInternetServices} onOpen={(name) => setNotice(`Opened ${name} internet service placeholder.`)} />
        ) : activeView === "files" ? (
          <FilesTable files={filteredFiles} onOpen={(name) => setNotice(`Previewing ${name} will be wired with real file storage.`)} />
        ) : activeView === "documentation" ? (
          <DocumentationTable pages={filteredDocumentationPages} onOpen={(name) => setNotice(`Opened ${name} rich text page placeholder.`)} />
        ) : activeView === "reports" ? (
          <ReportsPanel />
        ) : activeView === "users" || activeView === "activity" || activeView === "settings" ? (
          <AdminPanel view={activeView} />
        ) : (
          <HardwareTable
            hardware={filteredHardware}
            onOpen={(name) => setNotice(`Opened ${name} hardware detail placeholder.`)}
            onToggleRow={toggleRow}
            selectedRows={selectedRows}
          />
        )}

        {showDetails ? (
          <>
            <div className="split-grid">
              <section className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">Documentation completeness</h2>
                  <span className="pill blue">Open gaps</span>
                </div>
                <div className="alert-list">
                  {visibleIncompleteCustomers.length ? (
                    visibleIncompleteCustomers.map((customer) => (
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
                    ))
                  ) : (
                    <div className="alert-item muted">No visible documentation alerts.</div>
                  )}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">Contracts expiring soon</h2>
                  <span className="pill">90 days</span>
                </div>
                <div className="alert-list">
                  {activeContracts.map((contract) => (
                    <button className="alert-item button-reset" key={contract.id} onClick={() => setNotice(`Opened ${contract.name}.`)}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div className="record-title">{contract.name}</div>
                          <div className="record-meta">
                            {contract.customerName} / {contract.provider}
                          </div>
                        </div>
                        <StatusPill label={contract.status === "expiring soon" ? "Expiring" : "Active"} status={contract.status} />
                      </div>
                      <div className="record-meta">
                        Renews {contract.renewalDate} / Notice by {contract.cancellationNoticeDate}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="split-grid">
              <section className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">Recent documentation pages</h2>
                  <button className="toolbar-button" onClick={() => setNotice("New rich text page flow is next.")}>
                    <Plus size={17} />
                    New page
                  </button>
                </div>
                <div className="doc-list">
                  {filteredDocumentationPages.map((page) => (
                    <button className="doc-item button-reset" key={page.id} onClick={() => setNotice(`Opened ${page.title}.`)}>
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
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <h2 className="panel-title">Files and internet services</h2>
                  <span className="pill">25 MB max</span>
                </div>
                <div className="doc-list">
                  {filteredFiles.map((file) => (
                    <button className="doc-item button-reset" key={file.id} onClick={() => setNotice(`Preview placeholder for ${file.name}.`)}>
                      <div className="record-title">{file.name}</div>
                      <div className="record-meta">{file.folder}</div>
                      <div className="pill-row">
                        <span className="pill blue">{file.type}</span>
                        <span className="pill">v{file.version}</span>
                        <span className="pill">{file.size}</span>
                      </div>
                    </button>
                  ))}
                  {filteredInternetServices.map((service) => (
                    <button
                      className="doc-item button-reset"
                      key={service.id}
                      onClick={() => setNotice(`Opened ${service.provider} service.`)}
                    >
                      <div className="record-title">{service.provider}</div>
                      <div className="record-meta">
                        {service.customerName} / {service.location} / {service.speed}
                      </div>
                      <div className="pill-row">
                        <span className="pill green">{service.type}</span>
                        <span className="pill">{service.staticIps}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function HardwareTable({
  hardware,
  onOpen,
  onToggleRow,
  selectedRows
}: {
  hardware: typeof hardwareWithLifecycle;
  onOpen: (name: string) => void;
  onToggleRow: (id: string) => void;
  selectedRows: string[];
}) {
  return (
    <section className="data-panel" aria-label="Hardware lifecycle table">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 44 }}>Select</th>
            <th>Hardware</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Replacement</th>
            <th>Tags</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {hardware.map((asset, index) => (
            <tr key={asset.id}>
              <td>
                <input
                  aria-label={`Select ${asset.name}`}
                  checked={selectedRows.includes(asset.id)}
                  onChange={() => onToggleRow(asset.id)}
                  type="checkbox"
                />
              </td>
              <td>
                <button className="name-cell button-reset" onClick={() => onOpen(asset.name)}>
                  <div className={`record-icon ${index % 3 === 1 ? "green" : index % 3 === 2 ? "orange" : ""}`}>
                    {asset.type === "Server" ? <Server size={24} /> : <HardDrive size={24} />}
                  </div>
                  <div>
                    <div className="record-title">{asset.name}</div>
                    <div className="record-meta">
                      {asset.manufacturer} {asset.model} / {asset.serialNumber}
                    </div>
                  </div>
                </button>
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
                <button className="icon-button" aria-label={`Open actions for ${asset.name}`} onClick={() => onOpen(asset.name)}>
                  <MoreVertical size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function CustomersTable({ customers: rows, onOpen }: { customers: typeof customers; onOpen: (name: string) => void }) {
  return (
    <section className="data-panel">
      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Status</th>
            <th>Primary Contact</th>
            <th>Account Manager</th>
            <th>Technician</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((customer) => (
            <tr key={customer.id}>
              <td>
                <button className="name-cell button-reset" onClick={() => onOpen(customer.name)}>
                  <div className="record-icon">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <div className="record-title">{customer.name}</div>
                    <div className="record-meta">{customer.legalName}</div>
                  </div>
                </button>
              </td>
              <td>
                <StatusPill label={customer.status} status={customer.status.toLowerCase()} />
              </td>
              <td>{customer.primaryContact}</td>
              <td>{customer.accountManager}</td>
              <td>{customer.primaryTechnician}</td>
              <td>
                <div className="pill-row">
                  {customer.tags.map((tag) => (
                    <span className="pill" key={tag}>
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ContractsTable({ contracts: rows, onOpen }: { contracts: typeof contracts; onOpen: (name: string) => void }) {
  return (
    <section className="data-panel">
      <table className="table">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Status</th>
            <th>Customer</th>
            <th>Provider</th>
            <th>Renewal</th>
            <th>Notice Deadline</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((contract) => (
            <tr key={contract.id}>
              <td>
                <button className="record-title button-reset" onClick={() => onOpen(contract.name)}>
                  {contract.name}
                </button>
                <div className="record-meta">{contract.type}</div>
              </td>
              <td>
                <StatusPill label={contract.status === "expiring soon" ? "Expiring" : "Active"} status={contract.status} />
              </td>
              <td>{contract.customerName}</td>
              <td>{contract.provider}</td>
              <td>{contract.renewalDate}</td>
              <td>{contract.cancellationNoticeDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function InternetTable({ services, onOpen }: { services: typeof internetServices; onOpen: (name: string) => void }) {
  return (
    <section className="data-panel">
      <table className="table">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Customer</th>
            <th>Location</th>
            <th>Type</th>
            <th>Speed</th>
            <th>Renewal</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>
                <button className="record-title button-reset" onClick={() => onOpen(service.provider)}>
                  {service.provider}
                </button>
                <div className="record-meta">{service.circuitId}</div>
              </td>
              <td>{service.customerName}</td>
              <td>{service.location}</td>
              <td>
                <span className="pill green">{service.type}</span>
              </td>
              <td>{service.speed}</td>
              <td>{service.renewalDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function FilesTable({ files: rows, onOpen }: { files: typeof files; onOpen: (name: string) => void }) {
  return (
    <section className="data-panel">
      <table className="table">
        <thead>
          <tr>
            <th>File</th>
            <th>Customer</th>
            <th>Folder</th>
            <th>Type</th>
            <th>Version</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((file) => (
            <tr key={file.id}>
              <td>
                <button className="record-title button-reset" onClick={() => onOpen(file.name)}>
                  {file.name}
                </button>
                <div className="record-meta">Uploaded {file.uploadedAt}</div>
              </td>
              <td>{file.customerName}</td>
              <td>{file.folder}</td>
              <td>
                <span className="pill blue">{file.type}</span>
              </td>
              <td>v{file.version}</td>
              <td>{file.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function DocumentationTable({
  pages,
  onOpen
}: {
  pages: typeof documentationPages;
  onOpen: (name: string) => void;
}) {
  return (
    <section className="data-panel">
      <table className="table">
        <thead>
          <tr>
            <th>Page</th>
            <th>Customer</th>
            <th>Folder</th>
            <th>Updated</th>
            <th>Updated By</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td>
                <button className="record-title button-reset" onClick={() => onOpen(page.title)}>
                  {page.title}
                </button>
                <div className="record-meta">{page.excerpt}</div>
              </td>
              <td>{page.customerName}</td>
              <td>{page.folder}</td>
              <td>{page.updatedAt}</td>
              <td>{page.updatedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ReportsPanel() {
  return (
    <section className="panel report-panel">
      <div className="panel-header">
        <h2 className="panel-title">Reports</h2>
        <span className="pill blue">CSV ready</span>
      </div>
      <div className="doc-list">
        {["Hardware due for replacement", "Expiring service contracts", "Customer asset inventory", "Documentation gaps"].map(
          (report) => (
            <button className="doc-item button-reset" key={report}>
              <div className="record-title">{report}</div>
              <div className="record-meta">Report builder placeholder for the database-backed phase.</div>
            </button>
          )
        )}
      </div>
    </section>
  );
}

function AdminPanel({ view }: { view: AppView }) {
  return (
    <section className="panel report-panel">
      <div className="panel-header">
        <h2 className="panel-title">{viewTitle(view)}</h2>
        <span className="pill">Prototype</span>
      </div>
      <div className="doc-item">
        <div className="record-title">{viewTitle(view)} will be connected after authentication and persistence are implemented.</div>
        <div className="record-meta">
          This placeholder keeps the navigation usable while the database-backed workflows are being built.
        </div>
      </div>
    </section>
  );
}
