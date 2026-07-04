import { getCompletionPercent, type CompletionCategory } from "@/lib/completeness";
import { getLifecycleStatus, getReplacementDate } from "@/lib/lifecycle";

export type Customer = {
  id: string;
  name: string;
  legalName: string;
  category: "Managed" | "Prospect" | "Archived";
  status: "Active" | "Onboarding" | "Inactive";
  primaryContact: string;
  accountManager: string;
  primaryTechnician: string;
  locationCount: number;
  tags: string[];
  completeness: CompletionCategory[];
};

export type HardwareAsset = {
  id: string;
  customerId: string;
  customerName: string;
  location: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installedDate?: string;
  warrantyExpiration?: string;
  replacementIntervalMonths?: number;
  manualReplacementDate?: string;
  status: "active" | "spare" | "retired" | "missing" | "warranty repair";
  tags: string[];
};

export type Contract = {
  id: string;
  customerName: string;
  name: string;
  provider: string;
  type: string;
  renewalDate: string;
  cancellationNoticeDate: string;
  monthlyCost: number;
  status: "active" | "expiring soon" | "expired";
};

export type InternetService = {
  id: string;
  customerName: string;
  location: string;
  provider: string;
  type: string;
  circuitId: string;
  speed: string;
  staticIps: string;
  renewalDate: string;
};

export type FileRecord = {
  id: string;
  customerName: string;
  folder: string;
  name: string;
  type: "PDF" | "Image" | "Spreadsheet" | "Document";
  version: number;
  size: string;
  uploadedAt: string;
};

export const dueSoonDays = 90;

export const customers: Customer[] = [
  {
    id: "nephrology-associates",
    name: "Nephrology Associates",
    legalName: "Nephrology Associates PLLC",
    category: "Managed",
    status: "Active",
    primaryContact: "Amanda Wilson",
    accountManager: "Aaron Satko",
    primaryTechnician: "Riley Hart",
    locationCount: 2,
    tags: ["healthcare", "priority"],
    completeness: [
      { key: "contacts", label: "Contacts", completed: 3, required: 3 },
      { key: "hardware", label: "Hardware", completed: 7, required: 8 },
      { key: "internet", label: "Internet", completed: 1, required: 2 },
      { key: "contracts", label: "Contracts", completed: 2, required: 2 },
      { key: "network", label: "Network", completed: 3, required: 5 },
      { key: "files", label: "Files", completed: 4, required: 4 },
      { key: "docs", label: "Docs", completed: 2, required: 3 }
    ]
  },
  {
    id: "scr-internal",
    name: "SCR - Internal",
    legalName: "Sites Computer Resources",
    category: "Managed",
    status: "Active",
    primaryContact: "Aaron Satko",
    accountManager: "Aaron Satko",
    primaryTechnician: "Aaron Satko",
    locationCount: 1,
    tags: ["internal"],
    completeness: [
      { key: "contacts", label: "Contacts", completed: 2, required: 2 },
      { key: "hardware", label: "Hardware", completed: 4, required: 4 },
      { key: "internet", label: "Internet", completed: 1, required: 1 },
      { key: "contracts", label: "Contracts", completed: 1, required: 1 },
      { key: "network", label: "Network", completed: 3, required: 4 },
      { key: "files", label: "Files", completed: 2, required: 2 },
      { key: "docs", label: "Docs", completed: 2, required: 2 }
    ]
  },
  {
    id: "total-care-pharmacy",
    name: "Total Care Pharmacy",
    legalName: "Total Care Pharmacy Inc.",
    category: "Managed",
    status: "Active",
    primaryContact: "Jason Moore",
    accountManager: "Dana Lee",
    primaryTechnician: "Riley Hart",
    locationCount: 3,
    tags: ["retail", "multi-site"],
    completeness: [
      { key: "contacts", label: "Contacts", completed: 2, required: 3 },
      { key: "hardware", label: "Hardware", completed: 11, required: 15 },
      { key: "internet", label: "Internet", completed: 3, required: 3 },
      { key: "contracts", label: "Contracts", completed: 1, required: 3 },
      { key: "network", label: "Network", completed: 4, required: 7 },
      { key: "files", label: "Files", completed: 6, required: 6 },
      { key: "docs", label: "Docs", completed: 2, required: 5 }
    ]
  }
];

