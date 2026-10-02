"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Droplets,
  Printer,
  Trash2,
  Plus,
  FileSpreadsheet,
  RotateCcw,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ClipboardList,
  Award,
  ArrowLeft,
  Wrench,
  Check,
  CheckSquare,
  Square,
  Cog,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

/* ────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────── */

type DocumentMode = "invoice" | "quotation" | "report" | "certificate";

interface LineItem {
  id: string;
  itemNo: string;
  description: string;
  unit: string;
  qty: number;
  unitPrice: number;
}

interface DocumentState {
  mode: DocumentMode;
  // Common Metadata
  docRef: string;
  issueDate: string;
  dueDate: string;
  validUntil: string;
  paymentTerms: string;
  currency: string;

  // Client / Insured Details
  clientCompany: string;
  contactPerson: string;
  billingEmail: string;
  clientAddress: string;
  clientVat: string;

  // Project / Site Details
  projectName: string;
  siteAddress: string;
  poNumber: string;

  // Insurance Specific Details
  insurerName: string;
  claimNumber: string;
  policyNumber: string;
  dateOfLoss: string;
  inspectionDate: string;
  perilCause: string;
  incidentSummary: string;
  technicalFindings: string;
  consequentialAssessment: string;
  photographicEvidenceLog: string;
  assessorName: string;
  assessorDesignation: string;
  assessorRegNo: string;

  // Financials & Line Items
  taxRate: number;
  discount: number;
  lineItems: LineItem[];

  // Company / Letterhead Details
  companyName: string;
  companySubtitle: string;
  companyReg: string;
  companyVat: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyAddress: string;
  quotationTitle: string;

  // Banking (Invoice & Quotations)
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
  paymentNotice: string;

  // Quotation Specific
  quotationTerms: string;
  depositPercentage: number;
  notes: string;

  // Borehole Spec Certificate Specific Details
  certClientName: string;
  certAddress: string;
  certGps: string;
  certDateDrilled: string;
  certDateTested: string;
  certDepth: string;
  certStaticWaterLevel: string;
  certDynamicWaterLevel: string;
  certYield: string;
  certCasingDiameter: string;
  certCasingDepth: string;
  certPumpInstalled: boolean;
  certPumpType: string;
  certPumpDepth: string;
  certControlBox: string;
  certPipingSpec: string;
  certDrilledBy: string;
  certDrillerDesignation: string;
  certDrillerSignature: string;
  certAuthorizerName: string;
  certAuthorizerSignature: string;
  certStatement: string;
}

/* ────────────────────────────────────────────────────────────────
   Presets & Sample Data for WaterLinks Borehole Services
   ──────────────────────────────────────────────────────────────── */

const WATERLINKS_BASE = {
  companyName: "WaterLinks Borehole Services",
  companySubtitle: "Borehole Drilling · Submersible Pumps · JoJo Tanks · Water Purification",
  companyReg: "2021/849201/07",
  companyVat: "4120294821",
  companyPhone: "+27 78 469 3135",
  companyEmail: "info@waterlinks.co.za",
  companyWebsite: "www.waterlinks.co.za",
  companyAddress: "Gauteng, South Africa",
  bankName: "First National Bank (FNB)",
  accountName: "WaterLinks Borehole Services (Pty) Ltd",
  accountNumber: "62894102948",
  branchCode: "250655",
  accountType: "Business Current Account",
  paymentNotice: "PLEASE USE INVOICE OR QUOTE REFERENCE ON ALL PAYMENTS",
};

const SAMPLE_INVOICE: DocumentState = {
  mode: "invoice",
  ...WATERLINKS_BASE,
  docRef: "WL-INV-1084",
  issueDate: "2026-09-24",
  dueDate: "2026-10-24",
  validUntil: "2026-10-24",
  paymentTerms: "50% Deposit Paid / Balance Due on Handover",
  currency: "ZAR",
  quotationTitle: "OFFICIAL BOREHOLE DRILLING QUOTATION",

  clientCompany: "Highland Eco Estate (Pty) Ltd",
  contactPerson: "Mr. Dave Henderson (Property Director)",
  billingEmail: "accounts@highlandestate.co.za",
  clientAddress: "14 Clearwater Close, Midstream Estate, Centurion, 1692",
  clientVat: "4820194821",

  projectName: "Turnkey Borehole Drilling, Casing & 1.1kW Submersible Pump Installation",
  siteAddress: "Stand 418, Midstream Estate, Centurion, Gauteng",
  poNumber: "PO-WL-2026-881",

  insurerName: "Mutual & Federal Commercial",
  claimNumber: "CLM-2026-99214",
  policyNumber: "POL-772910-ZA",
  dateOfLoss: "2026-09-08",
  inspectionDate: "2026-09-10",
  perilCause: "Severe Lightning & Surge",
  incidentSummary: "Emergency attendance following electrical surge damage.",
  technicalFindings: "Insulation breakdown on motor stator windings.",
  consequentialAssessment: "Direct lightning surge. Non-wear damage.",
  photographicEvidenceLog: "Photos 1-4: Control box capacitor burn and Megger tester readings.",
  assessorName: "Jafta Kanero",
  assessorDesignation: "Lead Drilling & Pump Specialist",
  assessorRegNo: "BA-GP-4192",

  taxRate: 15,
  discount: 1500,
  lineItems: [
    {
      id: "li-1",
      itemNo: "01",
      description: "Percussion rotary air borehole drilling (0m to 70m depth) through hard formation rock",
      unit: "m",
      qty: 70,
      unitPrice: 950,
    },
    {
      id: "li-2",
      itemNo: "02",
      description: "Supply and install heavy-duty 178mm steel surface casing with sanitary collar",
      unit: "m",
      qty: 12,
      unitPrice: 1150,
    },
    {
      id: "li-3",
      itemNo: "03",
      description: "140mm SABS approved slotted and solid uPVC borehole casing with bottom plug & gravel pack",
      unit: "m",
      qty: 58,
      unitPrice: 380,
    },
    {
      id: "li-4",
      itemNo: "04",
      description: "Complete 1.1kW Franklin/DAB Submersible Pump kit with 220V motor & digital dry-run control box",
      unit: "kit",
      qty: 1,
      unitPrice: 14800,
    },
    {
      id: "li-5",
      itemNo: "05",
      description: "70m 32mm HDPE Class 12 poly delivery pipe, 2.5mm² 4-core cable, 6mm safety rope & brass fittings",
      unit: "sum",
      qty: 1,
      unitPrice: 4250,
    },
    {
      id: "li-6",
      itemNo: "06",
      description: "4-Hour calibrated borehole yield step-test with flow metering and recovery logging",
      unit: "test",
      qty: 1,
      unitPrice: 3500,
    },
  ],

  quotationTerms: "Prices valid for 30 calendar days. Workmanship guaranteed.",
  depositPercentage: 50,
  notes: "All drilling and pump installation carried out in strict accordance with SANS 10299 standards.",

  // Certificate Sample defaults
  certClientName: "Mr J Kabuya",
  certAddress: "42 Equity Drive, Blairgowrie 2194, Coordinates: Randburg.",
  certGps: "Randburg (-26.0984° S, 28.0125° E)",
  certDateDrilled: "2026-06-02",
  certDateTested: "2026-10-09",
  certDepth: "80",
  certStaticWaterLevel: "15",
  certDynamicWaterLevel: "38",
  certYield: "6400",
  certCasingDiameter: "140",
  certCasingDepth: "18",
  certPumpInstalled: true,
  certPumpType: "1.1kW Submersible (220V Single Phase)",
  certPumpDepth: "70",
  certControlBox: "Digital Dry-run Protection + 20A Surg",
  certPipingSpec: "32mm Class 12 HDPE Poly Pipe · 2.5mm² 4-Core Submersible Cable",
  certDrilledBy: "Jafta Kanero",
  certDrillerDesignation: "Lead Drilling & Pump Specialist",
  certDrillerSignature: "Jafta Kanero",
  certAuthorizerName: "WaterLinks Operations Desk",
  certAuthorizerSignature: "Wata Kanero",
  certStatement:
    "This borehole has been developed and tested and is confirmed to be in good working condition and suitable for use. The yield is as stated above at the time of testing.",
};