export const hardwareAssets: HardwareAsset[] = [
  {
    id: "ups-main-rack",
    customerId: "nephrology-associates",
    customerName: "Nephrology Associates",
    location: "730 Highland Ave",
    name: "Main Rack UPS",
    type: "UPS",
    manufacturer: "APC",
    model: "Smart-UPS 1500",
    serialNumber: "AS19384N22",
    installedDate: "2023-06-12",
    warrantyExpiration: "2026-06-12",
    replacementIntervalMonths: 36,
    status: "active",
    tags: ["rack", "battery"]
  },
  {
    id: "neph-fw-01",
    customerId: "nephrology-associates",
    customerName: "Nephrology Associates",
    location: "730 Highland Ave",
    name: "NEPH-FW-01",
    type: "Firewall",
    manufacturer: "Fortinet",
    model: "FortiGate 80F",
    serialNumber: "FG80FTK22001",
    installedDate: "2022-08-01",
    warrantyExpiration: "2027-08-01",
    replacementIntervalMonths: 60,
    status: "active",
    tags: ["edge", "security"]
  },
  {
    id: "scr5-domain-controller",
    customerId: "scr-internal",
    customerName: "SCR - Internal",
    location: "Main Office",
    name: "SCR5-Domain-Controller",
    type: "Server",
    manufacturer: "Dell",
    model: "PowerEdge T350",
    serialNumber: "DLT350SCR5",
    installedDate: "2021-03-15",
    warrantyExpiration: "2026-03-15",
    replacementIntervalMonths: 60,
    status: "active",
    tags: ["server"]
  },
  {
    id: "tcp-pos-2",
    customerId: "total-care-pharmacy",
    customerName: "Total Care Pharmacy",
    location: "Front Counter",
    name: "TCP-POS-2",
    type: "Workstation",
    manufacturer: "Lenovo",
    model: "ThinkCentre M720q",
    serialNumber: "LEN720TCP2",
    installedDate: "2021-09-10",
    warrantyExpiration: "2024-09-10",
    replacementIntervalMonths: 48,
    status: "active",
    tags: ["pos", "encrypted"]
  },
  {
    id: "tcp-ap-stockroom",
    customerId: "total-care-pharmacy",
    customerName: "Total Care Pharmacy",
    location: "Stockroom",
    name: "TCP-AP-Stockroom",
    type: "Access point",
    manufacturer: "Ubiquiti",
    model: "U6 Pro",
    serialNumber: "UBNTTCPAP3",
    installedDate: "2024-02-05",
    warrantyExpiration: "2026-02-05",
    replacementIntervalMonths: 48,
    status: "active",
    tags: ["wireless"]
  }
];

export const contracts: Contract[] = [
  {
    id: "neph-msp-agreement",
    customerName: "Nephrology Associates",
    name: "Managed Services Agreement",
    provider: "Sites Computer Resources",
    type: "MSP Agreement",
    renewalDate: "2026-08-31",
    cancellationNoticeDate: "2026-07-31",
    monthlyCost: 4200,
    status: "expiring soon"
  },
  {
    id: "tcp-isp-fiber",
    customerName: "Total Care Pharmacy",
    name: "Fiber Internet Contract",
    provider: "Spectrum Enterprise",
    type: "Internet",
    renewalDate: "2026-09-15",
    cancellationNoticeDate: "2026-08-16",
    monthlyCost: 689,
    status: "expiring soon"
  },
  {
    id: "scr-backup",
    customerName: "SCR - Internal",
    name: "Cloud Backup",
    provider: "Axcient",
    type: "Backup",
    renewalDate: "2027-02-01",
    cancellationNoticeDate: "2026-12-31",
    monthlyCost: 340,
    status: "active"
  }
];

export const internetServices: InternetService[] = [
  {
    id: "neph-fiber",
    customerName: "Nephrology Associates",
    location: "730 Highland Ave",
    provider: "Comcast Business",
    type: "Fiber",
    circuitId: "CBC-88291-NA",
    speed: "1 Gbps x 1 Gbps",
    staticIps: "5 usable",
    renewalDate: "2026-11-30"
  },
  {
    id: "tcp-cable",
    customerName: "Total Care Pharmacy",
    location: "Main Store",
    provider: "Spectrum Enterprise",
    type: "Cable",
    circuitId: "SPC-44312-TCP",
    speed: "600 Mbps x 35 Mbps",
    staticIps: "1 usable",
    renewalDate: "2026-09-15"
  }
];

export const files: FileRecord[] = [
  {
    id: "neph-network-diagram",
    customerName: "Nephrology Associates",
    folder: "Customers / Managed / Nephrology Associates / Network",
    name: "Highland network diagram.pdf",
    type: "PDF",
    version: 3,
    size: "3.8 MB",
    uploadedAt: "2026-06-29"
  },
  {
    id: "tcp-signed-contract",
    customerName: "Total Care Pharmacy",
    folder: "Customers / Managed / Total Care Pharmacy / Contracts",
    name: "2026 managed services agreement.pdf",
    type: "PDF",
    version: 1,
    size: "1.4 MB",
    uploadedAt: "2026-06-18"
  },
  {
    id: "scr-rack-photo",
    customerName: "SCR - Internal",
    folder: "Customers / Managed / SCR - Internal / Images",
    name: "rack-front.jpg",
    type: "Image",
    version: 2,
    size: "2.1 MB",
    uploadedAt: "2026-07-01"
  }
];

export const documentationPages = [
  {
    id: "neph-escalation",
    customerName: "Nephrology Associates",
    folder: "Customers / Managed / Nephrology Associates / Procedures",
    title: "After-hours escalation procedure",
    updatedAt: "2026-07-02",
    updatedBy: "Riley Hart",
    excerpt: "Use the practice administrator as the first escalation contact for outages affecting patient care."
  },
  {
    id: "tcp-onboarding",
    customerName: "Total Care Pharmacy",
    folder: "Customers / Managed / Total Care Pharmacy / Operations",
    title: "New workstation onboarding",
    updatedAt: "2026-06-22",
    updatedBy: "Dana Lee",
    excerpt: "POS workstations require encryption, receipt printer mapping, and pharmacy software validation."
  }
];

export function getCustomerCompletion(customer: Customer) {
  return getCompletionPercent(customer.completeness);
}

export const hardwareWithLifecycle = hardwareAssets.map((asset) => ({
  ...asset,
  replacementDate: getReplacementDate(
    asset.installedDate,
    asset.replacementIntervalMonths,
    asset.manualReplacementDate
  ),
  lifecycleStatus: getLifecycleStatus({
    status: asset.status,
    installedDate: asset.installedDate,
    replacementIntervalMonths: asset.replacementIntervalMonths,
    manualReplacementDate: asset.manualReplacementDate,
    dueSoonDays,
    today: new Date("2026-07-04T00:00:00")
  })
}));

export const overdueHardware = hardwareWithLifecycle.filter((asset) => asset.lifecycleStatus === "overdue");
export const dueSoonHardware = hardwareWithLifecycle.filter((asset) => asset.lifecycleStatus === "due-soon");
export const incompleteCustomers = customers
  .map((customer) => ({
    ...customer,
    completion: getCustomerCompletion(customer),
    missing: customer.completeness.filter((category) => category.completed < category.required)
  }))
  .filter((customer) => customer.completion < 100);