const SAMPLE_QUOTATION: DocumentState = {
  ...SAMPLE_INVOICE,
  mode: "quotation",
  docRef: "WL-QT-2026-412",
  issueDate: "2026-10-01",
  validUntil: "2026-11-01",
  paymentTerms: "50% Deposit on Acceptance / Balance upon Practical Commissioning",
  quotationTitle: "OFFICIAL BOREHOLE & WATER BACKUP QUOTATION",
  clientCompany: "Oakridge Residential Property",
  contactPerson: "Dr. Sarah Van Der Byl",
  billingEmail: "sarah@oakridgemedical.co.za",
  clientAddress: "88 Ridge Road, Waterkloof, Pretoria, 0181",
  projectName: "Borehole Drilling, 1.5kW Submersible Pump & 5,000L JoJo Tank Backup System",
  siteAddress: "88 Ridge Road, Waterkloof, Pretoria",
  lineItems: [
    {
      id: "li-q1",
      itemNo: "01",
      description: "Drilling of borehole up to 80m depth including rig mobilization, foam injection & compressor",
      unit: "m",
      qty: 80,
      unitPrice: 950,
    },
    {
      id: "li-q2",
      itemNo: "02",
      description: "140mm Class 9 uPVC borehole casing with bottom end-cap, slotted intake screens & silica gravel pack",
      unit: "m",
      qty: 80,
      unitPrice: 390,
    },
    {
      id: "li-q3",
      itemNo: "03",
      description: "1.5kW High-head stainless steel submersible pump & motor with electronic dry-run controller",
      unit: "sum",
      qty: 1,
      unitPrice: 17500,
    },
    {
      id: "li-q4",
      itemNo: "04",
      description: "JoJo 5,000L vertical water storage tank (UV-stabilized, dark green) installed on 150mm slab",
      unit: "unit",
      qty: 1,
      unitPrice: 9800,
    },
    {
      id: "li-q5",
      itemNo: "05",
      description: "0.75kW Variable Speed Drive (VSD) constant-pressure booster pump with run-dry safety & plumbing",
      unit: "unit",
      qty: 1,
      unitPrice: 7600,
    },
    {
      id: "li-q6",
      itemNo: "06",
      description: "3-Stage Big Blue whole-house water filtration system (5µm sediment, activated carbon & 55W UV lamp)",
      unit: "system",
      qty: 1,
      unitPrice: 8900,
    },
  ],
  quotationTerms:
    "Quotation valid for 30 calendar days. 50% deposit required upon written acceptance to schedule drilling rig; remaining 50% due on commissioning and water flow verification.",
};

const SAMPLE_REPORT: DocumentState = {
  ...SAMPLE_INVOICE,
  mode: "report",
  docRef: "WL-REP-INS-2026-058",
  issueDate: "2026-09-20",
  insurerName: "Santam Commercial & Domestic Claims",
  claimNumber: "CLM-PWR-2026-77192",
  policyNumber: "POL-DOM-904128",
  dateOfLoss: "2026-09-18",
  inspectionDate: "2026-09-20",
  perilCause: "Severe Lightning Strike & Mains Electrical Surge",
  incidentSummary:
    "WaterLinks Borehole Services was instructed as specialist hydrological contractor to conduct an emergency electrical and diagnostic assessment of a non-operational borehole pumping installation following the thunderstorm on 18 September 2026.",
  technicalFindings:
    "1. Megger high-voltage insulation resistance test between motor stator windings and ground measured 0.02 MΩ (drastically below the 20 MΩ standard threshold), proving catastrophic dielectric breakdown from lightning surge.\n2. Submersible starter control box capacitor ruptured with high-voltage tracking marks across the contactor coil.\n3. Borehole sounder verified borehole total depth at 78m with static water level at 18.2m. Casing and aquifer remain clear and uncompromised.",
  consequentialAssessment:
    "All observed pump motor failure and control panel carbonization are directly attributable to sudden electrical lightning surge. No deferred maintenance or dry-run pump seizure identified. Complete motor, wet-end, and surge protector replacement is necessary to restore water supply.",
  photographicEvidenceLog:
    "Photo 1: Exploded start capacitor inside panel. Photo 2: Megger 0.02 MΩ insulation failure reading. Photo 3: Burnt motor lead terminal pin. Photo 4: Motor identification plate serial no. WL-DAB-110.",
  assessorName: "Jafta Kanero",
  assessorDesignation: "Master Hydrological & Pump Technician",
  assessorRegNo: "Borehole Association SA Reg: BA-GP-4192",
  lineItems: [
    {
      id: "li-r1",
      itemNo: "01",
      description: "Emergency site call-out, pump extraction from 65m depth & electrical Megger diagnostic test",
      unit: "sum",
      qty: 1,
      unitPrice: 2850,
    },
    {
      id: "li-r2",
      itemNo: "02",
      description: "Supply and install replacement 1.1kW DAB submersible motor & multi-stage pump wet-end",
      unit: "unit",
      qty: 1,
      unitPrice: 13900,
    },
    {
      id: "li-r3",
      itemNo: "03",
      description: "Heavy-duty 220V digital borehole starter panel with 25A Class 1+2 surge lightning arrestor module",
      unit: "unit",
      qty: 1,
      unitPrice: 3200,
    },
    {
      id: "li-r4",
      itemNo: "04",
      description: "Replace 65m 4-core submersible cable with resin-cast watertight submersible joint kit",
      unit: "sum",
      qty: 1,
      unitPrice: 2400,
    },
    {
      id: "li-r5",
      itemNo: "05",
      description: "Re-installation, commissioning, pressure testing & sanitary borehole seal cap fitment",
      unit: "sum",
      qty: 1,
      unitPrice: 1950,
    },
  ],
  notes:
    "Claim reinstatement figures reflect current regional Gauteng hydrological drilling and borehole equipment tariff schedules. Works can commence within 24 hours of insurer authorization.",
};

const SAMPLE_CERTIFICATE: DocumentState = {
  ...SAMPLE_INVOICE,
  mode: "certificate",
  docRef: "WL-BC-2026-089",
  issueDate: "09/24/2026",
  certClientName: "Mr J Kabuya",
  certAddress: "42 Equity Drive, Blairgowrie 2194, Coordinates: Randburg.",
  certGps: "Randburg (-26.0984° S, 28.0125° E)",
  certDateDrilled: "2026-06-02",
  certDateTested: "2026-10-09",
  certDepth: "80",
  certStaticWaterLevel: "15",
  certDynamicWaterLevel: "38",
  certYield: "6400",
  certCasingDiameter: "140",
  certCasingDepth: "18",
  certPumpInstalled: true,
  certPumpType: "1.1kW Submersible (220V Single Phase)",
  certPumpDepth: "70",
  certControlBox: "Digital Dry-run Protection + 20A Surg",
  certPipingSpec: "32mm Class 12 HDPE Poly Pipe · 2.5mm² 4-Core Submersible Cable",
  certDrilledBy: "Jafta Kanero",
  certDrillerDesignation: "Lead Drilling & Pump Specialist",
  certDrillerSignature: "Jafta Kanero",
  certAuthorizerName: "WaterLinks Operations Desk",
  certAuthorizerSignature: "Wata Kanero",
  certStatement:
    "This borehole has been developed and tested and is confirmed to be in good working condition and suitable for use. The yield is as stated above at the time of testing.",
};

const uid = () => Math.random().toString(36).slice(2, 9);

/* ────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────── */

export default function DocumentStudio() {
  const [data, setData] = useState<DocumentState>(SAMPLE_CERTIFICATE);

  /* ── Currency Formatter ──────────────────────────────────────── */
  const formatCurrency = useCallback(
    (amount: number) => {
      const sym =
        data.currency === "USD"
          ? "$"
          : data.currency === "EUR"
            ? "€"
            : data.currency === "GBP"
              ? "£"
              : "R";

      const formattedNum = new Intl.NumberFormat("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return `${sym} ${formattedNum}`;
    },
    [data.currency]
  );

  /* ── Derived Financial Computations ──────────────────────────── */
  const subtotal = useMemo(
    () =>
      data.lineItems.reduce(
        (sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0),
        0
      ),
    [data.lineItems]
  );

  const taxAmount = useMemo(
    () => subtotal * ((data.taxRate || 0) / 100),
    [subtotal, data.taxRate]
  );

  const grandTotal = useMemo(
    () => Math.max(0, subtotal + taxAmount - (data.discount || 0)),
    [subtotal, taxAmount, data.discount]
  );

  /* ── Mode Switching ──────────────────────────────────────────── */
  const handleModeChange = (newMode: DocumentMode) => {
    if (newMode === "invoice") {
      setData((prev) => ({
        ...prev,
        mode: "invoice",
        docRef: prev.docRef.startsWith("WL-INV") ? prev.docRef : "WL-INV-1084",
      }));
    } else if (newMode === "quotation") {
      setData((prev) => ({
        ...prev,
        mode: "quotation",
        docRef: prev.docRef.startsWith("WL-QT") ? prev.docRef : "WL-QT-2026-412",
        validUntil: prev.validUntil || "2026-11-01",
      }));
    } else if (newMode === "report") {
      setData((prev) => ({
        ...prev,
        mode: "report",
        docRef: prev.docRef.startsWith("WL-REP") ? prev.docRef : "WL-REP-INS-2026-058",
      }));
    } else if (newMode === "certificate") {
      setData((prev) => ({
        ...prev,
        mode: "certificate",
        docRef: prev.docRef.startsWith("WL-BC") ? prev.docRef : "WL-BC-2026-089",
      }));
    }
  };

  /* ── State Handlers ──────────────────────────────────────────── */
  const updateField = <K extends keyof DocumentState>(
    field: K,
    value: DocumentState[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (id: string, patch: Partial<LineItem>) => {
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  };

  const addLineItem = (presetDescription?: string, unit = "m", price = 0) => {
    const nextIdx = (data.lineItems.length + 1).toString().padStart(2, "0");
    setData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          id: uid(),
          itemNo: nextIdx,
          description: presetDescription || "",
          unit: unit,
          qty: 1,
          unitPrice: price,
        },
      ],
    }));
  };

  const removeLineItem = (id: string) => {
    if (data.lineItems.length <= 1) return;
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems
        .filter((item) => item.id !== id)
        .map((item, idx) => ({
          ...item,
          itemNo: (idx + 1).toString().padStart(2, "0"),
        })),
    }));
  };

  const handleReset = () => {
    if (data.mode === "certificate") {
      setData((prev) => ({
        ...prev,
        certClientName: "",
        certAddress: "",
        certGps: "",
        certDateDrilled: new Date().toISOString().split("T")[0],
        certDateTested: new Date().toISOString().split("T")[0],
        certDepth: "0",
        certStaticWaterLevel: "0",
        certDynamicWaterLevel: "0",
        certYield: "0",
        certCasingDiameter: "140",
        certCasingDepth: "0",
        certPumpInstalled: false,
        certPumpType: "",
        certPumpDepth: "0",
      }));
    } else {
      setData({
        ...data,
        docRef:
          data.mode === "report"
            ? `WL-REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
            : data.mode === "quotation"
              ? `WL-QT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
              : `WL-INV-${Math.floor(1000 + Math.random() * 9000)}`,
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        clientCompany: "",
        contactPerson: "",
        billingEmail: "",
        clientAddress: "",
        clientVat: "",
        projectName: "",
        siteAddress: "",
        poNumber: "",
        taxRate: 15,
        discount: 0,
        lineItems: [
          {
            id: uid(),
            itemNo: "01",
            description: "",
            unit: "m",
            qty: 1,
            unitPrice: 0,
          },
        ],
      });
    }
  };

  const handleLoadSample = () => {
    if (data.mode === "invoice") setData(SAMPLE_INVOICE);
    else if (data.mode === "quotation") setData(SAMPLE_QUOTATION);
    else if (data.mode === "report") setData(SAMPLE_REPORT);
    else setData(SAMPLE_CERTIFICATE);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen hydrological-grid print:bg-white print:min-h-0 text-[#0f172a] font-sans pb-16 print:pb-0">
      {/* ═══════════════════════════════════════════════════════════
          PERSISTENT TOP DRAFTING TOOLBAR
          ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#06101e]/95 backdrop-blur-md border-b border-sky-900/60 text-white shadow-2xl print:hidden">
        <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6">
          {/* Top Row: Brand + Controls */}
          <div className="flex items-center justify-between gap-2">
            {/* Brand & Studio Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <a
                href="../index.html"
                title="Return to main WaterLinks website"
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-sky-950/80 hover:bg-sky-900 border border-sky-700/50 text-[11px] font-semibold text-sky-300 transition-colors shrink-0"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="hidden sm:inline">Website</span>
              </a>

              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/25 to-sky-500/20 border border-amber-400/40 text-amber-300">
                <Award className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-white truncate">
                    WaterLinks Studio
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-400/30 shrink-0">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    CERTIFICATE &amp; BILLING ENGINE
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-300 font-mono truncate">
                  BOREHOLE SPEC CERTIFICATES · INVOICES · QUOTATIONS · DAMAGE REPORTS
                </p>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Currency Selector (Hidden in Certificate mode) */}
              {data.mode !== "certificate" && (
                <div className="hidden lg:flex items-center gap-1 rounded-lg bg-slate-900/90 border border-slate-700 px-2 py-1 text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    Currency:
                  </span>
                  <select
                    value={data.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                    className="bg-transparent font-mono font-semibold text-white outline-none cursor-pointer text-xs"
                  >
                    <option value="ZAR" className="bg-slate-900 text-white">ZAR (R)</option>
                    <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
                    <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
                    <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
                  </select>
                </div>
              )}

              {/* Template loader */}
              <button
                onClick={handleLoadSample}
                title={`Load sample ${data.mode}`}
                className="flex items-center gap-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-600/60 px-2.5 py-1.5 text-xs font-semibold text-amber-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Load Sample</span>
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                title="Reset fields"
                className="flex items-center gap-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Print or Save PDF */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-black tracking-tight shadow-md hover:shadow-amber-400/25 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-950" />
                <span>Print / Save PDF</span>
                <kbd className="hidden xl:inline-block ml-1 rounded bg-amber-500/30 px-1 py-0.5 text-[10px] font-mono text-slate-950 font-semibold">
                  Ctrl+P
                </kbd>
              </button>
            </div>
          </div>

          {/* Bottom Row: 4-Way Mode Switcher */}
          <div className="mt-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide pt-1 border-t border-sky-950/80">
            <div className="flex items-center bg-[#091526] border border-sky-900/50 rounded-lg p-0.5 shadow-inner shrink-0">
              <button
                onClick={() => handleModeChange("certificate")}
                className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1 text-[11px] sm:text-xs rounded-md transition-all cursor-pointer ${
                  data.mode === "certificate"
                    ? "bg-gradient-to-r from-[#dfb76c] via-[#f7e4af] to-[#dfb76c] text-[#071a33] shadow-md font-black ring-1 ring-amber-300"
                    : "text-amber-300/90 hover:text-amber-200 font-semibold"
                }`}
              >
                <Award className="h-3.5 w-3.5 text-[#071a33]" />
                <span>Borehole Certificate</span>
                <span className="hidden sm:inline-block ml-0.5 px-1 py-0.2 bg-[#071a33] text-amber-300 rounded text-[8.5px] font-mono font-bold">LUXURY SPEC</span>
              </button>
              <button
                onClick={() => handleModeChange("invoice")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-md transition-all cursor-pointer ${
                  data.mode === "invoice"
                    ? "bg-sky-500 text-slate-950 shadow-sm font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Tax Invoice</span>
              </button>
              <button
                onClick={() => handleModeChange("quotation")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-md transition-all cursor-pointer ${
                  data.mode === "quotation"
                    ? "bg-sky-500 text-slate-950 shadow-sm font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <ClipboardList className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Quotation</span>
              </button>
              <button
                onClick={() => handleModeChange("report")}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-md transition-all cursor-pointer ${
                  data.mode === "report"
                    ? "bg-sky-500 text-slate-950 shadow-sm font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Insurance Report</span>
              </button>
            </div>

            {/* Mode indicator pill */}
            <span className="hidden sm:inline text-[10px] font-mono text-amber-300/90 shrink-0">
              {data.mode === "certificate"
                ? "BOREHOLE COMPLIANCE & SPEC CERTIFICATE"
                : data.mode === "invoice"
                  ? "WATERLINKS TAX INVOICE"
                  : data.mode === "quotation"
                    ? "BOREHOLE SPEC & WORK QUOTE"
                    : "PUMP & DAMAGE ASSESSMENT"}
            </span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          A4 PAPER CANVAS CONTAINER
          ═══════════════════════════════════════════════════════════ */}
      <main className="mx-auto max-w-[210mm] mt-4 sm:mt-6 px-2 sm:px-0 print:m-0 print:p-0 print:max-w-none">
        {/* Canvas Dimension Indicator (Screen Only) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5 px-2 print:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="uppercase text-amber-200">
              ACTIVE MODE: {data.mode === "certificate" ? "Luxury Borehole Spec Certificate" : data.mode === "invoice" ? "Tax Invoice" : data.mode === "quotation" ? data.quotationTitle : "Insurance Damage Assessment Report"}
            </span>
          </div>
          <span className="text-slate-400">A4 VECTOR READY · SANS 10299 HYDROLOGICAL COMPLIANT</span>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            MODE 4: LUXURY GOLD & ROYAL NAVY BOREHOLE CERTIFICATE
            ═══════════════════════════════════════════════════════════ */}
        {data.mode === "certificate" ? (
          <div className="relative bg-[#061838] text-white rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.65),0_0_0_2px_rgba(223,183,108,0.4)] p-6 sm:p-9 border-[3px] border-[#c59b27] ring-1 ring-[#f5d77f]/40 cert-print-exact print:p-5 print:rounded-none print:shadow-none">
            {/* Subtle Royal Damask / Aquifer Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#dfb76c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

            {/* Architectural Corner Mechanical / Riveted Brackets */}
            {/* Top-Left */}
            <div className="absolute top-1.5 left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#dfb76c] flex items-start justify-start p-0.5 pointer-events-none select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#fff3d1] to-[#b88628] shadow-xs"></div>
            </div>
            {/* Top-Right */}
            <div className="absolute top-1.5 right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#dfb76c] flex items-start justify-end p-0.5 pointer-events-none select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#fff3d1] to-[#b88628] shadow-xs"></div>
            </div>
            {/* Bottom-Left */}
            <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#dfb76c] flex items-end justify-start p-0.5 pointer-events-none select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#fff3d1] to-[#b88628] shadow-xs"></div>
            </div>
            {/* Bottom-Right */}
            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#dfb76c] flex items-end justify-end p-0.5 pointer-events-none select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#fff3d1] to-[#b88628] shadow-xs"></div>
            </div>

            {/* Inner Golden Hairline Frame */}
            <div className="absolute inset-3 border border-[#dfb76c]/40 pointer-events-none rounded-sm"></div>

            {/* ─────────────────────────────────────────────────────────
                1. TOP METALLIC BRUSHED BRASS / GOLD HEADER PLAQUE
                ───────────────────────────────────────────────────────── */}
            <div className="relative gold-brass-plate rounded-md p-3 sm:p-4 text-[#071a33] mb-3.5 border-2 border-[#8d661b] shadow-lg">
              {/* Four Corner Rivets on the Plaque */}
              <div className="absolute top-1.5 left-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#fff4d1] to-[#7c5415] border border-[#52370c] shadow-xs flex items-center justify-center text-[7px] text-[#3d2708] font-bold">✕</div>
              <div className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#fff4d1] to-[#7c5415] border border-[#52370c] shadow-xs flex items-center justify-center text-[7px] text-[#3d2708] font-bold">✕</div>
              <div className="absolute bottom-1.5 left-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#fff4d1] to-[#7c5415] border border-[#52370c] shadow-xs flex items-center justify-center text-[7px] text-[#3d2708] font-bold">✕</div>
              <div className="absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#fff4d1] to-[#7c5415] border border-[#52370c] shadow-xs flex items-center justify-center text-[7px] text-[#3d2708] font-bold">✕</div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 sm:px-3">
                {/* Left Side: WL Medallion + Company Info */}
                <div className="flex items-center gap-3">
                  {/* WL Circular Medallion Emblem */}
                  <div className="relative h-15 w-15 sm:h-18 sm:w-18 shrink-0 rounded-full border-2 border-[#8d661b] p-0.5 bg-gradient-to-br from-[#fff4d1] via-[#c8953c] to-[#7c5415] shadow-md flex items-center justify-center">
                    <div className="h-full w-full rounded-full bg-[#082046] flex flex-col items-center justify-center text-[#dfb76c] border border-[#f5d77f]">
                      <Droplets className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#f5d77f] mb-0.5" />
                      <span className="font-serif font-black text-sm sm:text-base tracking-tighter leading-none text-[#fff3d1]">
                        WL
                      </span>
                      <span className="text-[5.5px] tracking-widest uppercase font-mono text-[#f5d77f]">EST. 2021</span>
                    </div>
                  </div>

                  <div>
                    <h1 className="font-serif text-lg sm:text-2xl font-black tracking-tight text-[#061a35] uppercase leading-tight">
                      WATERLINKS BOREHOLE SERVICES
                    </h1>
                    <p className="text-[9.5px] sm:text-[10.5px] font-black tracking-wider uppercase text-[#0d2a52] mt-0.5">
                      QUALITY WORK · RELIABLE GROUNDWATER SOLUTIONS
                    </p>
                    <p className="text-[9.5px] sm:text-[10px] text-[#14325a] font-sans font-semibold mt-0.5">
                      Tel: {data.companyPhone} &nbsp;|&nbsp; Email: {data.companyEmail}
                    </p>
                    <p className="text-[9px] sm:text-[9.5px] text-[#14325a] font-mono">
                      {data.companyWebsite} &nbsp;|&nbsp; {data.companyAddress}
                    </p>
                  </div>
                </div>

                {/* Right Side: Official Record Badge & Metadata */}
                <div className="sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-[#8d661b]/30 pt-2 sm:pt-0 sm:pl-3">
                  <div className="inline-block bg-[#071d3d] text-[#f5d77f] px-2 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase shadow-xs mb-1">
                    OFFICIAL RECORD
                  </div>
                  <div className="text-[11px] text-[#071d3d] space-y-0.5">
                    <div className="flex items-center sm:justify-end gap-1.5 font-mono">
                      <span className="font-bold text-[9.5px] uppercase text-[#33220a]">CERT NO:</span>
                      <input
                        type="text"
                        value={data.docRef}
                        onChange={(e) => updateField("docRef", e.target.value)}
                        className="w-28 text-right font-mono font-black text-xs text-[#061a35] outline-none bg-transparent"
                      />
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 font-mono">
                      <span className="font-bold text-[9.5px] uppercase text-[#33220a]">ISSUE DATE:</span>
                      <input
                        type="text"
                        value={data.issueDate}
                        onChange={(e) => updateField("issueDate", e.target.value)}
                        className="w-28 text-right font-mono font-bold text-[11px] text-[#061a35] outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                2. SUB-HEADER GOLD-BORDERED NAVY PLAQUE
                ───────────────────────────────────────────────────────── */}
            <div className="relative bg-[#071e44] border border-[#dfb76c] rounded py-1 px-3 mb-3 text-center shadow-md flex items-center justify-center">
              <span className="text-[10px] sm:text-[11px] font-serif font-bold text-[#f5d77f] tracking-widest uppercase">
                ✦ OFFICIAL HYDROLOGICAL DRILLING &amp; TESTING RECORD ✦
              </span>
            </div>

            {/* ─────────────────────────────────────────────────────────
                3. BOREHOLE CERTIFICATE EMBOSSED TITLE
                ───────────────────────────────────────────────────────── */}
            <div className="text-center my-3 pb-2 border-b border-[#dfb76c]/40">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-widest uppercase mb-1 gold-text-metallic">
                BOREHOLE CERTIFICATE
              </h2>
              <p className="text-[10px] sm:text-xs font-semibold text-[#f5e6c4] tracking-wide uppercase max-w-xl mx-auto leading-relaxed">
                THIS IS TO CERTIFY THAT THE BOREHOLE DESCRIBED BELOW HAS BEEN SUCCESSFULLY DRILLED, DEVELOPED AND TESTED.
              </p>
            </div>

            {/* ─────────────────────────────────────────────────────────
                4. SPECIFICATIONS MATRIX TABLE (GOLD HAIRLINE GRID)
                ───────────────────────────────────────────────────────── */}
            <div className="border-2 border-[#b88c2f] rounded overflow-hidden my-4 shadow-xl text-xs divide-y divide-[#b88c2f]/70 bg-[#071a38]">
              {/* Row 1: Client Name */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#071830]/95">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  CLIENT NAME:
                </div>
                <div className="p-1.5 flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. Mr J Kabuya"
                    value={data.certClientName}
                    onChange={(e) => updateField("certClientName", e.target.value)}
                    className="w-full font-bold text-white px-1 text-xs outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 2: Address */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#091f3e]/85">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  ADDRESS:
                </div>
                <div className="p-1.5 flex items-center">
                  <input
                    type="text"
                    placeholder="42 Equity Drive, Blairgowrie 2194, Coordinates: Randburg."
                    value={data.certAddress}
                    onChange={(e) => updateField("certAddress", e.target.value)}
                    className="w-full text-slate-100 px-1 text-xs outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 3: GPS Coordinates */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#071830]/95">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  GPS COORDINATES:
                </div>
                <div className="p-1.5 flex items-center">
                  <input
                    type="text"
                    placeholder="Randburg (-26.0984° S, 28.0125° E)"
                    value={data.certGps}
                    onChange={(e) => updateField("certGps", e.target.value)}
                    className="w-full font-mono text-slate-100 px-1 text-xs outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 4: Date Drilled */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#091f3e]/85">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  DATE DRILLED:
                </div>
                <div className="p-1.5 flex items-center">
                  <input
                    type="text"
                    placeholder="2026-06-02"
                    value={data.certDateDrilled}
                    onChange={(e) => updateField("certDateDrilled", e.target.value)}
                    className="w-full font-mono text-slate-100 px-1 text-xs outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 5: Date of Test */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#071830]/95">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  DATE OF TEST:
                </div>
                <div className="p-1.5 flex items-center">
                  <input
                    type="text"
                    placeholder="2026-10-09"
                    value={data.certDateTested}
                    onChange={(e) => updateField("certDateTested", e.target.value)}
                    className="w-full font-mono text-slate-100 px-1 text-xs outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 6: Borehole Depth */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#091f3e]/85">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  BOREHOLE DEPTH:
                </div>
                <div className="p-1.5 flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="80"
                    value={data.certDepth}
                    onChange={(e) => updateField("certDepth", e.target.value)}
                    className="w-36 font-bold text-white px-1 text-xs outline-none bg-transparent font-mono"
                  />
                  <span className="text-[10px] font-bold tracking-wider text-[#dfb76c] uppercase font-sans mr-2">
                    METERS
                  </span>
                </div>
              </div>

              {/* Row 7: Static Water Level */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#071830]/95">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  STATIC WATER LEVEL:
                </div>
                <div className="p-1.5 flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="15"
                    value={data.certStaticWaterLevel}
                    onChange={(e) => updateField("certStaticWaterLevel", e.target.value)}
                    className="w-36 font-bold text-white px-1 text-xs outline-none bg-transparent font-mono"
                  />
                  <span className="text-[10px] font-bold tracking-wider text-[#dfb76c] uppercase font-sans mr-2">
                    METERS
                  </span>
                </div>
              </div>

              {/* Row 8: Dynamic Level */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#091f3e]/85">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  DYNAMIC LEVEL:
                </div>
                <div className="p-1.5 flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="38"
                    value={data.certDynamicWaterLevel}
                    onChange={(e) => updateField("certDynamicWaterLevel", e.target.value)}
                    className="w-36 font-bold text-white px-1 text-xs outline-none bg-transparent font-mono"
                  />
                  <span className="text-[10px] font-bold tracking-wider text-[#dfb76c] uppercase font-sans mr-2">
                    METERS (AT PEAK YIELD)
                  </span>
                </div>
              </div>

              {/* Row 9: Yield (Tested) */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#071830]/95">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  YIELD (TESTED):
                </div>
                <div className="p-1.5 flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="6400"
                    value={data.certYield}
                    onChange={(e) => updateField("certYield", e.target.value)}
                    className="w-36 font-bold text-cyan-300 px-1 text-sm outline-none bg-transparent font-mono"
                  />
                  <span className="text-[10.5px] font-black tracking-wider text-cyan-400 uppercase font-sans mr-2">
                    LITRES PER HOUR (L/HR)
                  </span>
                </div>
              </div>

              {/* Row 10: Casing Spec */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#091f3e]/85">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  CASING SPEC:
                </div>
                <div className="p-1.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#f5d77f] uppercase font-bold">DIAMETER:</span>
                    <input
                      type="text"
                      placeholder="140"
                      value={data.certCasingDiameter}
                      onChange={(e) => updateField("certCasingDiameter", e.target.value)}
                      className="w-12 font-mono font-bold text-white outline-none bg-transparent"
                    />
                    <span className="text-[10.5px] text-slate-300">mm</span>
                  </div>
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="text-[10px] text-[#f5d77f] uppercase font-bold">INSTALLED CASING DEPTH:</span>
                    <input
                      type="text"
                      placeholder="18"
                      value={data.certCasingDepth}
                      onChange={(e) => updateField("certCasingDepth", e.target.value)}
                      className="w-12 font-mono font-bold text-white outline-none text-right bg-transparent"
                    />
                    <span className="text-[10.5px] text-slate-300">meters</span>
                  </div>
                </div>
              </div>

              {/* Row 11: Pump Installed & Type */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#071830]/95">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  PUMP INSTALLED:
                </div>
                <div className="p-1.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateField("certPumpInstalled", true)}
                      className="flex items-center gap-1 cursor-pointer font-bold text-white text-[11px]"
                    >
                      {data.certPumpInstalled ? (
                        <CheckSquare className="h-4 w-4 text-[#f5d77f]" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-500" />
                      )}
                      <span>YES</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("certPumpInstalled", false)}
                      className="flex items-center gap-1 cursor-pointer font-bold text-white text-[11px]"
                    >
                      {!data.certPumpInstalled ? (
                        <CheckSquare className="h-4 w-4 text-[#f5d77f]" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-500" />
                      )}
                      <span>NO</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-1 max-w-sm justify-end mr-2">
                    <span className="text-[10px] font-bold text-[#f5d77f] uppercase">PUMP TYPE:</span>
                    <input
                      type="text"
                      placeholder="1.1kW Submersible (220V Single Phase)"
                      value={data.certPumpType}
                      onChange={(e) => updateField("certPumpType", e.target.value)}
                      className="w-56 font-semibold text-white outline-none bg-[#092247] px-1.5 py-0.5 rounded border border-[#b88c2f]/60 text-xs print:border-0"
                    />
                  </div>
                </div>
              </div>

              {/* Row 12: Install Specs */}
              <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] bg-[#091f3e]/85">
                <div className="p-2 font-bold text-[#f5d77f] uppercase tracking-wider border-r border-[#b88c2f]/70 flex items-center text-[11px]">
                  INSTALL SPECS:
                </div>
                <div className="p-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#f5d77f] uppercase font-bold">PUMP DEPTH:</span>
                    <input
                      type="text"
                      value={data.certPumpDepth}
                      onChange={(e) => updateField("certPumpDepth", e.target.value)}
                      className="w-12 font-mono font-bold text-white outline-none bg-transparent"
                    />
                    <span className="text-[10.5px] text-slate-300">m</span>
                  </div>
                  <div className="flex items-center gap-1.5 mr-2 flex-1 max-w-xs justify-end">
                    <span className="text-[10px] text-[#f5d77f] uppercase font-bold">CONTROL &amp; SURGE:</span>
                    <input
                      type="text"
                      value={data.certControlBox}
                      onChange={(e) => updateField("certControlBox", e.target.value)}
                      className="w-48 text-[11px] text-slate-200 outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                5. CONFIRMATION DECLARATION PARAGRAPH
                ───────────────────────────────────────────────────────── */}
            <div className="my-3 text-center px-4">
              <p className="text-[11px] sm:text-xs font-serif italic text-[#f5e6c4] leading-relaxed">
                &ldquo;{data.certStatement}&rdquo;
              </p>
            </div>

            {/* ─────────────────────────────────────────────────────────
                6. SIGNATURE, 3D WAX MEDALLION SEAL & VERIFICATION BLOCK
                ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-3 mt-2 border-t border-[#dfb76c]/40">
              {/* Drilled By & Signature */}
              <div className="text-left space-y-1">
                <span className="text-[10px] font-bold text-[#f5d77f] uppercase tracking-wider block">
                  DRILLED BY:
                </span>
                <div className="h-10 flex items-end">
                  <span className="font-signature text-3xl sm:text-4xl text-[#38bdf8] select-none drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                    {data.certDrillerSignature || "Jafta Kanero"}
                  </span>
                </div>
                <div className="border-b-2 border-[#dfb76c] w-full mb-1"></div>
                <input
                  type="text"
                  value={data.certDrilledBy}
                  onChange={(e) => updateField("certDrilledBy", e.target.value)}
                  className="font-bold text-xs text-white outline-none w-full bg-transparent"
                />
                <p className="text-[9.5px] text-[#dfb76c]">{data.certDrillerDesignation}</p>
              </div>

              {/* 3D Wax Seal / Royal Blue Medallion */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative h-26 w-26 rounded-full border-4 border-[#dfb76c] wax-seal-3d flex items-center justify-center p-1 shadow-2xl rotate-[-2deg] print:rotate-0">
                  <div className="h-full w-full rounded-full border border-dashed border-[#f5d77f]/80 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[6.5px] font-black uppercase text-[#f5d77f] tracking-widest">
                      WATERLINKS
                    </span>
                    <span className="text-[5px] font-bold text-[#dfb76c] uppercase">
                      QUALITY WORK
                    </span>
                    <div className="relative my-0.5 flex flex-col items-center">
                      <Droplets className="h-3 w-3 text-[#f5d77f]" />
                      <span className="font-serif font-black text-xs tracking-tight text-[#fff3d1] leading-none">
                        WL
                      </span>
                    </div>
                    <span className="text-[5px] font-bold text-[#dfb76c] uppercase">
                      WATER IS LIFE
                    </span>
                    <span className="text-[5.5px] font-mono text-[#f5d77f] font-bold">
                      ★ CERTIFIED ★
                    </span>
                  </div>
                </div>
                <span className="text-[7.5px] font-mono uppercase text-[#dfb76c]/80 tracking-widest mt-1">
                  OFFICIAL COMPANY STAMP
                </span>
              </div>

              {/* Date & Authorization with Cursive Counter-Signature */}
              <div className="text-right space-y-1">
                <span className="text-[10px] font-bold text-[#f5d77f] uppercase tracking-wider block">
                  DATE OF ISSUE:
                </span>
                <div className="h-10 flex items-end justify-end">
                  <span className="font-signature text-3xl sm:text-4xl text-[#38bdf8] select-none drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                    {data.certAuthorizerSignature || "Wata Kanero"}
                  </span>
                </div>
                <div className="border-b-2 border-[#dfb76c] w-full mb-1"></div>
                <div className="text-right">
                  <input
                    type="text"
                    value={data.certDateTested}
                    onChange={(e) => updateField("certDateTested", e.target.value)}
                    className="font-mono text-xs font-bold text-white text-right outline-none bg-transparent"
                  />
                  <span className="text-[9.5px] font-bold text-[#f5d77f] uppercase block">
                    WATERLINKS OPERATIONS DESK
                  </span>
                  <span className="text-[9px] font-mono text-slate-300">REG: {data.companyReg}</span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                7. BOTTOM SERVICES RIBBON
                ───────────────────────────────────────────────────────── */}
            <div className="mt-4 bg-[#071e44] border border-[#dfb76c] text-[#f5d77f] py-1.5 px-3 rounded flex flex-wrap items-center justify-around text-[9px] sm:text-[10px] font-bold tracking-wider uppercase shadow-inner">
              <span className="flex items-center gap-1">
                <Cog className="h-3 w-3 text-[#f5d77f]" /> BOREHOLE DRILLING
              </span>
              <span className="text-[#dfb76c]/60">|</span>
              <span className="flex items-center gap-1">
                <Wrench className="h-3 w-3 text-[#f5d77f]" /> PUMP INSTALLATION
              </span>
              <span className="text-[#dfb76c]/60">|</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#f5d77f]" /> MAINTENANCE
              </span>
              <span className="text-[#dfb76c]/60">|</span>
              <span className="flex items-center gap-1">
                <Droplets className="h-3 w-3 text-[#f5d77f]" /> WATER SOLUTIONS
              </span>
            </div>

            {/* ─────────────────────────────────────────────────────────
                8. SLOGAN FOOTER
                ───────────────────────────────────────────────────────── */}
            <div className="mt-2 text-center">
              <span className="font-serif italic text-xs font-bold text-[#f5d77f] tracking-widest">
                Quality Work. Reliable Water.
              </span>
            </div>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════
             MODES 1, 2, 3: INVOICE, QUOTATION, DAMAGE REPORT
             ═══════════════════════════════════════════════════════════ */
          <div className="relative bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.1)] p-6 sm:p-8 print:p-5 print:rounded-none print:shadow-none">
            {/* Subtle Registration Marks */}
            <div className="absolute top-2 left-2 text-slate-300 font-mono text-[10px] select-none pointer-events-none print:hidden">+</div>
            <div className="absolute top-2 right-2 text-slate-300 font-mono text-[10px] select-none pointer-events-none print:hidden">+</div>
            <div className="absolute bottom-2 left-2 text-slate-300 font-mono text-[10px] select-none pointer-events-none print:hidden">+</div>
            <div className="absolute bottom-2 right-2 text-slate-300 font-mono text-[10px] select-none pointer-events-none print:hidden">+</div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 1: DOCUMENT HEADER & WATERLINKS LETTERHEAD
                ───────────────────────────────────────────────────────── */}
            <div className="border-b-2 border-sky-950 pb-3 mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: WaterLinks Official Letterhead */}
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-14 shrink-0 bg-sky-950 rounded-md p-1.5 flex items-center justify-center shadow-sm">
                    <Droplets className="h-7 w-7 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h1 className="font-display text-xl font-black tracking-tight text-sky-950 uppercase">
                        {data.companyName}
                      </h1>
                    </div>
                    <p className="text-[10px] font-semibold tracking-wider text-sky-800 uppercase">
                      {data.companySubtitle}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] text-slate-600 font-sans">
                      <span>
                        <strong className="font-semibold text-slate-800">Reg:</strong> {data.companyReg}
                      </span>
                      <span>·</span>
                      <span>
                        <strong className="font-semibold text-slate-800">VAT:</strong> {data.companyVat}
                      </span>
                      <span>·</span>
                      <span>
                        <strong className="font-semibold text-slate-800">Tel:</strong> {data.companyPhone}
                      </span>
                      <span>·</span>
                      <span>{data.companyEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Document Title Badge & Metadata */}
                <div className="sm:text-right shrink-0">
                  <div className="flex items-center sm:justify-end gap-2 mb-1">
                    <span className="font-display text-sm sm:text-base font-black tracking-tight text-sky-950 uppercase">
                      {data.mode === "invoice"
                        ? "TAX INVOICE"
                        : data.mode === "quotation"
                          ? data.quotationTitle
                          : "DAMAGE ASSESSMENT REPORT"}
                    </span>
                    <span className="inline-block rounded bg-sky-900 text-white px-1.5 py-0.2 text-[9px] font-mono tracking-wider font-semibold">
                      {data.mode === "invoice" ? "ORIGINAL" : data.mode === "quotation" ? "OFFICIAL QUOTE" : "OFFICIAL"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:text-right">
                    {/* Doc Reference Number */}
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        {data.mode === "invoice" ? "Inv Ref:" : data.mode === "quotation" ? "Quote Ref:" : "Report #:"}
                      </span>
                      <input
                        type="text"
                        value={data.docRef}
                        onChange={(e) => updateField("docRef", e.target.value)}
                        className="w-28 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-right font-mono text-xs font-bold text-sky-950 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                      />
                    </div>

                    {/* Date */}
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        Date:
                      </span>
                      <input
                        type="date"
                        value={data.issueDate}
                        onChange={(e) => updateField("issueDate", e.target.value)}
                        className="w-28 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-right font-mono text-[11px] text-slate-900 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                      />
                    </div>

                    {/* Mode-specific Dates / Terms */}
                    {data.mode === "invoice" && (
                      <>
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            Due:
                          </span>
                          <input
                            type="date"
                            value={data.dueDate}
                            onChange={(e) => updateField("dueDate", e.target.value)}
                            className="w-28 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-right font-mono text-[11px] font-semibold text-slate-900 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                          />
                        </div>
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            Terms:
                          </span>
                          <input
                            type="text"
                            value={data.paymentTerms}
                            onChange={(e) => updateField("paymentTerms", e.target.value)}
                            className="w-28 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-right text-[11px] text-slate-700 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                          />
                        </div>
                      </>
                    )}

                    {data.mode === "quotation" && (
                      <>
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            Valid Until:
                          </span>
                          <input
                            type="date"
                            value={data.validUntil}
                            onChange={(e) => updateField("validUntil", e.target.value)}
                            className="w-28 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-right font-mono text-[11px] font-semibold text-slate-900 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                          />
                        </div>
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            Deposit:
                          </span>
                          <div className="flex items-center gap-1 justify-end">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={data.depositPercentage}
                              onChange={(e) => updateField("depositPercentage", parseFloat(e.target.value) || 0)}
                              className="w-12 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-center font-mono text-[11px] text-slate-900 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                            />
                            <span className="text-[10px] font-mono text-slate-500">% req.</span>
                          </div>
                        </div>
                      </>
                    )}

                    {data.mode === "report" && (
                      <>
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            Loss Date:
                          </span>
                          <input
                            type="date"
                            value={data.dateOfLoss}
                            onChange={(e) => updateField("dateOfLoss", e.target.value)}
                            className="w-28 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-right font-mono text-[11px] font-semibold text-slate-900 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                          />
                        </div>
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                            Inspected:
                          </span>
                          <input
                            type="date"
                            value={data.inspectionDate}
                            onChange={(e) => updateField("inspectionDate", e.target.value)}
                            className="w-28 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-right font-mono text-[11px] font-semibold text-slate-900 outline-none focus:border-sky-900 focus:bg-white print:border-0 print:bg-transparent print:p-0"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 2: CLIENT & PROJECT / SITE SPECIFICATION GRID
                ───────────────────────────────────────────────────────── */}
            {data.mode !== "report" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
                {/* Box A: Client Details */}
                <div className="rounded-md border border-sky-100 bg-sky-50/30 p-2.5 print:border-slate-300 print:bg-transparent print:p-0">
                  <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-sky-200/80">
                    <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950">
                      BILL TO / CLIENT DETAILS
                    </span>
                    <span className="text-[9px] font-mono text-sky-700 print:hidden">ENTITY</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="Client / Company Name *"
                        value={data.clientCompany}
                        onChange={(e) => updateField("clientCompany", e.target.value)}
                        className="w-full rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        placeholder="Attn: Contact Person"
                        value={data.contactPerson}
                        onChange={(e) => updateField("contactPerson", e.target.value)}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0"
                      />
                      <input
                        type="email"
                        placeholder="Contact Email"
                        value={data.billingEmail}
                        onChange={(e) => updateField("billingEmail", e.target.value)}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-mono text-slate-700 placeholder:text-slate-400 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0"
                      />
                    </div>
                    <div className="grid grid-cols-[1fr_7rem] gap-1.5">
                      <input
                        type="text"
                        placeholder="Physical Property / Billing Address"
                        value={data.clientAddress}
                        onChange={(e) => updateField("clientAddress", e.target.value)}
                        className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 placeholder:text-slate-400 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0"
                      />
                      <div className="flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 print:border-0 print:p-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">VAT:</span>
                        <input
                          type="text"
                          placeholder="e.g. 4820194821"
                          value={data.clientVat}
                          onChange={(e) => updateField("clientVat", e.target.value)}
                          className="w-full font-mono text-[11px] text-slate-700 placeholder:text-slate-400 outline-none print:p-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box B: Project & Borehole Site Specification */}
                <div className="rounded-md border border-sky-100 bg-sky-50/30 p-2.5 print:border-slate-300 print:bg-transparent print:p-0">
                  <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-sky-200/80">
                    <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950">
                      PROJECT &amp; BOREHOLE SITE SPECIFICATION
                    </span>
                    <span className="text-[9px] font-mono text-sky-700 print:hidden">SITE SCOPE</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="Project Scope / Borehole Installation *"
                        value={data.projectName}
                        onChange={(e) => updateField("projectName", e.target.value)}
                        className="w-full rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Site Address / Stand / Farm / Erf Ref"
                        value={data.siteAddress}
                        onChange={(e) => updateField("siteAddress", e.target.value)}
                        className="w-full rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 print:border-0 print:p-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">PO / REF:</span>
                        <input
                          type="text"
                          placeholder="e.g. PO-WL-2026-881"
                          value={data.poNumber}
                          onChange={(e) => updateField("poNumber", e.target.value)}
                          className="w-full font-mono text-[11px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none print:p-0"
                        />
                      </div>
                      <div className="flex items-center px-1 text-[9.5px] text-sky-800 font-mono">
                        <span>STANDARDS: SANS 10299 HYDROLOGY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                SECTION 3A: REPORT MODE — OFFICIAL INSURANCE REPORT
                ───────────────────────────────────────────────────────── */}
            {data.mode === "report" && (
              <div className="mb-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-md border border-sky-100 bg-sky-50/50 print:border-slate-300 print:bg-transparent text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">INSURER / CLIENT:</span>
                    <input
                      type="text"
                      placeholder="e.g. Santam / Mutual & Federal"
                      value={data.insurerName}
                      onChange={(e) => updateField("insurerName", e.target.value)}
                      className="w-full font-semibold text-slate-900 bg-transparent outline-none text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">CLAIM NUMBER:</span>
                    <input
                      type="text"
                      placeholder="e.g. CLM-PWR-2026-77192"
                      value={data.claimNumber}
                      onChange={(e) => updateField("claimNumber", e.target.value)}
                      className="w-full font-mono text-slate-800 bg-transparent outline-none text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">SITE LOCATION:</span>
                    <input
                      type="text"
                      placeholder="e.g. Stand 418, Midstream Estate"
                      value={data.siteAddress}
                      onChange={(e) => updateField("siteAddress", e.target.value)}
                      className="w-full text-slate-700 bg-transparent outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1 border-b-2 border-sky-950 pb-1.5">
                  <span className="font-display text-xs font-black uppercase tracking-wider text-sky-950 shrink-0">
                    PERIL / CAUSE:
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Severe Lightning Strike & Electrical Mains Surge"
                    value={data.perilCause}
                    onChange={(e) => updateField("perilCause", e.target.value)}
                    className="w-full font-display text-xs sm:text-sm font-bold text-sky-950 uppercase bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase text-sky-950 tracking-wider block mb-0.5">
                      1. EXECUTIVE INCIDENT &amp; BACKGROUND SUMMARY
                    </span>
                    <textarea
                      rows={2}
                      value={data.incidentSummary}
                      onChange={(e) => updateField("incidentSummary", e.target.value)}
                      className="w-full rounded border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0 leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-sky-950 tracking-wider block mb-0.5">
                      2. TECHNICAL &amp; MEGGER INSULATION TEST FINDINGS
                    </span>
                    <textarea
                      rows={3}
                      value={data.technicalFindings}
                      onChange={(e) => updateField("technicalFindings", e.target.value)}
                      className="w-full rounded border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0 leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-sky-950 tracking-wider block mb-0.5">
                      3. FORENSIC CAUSATION &amp; CONSEQUENTIAL ASSESSMENT
                    </span>
                    <textarea
                      rows={2}
                      value={data.consequentialAssessment}
                      onChange={(e) => updateField("consequentialAssessment", e.target.value)}
                      className="w-full rounded border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0 leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-sky-950 tracking-wider block mb-0.5">
                      4. PHOTOGRAPHIC EVIDENCE LOG &amp; TEST VERIFICATION
                    </span>
                    <textarea
                      rows={2}
                      value={data.photographicEvidenceLog}
                      onChange={(e) => updateField("photographicEvidenceLog", e.target.value)}
                      className="w-full rounded border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0 leading-relaxed resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                SECTION 3B: ITEM MATRIX (For Invoice, Quotation, and Report)
                ───────────────────────────────────────────────────────── */}
            <div className="mb-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-y-2 border-sky-950 bg-sky-950 text-white font-mono text-[10px] uppercase tracking-wider print:bg-sky-950 print:text-white">
                      <th className="py-1.5 px-2 w-10 text-center">#</th>
                      <th className="py-1.5 px-2">Description of Equipment / Borehole Works</th>
                      <th className="py-1.5 px-2 w-16 text-center">Unit</th>
                      <th className="py-1.5 px-2 w-16 text-right">Qty</th>
                      <th className="py-1.5 px-2 w-28 text-right">Unit Price</th>
                      <th className="py-1.5 px-2 w-28 text-right">Total ({data.currency})</th>
                      <th className="py-1.5 px-1 w-8 text-center print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {data.lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-sky-50/40 group transition-colors">
                        <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-500">
                          {item.itemNo}
                        </td>
                        <td className="py-2 px-2">
                          <textarea
                            rows={1}
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                            placeholder="Enter item description..."
                            className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-900 focus:bg-white resize-none"
                          />
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-[11px]">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => updateLineItem(item.id, { unit: e.target.value })}
                            className="w-12 text-center rounded border border-transparent bg-transparent px-1 py-0.5 outline-none focus:border-sky-900 focus:bg-white"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-xs">
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={item.qty || ""}
                            onChange={(e) => updateLineItem(item.id, { qty: parseFloat(e.target.value) || 0 })}
                            className="w-14 text-right rounded border border-transparent bg-transparent px-1 py-0.5 outline-none focus:border-sky-900 focus:bg-white"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-xs">
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={item.unitPrice || ""}
                            onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                            className="w-24 text-right rounded border border-transparent bg-transparent px-1 py-0.5 outline-none focus:border-sky-900 focus:bg-white"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums">
                          {formatCurrency((item.qty || 0) * (item.unitPrice || 0))}
                        </td>
                        <td className="py-2 px-1 text-center print:hidden">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            title="Remove item"
                            disabled={data.lineItems.length <= 1}
                            className="opacity-0 group-hover:opacity-100 disabled:opacity-0 text-slate-400 hover:text-rose-600 transition-opacity p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Line Item Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => addLineItem("Rotary air borehole drilling", "m", 950)}
                  className="inline-flex items-center gap-1 rounded bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-800 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Line Item</span>
                </button>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  <span className="text-slate-400 self-center mr-1">Quick Presets:</span>
                  <button
                    onClick={() => addLineItem("Supply & install 140mm uPVC borehole casing", "m", 390)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[10px] cursor-pointer"
                  >
                    + Casing
                  </button>
                  <button
                    onClick={() => addLineItem("Submersible pump 1.1kW complete kit with control box", "kit", 14800)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[10px] cursor-pointer"
                  >
                    + 1.1kW Pump
                  </button>
                  <button
                    onClick={() => addLineItem("JoJo 5,000L Vertical Water Tank + 0.75kW Booster Pump", "sum", 17400)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[10px] cursor-pointer"
                  >
                    + JoJo Tank
                  </button>
                  <button
                    onClick={() => addLineItem("Calibrated borehole yield test & water analysis certificate", "test", 3500)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[10px] cursor-pointer"
                  >
                    + Yield Test
                  </button>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 4: FINANCIAL SUMMARY TOTALS BLOCK
                ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 pt-2 border-t border-slate-200">
              {/* Left Notes / Terms */}
              <div className="space-y-1.5 text-xs">
                <span className="font-display text-[10px] font-black uppercase tracking-widest text-slate-700 block">
                  TERMS &amp; PROJECT NOTES
                </span>
                <textarea
                  rows={3}
                  value={data.mode === "quotation" ? data.quotationTerms : data.notes}
                  onChange={(e) =>
                    data.mode === "quotation"
                      ? updateField("quotationTerms", e.target.value)
                      : updateField("notes", e.target.value)
                  }
                  className="w-full rounded border border-slate-200 bg-slate-50/40 p-2 text-xs text-slate-700 outline-none focus:border-sky-900 print:border-0 print:bg-transparent print:p-0 leading-relaxed resize-none"
                />
              </div>

              {/* Right: Calculated Financials */}
              <div className="space-y-1.5 text-xs">
                <div className="rounded-lg border border-sky-100 bg-sky-50/40 p-3 space-y-2">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold uppercase tracking-wider text-[11px]">Subtotal (Excl. VAT):</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {/* VAT (15% South Africa) */}
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold uppercase tracking-wider text-[11px]">VAT ({data.taxRate}%):</span>
                      <div className="inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.2 text-xs font-mono text-slate-800 print:hidden">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={data.taxRate || ""}
                          onChange={(e) => updateField("taxRate", parseFloat(e.target.value) || 0)}
                          className="w-8 text-right outline-none"
                        />
                        <span className="text-slate-400 ml-0.5">%</span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-slate-800 tabular-nums">
                      {formatCurrency(taxAmount)}
                    </span>
                  </div>

                  {/* Discount / Rebate */}
                  <div className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold uppercase tracking-wider text-[11px]">Discount / Rebate:</span>
                      <div className="inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.2 text-xs font-mono text-slate-800 print:hidden">
                        <span className="text-slate-400 mr-1">-</span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={data.discount || ""}
                          onChange={(e) => updateField("discount", parseFloat(e.target.value) || 0)}
                          className="w-16 text-right outline-none"
                        />
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-rose-600 tabular-nums">
                      {data.discount > 0 ? `- ${formatCurrency(data.discount)}` : formatCurrency(0)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-sky-950 my-1 pt-1"></div>

                  {/* Grand Total Box */}
                  <div className="rounded-lg bg-sky-950 text-white p-2.5 flex items-center justify-between shadow-sm print:bg-sky-950 print:text-white">
                    <div>
                      <span className="font-display text-xs font-black tracking-widest uppercase block text-sky-400">
                        {data.mode === "quotation" ? "TOTAL QUOTED VALUE" : "TOTAL AMOUNT DUE"}
                      </span>
                      <span className="text-[9px] text-sky-200 font-mono">
                        INCLUSIVE OF 15% VAT · {data.currency}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-lg sm:text-xl font-black tracking-tight font-mono text-white tabular-nums">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────
                SECTION 5: BOTTOM ACTIONS / BANKING / SIGN-OFF BLOCK
                ───────────────────────────────────────────────────────── */}
            <div className="border-t-2 border-sky-950 pt-4 mt-4">
              {/* Mode A: Tax Invoice -> WaterLinks EFT Banking Details */}
              {data.mode === "invoice" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Banking Details */}
                  <div className="space-y-1 rounded-lg border border-sky-100 bg-sky-50/50 p-3 print:border-slate-300 print:bg-transparent print:p-0">
                    <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-sky-200">
                      <Landmark className="h-4 w-4 text-sky-900" />
                      <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950">
                        OFFICIAL BANKING &amp; EFT DETAILS
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-sans text-slate-700 text-[11px]">
                      <p>
                        <strong className="font-semibold text-slate-900">Bank:</strong> {data.bankName}
                      </p>
                      <p>
                        <strong className="font-semibold text-slate-900">Branch Code:</strong>{" "}
                        <span className="font-mono">{data.branchCode}</span>
                      </p>
                      <p className="col-span-2">
                        <strong className="font-semibold text-slate-900">Account Name:</strong> {data.accountName}
                      </p>
                      <p>
                        <strong className="font-semibold text-slate-900">Account Type:</strong> {data.accountType}
                      </p>
                      <p>
                        <strong className="font-semibold text-slate-900">Acc No:</strong>{" "}
                        <span className="font-mono font-bold text-sky-950">{data.accountNumber}</span>
                      </p>
                      <div className="col-span-2 pt-1 text-[10.5px] text-sky-950 bg-sky-100/80 p-2 rounded border border-sky-300 print:border-slate-300 print:bg-transparent print:text-slate-800">
                        <p className="font-black tracking-wide text-[10px] uppercase text-sky-900 mb-0.5">
                          ⚠ {data.paymentNotice}
                        </p>
                        <p>
                          <strong>Payment Reference:</strong>{" "}
                          <span className="font-mono font-bold underline text-sky-950 bg-sky-200 px-1 py-0.5 rounded">{data.docRef}</span> (Quote on all payments)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certificate of Workmanship */}
                  <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-3 flex flex-col justify-between print:border-slate-300 print:bg-transparent print:p-0">
                    <div>
                      <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950 block mb-0.5">
                        CERTIFICATE OF HYDROLOGICAL WORKMANSHIP
                      </span>
                      <p className="text-[10px] text-slate-600 leading-relaxed">
                        All borehole drilling, submersible pumps, and pipe manifolds conform to SANS 10299 standards. Ownership of equipment transfers to client upon settlement in full.
                      </p>
                    </div>
                    <div className="pt-3 flex items-end justify-between">
                      <div>
                        <div className="border-b border-slate-400 w-32 mb-0.5"></div>
                        <span className="text-[9.5px] font-semibold uppercase text-slate-600">
                          Authorized Signatory
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="border-b border-slate-400 w-24 mb-0.5"></div>
                        <span className="text-[9.5px] font-semibold uppercase text-slate-600">
                          Handover Date
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode B: Quotation -> Deposit & Acceptance Block */}
              {data.mode === "quotation" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Banking Details */}
                  <div className="space-y-1 rounded-lg border border-sky-100 bg-sky-50/50 p-3 print:border-slate-300 print:bg-transparent print:p-0">
                    <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-sky-200">
                      <Landmark className="h-4 w-4 text-sky-900" />
                      <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950">
                        DEPOSIT REMITTANCE DETAILS
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-sans text-slate-700 text-[11px]">
                      <p>
                        <strong className="font-semibold text-slate-900">Bank:</strong> {data.bankName}
                      </p>
                      <p>
                        <strong className="font-semibold text-slate-900">Branch Code:</strong>{" "}
                        <span className="font-mono">{data.branchCode}</span>
                      </p>
                      <p className="col-span-2">
                        <strong className="font-semibold text-slate-900">Account:</strong> {data.accountName}
                      </p>
                      <p>
                        <strong className="font-semibold text-slate-900">Account Type:</strong> {data.accountType}
                      </p>
                      <p>
                        <strong className="font-semibold text-slate-900">Acc No:</strong>{" "}
                        <span className="font-mono font-bold text-sky-950">{data.accountNumber}</span>
                      </p>
                      <div className="col-span-2 pt-1 text-[10.5px] text-sky-950 bg-sky-100/80 p-2 rounded border border-sky-300 print:border-slate-300 print:bg-transparent print:text-slate-800">
                        <p className="font-black tracking-wide text-[10px] uppercase text-sky-900 mb-0.5">
                          ⚠ {data.paymentNotice}
                        </p>
                        <p>
                          <strong>Deposit Reference:</strong>{" "}
                          <span className="font-mono font-bold underline text-sky-950 bg-sky-200 px-1 py-0.5 rounded">{data.docRef}</span> (Quote on deposit payment)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Client Acceptance */}
                  <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-3 flex flex-col justify-between print:border-slate-300 print:bg-transparent print:p-0">
                    <div>
                      <div className="flex items-center gap-1.5 pb-1 border-b border-sky-200 mb-1.5">
                        <Award className="h-4 w-4 text-sky-700" />
                        <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950">
                          QUOTATION ACCEPTANCE &amp; DRILLING AUTHORIZATION
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 leading-relaxed mb-1">
                        To accept this quotation and confirm drilling rig scheduling, please sign below and remit a deposit of <strong>{data.depositPercentage}%</strong> using Reference <strong>{data.docRef}</strong>.
                      </p>
                      <p className="text-[10px] font-mono text-sky-800">
                        PRICING VALID UNTIL: {data.validUntil} · SABS MATERIALS
                      </p>
                    </div>
                    <div className="pt-3 flex items-end justify-between">
                      <div>
                        <div className="border-b border-slate-400 w-36 mb-0.5"></div>
                        <span className="text-[9.5px] font-semibold uppercase text-slate-600">
                          Client Authorized Signature
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="border-b border-slate-400 w-24 mb-0.5"></div>
                        <span className="text-[9.5px] font-semibold uppercase text-slate-600">
                          Acceptance Date
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode C: Insurance Report -> Assessor Verification */}
              {data.mode === "report" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-3 space-y-1.5 print:border-slate-300 print:bg-transparent print:p-0">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-sky-200">
                      <ShieldCheck className="h-4 w-4 text-sky-700" />
                      <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950">
                        HYDROLOGICAL ASSESSOR DECLARATION
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      I declare that this inspection was conducted in an objective, professional capacity. The findings and replacement equipment accurately reflect prevailing industry rates under SANS 10299 standards.
                    </p>
                    <p className="text-[10px] font-mono text-sky-800">
                      WATERLINKS TECHNICAL DESK · TEL {data.companyPhone}
                    </p>
                  </div>

                  <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-3 flex flex-col justify-between print:border-slate-300 print:bg-transparent print:p-0">
                    <div>
                      <span className="font-display text-[10px] font-black uppercase tracking-widest text-sky-950 block mb-0.5">
                        LEAD TECHNICAL ASSESSOR VERIFICATION
                      </span>
                      <p className="text-[10px] text-slate-900 font-semibold">
                        {data.assessorName} — {data.assessorDesignation}
                      </p>
                      <p className="text-[9.5px] font-mono text-slate-500">{data.assessorRegNo}</p>
                    </div>
                    <div className="pt-3 flex items-end justify-between">
                      <div>
                        <div className="border-b border-slate-400 w-36 mb-0.5"></div>
                        <span className="text-[9.5px] font-semibold uppercase text-slate-600">
                          Assessor Signature
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="border-b border-slate-400 w-24 mb-0.5"></div>
                        <span className="text-[9.5px] font-semibold uppercase text-slate-600">
                          Date of Report
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─────────────────────────────────────────────────────────
                DOCUMENT FOOTER
                ───────────────────────────────────────────────────────── */}
            <div className="mt-5 border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[9.5px] text-slate-400 font-mono gap-1 text-center sm:text-left">
              <span>
                {data.companyName.toUpperCase()} · REG: {data.companyReg} · {data.companyAddress.toUpperCase()} · {data.companyPhone}
              </span>
              <span className="shrink-0">
                PAGE 1 OF 1 · {data.mode === "invoice" ? "TAX INVOICE" : data.mode === "quotation" ? data.quotationTitle.toUpperCase() : "INSURANCE DAMAGE ASSESSMENT"}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
