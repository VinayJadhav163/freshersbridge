'use client';

import { useState } from 'react';
import { 
  IndianRupee, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  PieChart, 
  ArrowRight 
} from 'lucide-react';

const POPULAR_CTC_PRESETS = [
  { label: '3.36 LPA (TCS Ninja)', value: 336000 },
  { label: '4.00 LPA (Infosys/Wipro)', value: 400000 },
  { label: '4.50 LPA (Accenture ASE)', value: 450000 },
  { label: '6.50 LPA (Accenture AASE)', value: 650000 },
  { label: '7.00 LPA (TCS Digital)', value: 700000 },
  { label: '9.00 LPA (TCS Prime)', value: 900000 },
  { label: '12.00 LPA (Product Tech)', value: 1200000 },
];

// Calculate Income Tax under New Tax Regime (FY 2024-25 / 2025-26)
function calculateAnnualTDS(ctc: number): number {
  const standardDeduction = 75000;
  const taxableIncome = Math.max(ctc - standardDeduction, 0);

  // Section 87A rebate: zero tax if taxable income <= 7,00,000 (CTC <= 7.75 LPA)
  if (taxableIncome <= 700000) {
    return 0;
  }

  let tax = 0;

  // Slab 1: 0 - 3,00,000 -> 0%
  // Slab 2: 3,00,001 - 7,00,000 -> 5% (4,00,000 * 5% = 20,000)
  tax += 400000 * 0.05;

  // Slab 3: 7,00,001 - 10,00,000 -> 10%
  if (taxableIncome > 700000) {
    const chunk = Math.min(taxableIncome - 700000, 300000);
    tax += chunk * 0.10;
  }

  // Slab 4: 10,00,001 - 12,00,000 -> 15%
  if (taxableIncome > 1000000) {
    const chunk = Math.min(taxableIncome - 1000000, 200000);
    tax += chunk * 0.15;
  }

  // Slab 5: 12,00,001 - 15,00,000 -> 20%
  if (taxableIncome > 1200000) {
    const chunk = Math.min(taxableIncome - 1200000, 300000);
    tax += chunk * 0.20;
  }

  // Slab 6: Above 15,00,000 -> 30%
  if (taxableIncome > 1500000) {
    tax += (taxableIncome - 1500000) * 0.30;
  }

  // Add 4% Health & Education Cess
  const totalTax = tax * 1.04;
  return totalTax;
}

export default function SalaryCalculator() {
  const [annualCTC, setAnnualCTC] = useState<number>(450000);

  // Standard Indian IT fresher salary structure model
  const monthlyGrossCTC = annualCTC / 12;

  // Basic Pay: 40% of CTC
  const monthlyBasic = (annualCTC * 0.40) / 12;

  // HRA: 50% of Basic Pay (20% of CTC)
  const monthlyHRA = monthlyBasic * 0.50;

  // Employee Provident Fund (EPF): 12% of Basic Pay (dynamic scaling)
  const monthlyEmployeePF = Math.round(monthlyBasic * 0.12);

  // Employer PF contribution (part of annual CTC): 12% of Basic
  const monthlyEmployerPF = monthlyEmployeePF;

  // Gratuity provision: (15/26) * (Basic/30) * 12 ~ 4.81% of Basic
  const monthlyGratuity = Math.round((monthlyBasic * 15) / (26 * 12));

  // Professional Tax (Standard across Karnataka/Maharashtra/Telangana: ~₹200/mo)
  const monthlyPT = annualCTC > 180000 ? 200 : 0;

  // Income Tax (TDS) per month
  const annualTDS = calculateAnnualTDS(annualCTC);
  const monthlyTDS = Math.round(annualTDS / 12);

  // Special Allowance / Flexi-Pay: Remaining Gross minus Basic & HRA & Employer benefits
  const monthlySpecialAllowance = Math.max(
    monthlyGrossCTC - monthlyBasic - monthlyHRA - monthlyEmployerPF - monthlyGratuity,
    0
  );

  // Total Gross Earnings per month (Basic + HRA + Special Allowance)
  const monthlyGrossSalary = monthlyBasic + monthlyHRA + monthlySpecialAllowance;

  // Total Monthly Deductions (Employee PF + PT + TDS)
  const monthlyTotalDeductions = monthlyEmployeePF + monthlyPT + monthlyTDS;

  // Net In-Hand Monthly Take-Home Cash in Bank
  const monthlyInHand = Math.round(monthlyGrossSalary - monthlyTotalDeductions);

  return (
    <div className="space-y-8">
      {/* Main Calculator Box */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              <span>Fresher In-Hand CTC & Salary Calculator (India)</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Calculate your exact monthly in-hand bank credit after PF, Gratuity, and Professional Tax deductions.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            2026 IT Industry Standard Model
          </div>
        </div>

        {/* Popular Fresher Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Popular IT Fresher Hiring Packages:
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CTC_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setAnnualCTC(preset.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  annualCTC === preset.value
                    ? 'bg-indigo-600 text-white shadow-xs scale-105'
                    : 'border border-border bg-background text-foreground hover:bg-secondary'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom CTC Input & Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground">
              Annual Cost to Company (CTC in ₹):
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="25000"
                min="150000"
                max="5000000"
                value={annualCTC}
                onChange={(e) => setAnnualCTC(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 text-base font-bold text-foreground focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>Slider Adjustment</span>
              <span>₹{(annualCTC / 100000).toFixed(2)} LPA</span>
            </div>
            <input
              type="range"
              min="200000"
              max="2500000"
              step="25000"
              value={annualCTC}
              onChange={(e) => setAnnualCTC(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-secondary rounded-lg"
            />
          </div>
        </div>

        {/* Salary Output Highlight Card */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/70 via-card to-card p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Estimated Net In-Hand Salary
              </p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                ₹{monthlyInHand.toLocaleString('en-IN')}
                <span className="text-xs font-medium text-muted-foreground block md:inline md:ml-1">
                  / month
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Actual bank deposit on the 1st of every month.
              </p>
            </div>

            <div className="space-y-1 md:border-l border-border md:pl-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Monthly Gross CTC
              </p>
              <p className="text-2xl font-bold text-foreground">
                ₹{Math.round(monthlyGrossCTC).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Total monthly package allocation.
              </p>
            </div>

            <div className="space-y-1 md:border-l border-border md:pl-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Total Monthly Deductions
              </p>
              <p className="text-2xl font-bold text-rose-600">
                ₹{Math.round(monthlyTotalDeductions).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-muted-foreground">
                PF (₹{Math.round(monthlyEmployeePF).toLocaleString('en-IN')}) + PT (₹{monthlyPT})
                {monthlyTDS > 0 ? ` + TDS (₹${monthlyTDS.toLocaleString('en-IN')})` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Salary Breakdown Table */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <PieChart className="h-4 w-4 text-indigo-600" />
            <span>Detailed Monthly CTC Component Breakdown</span>
          </h4>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-bold">Component</th>
                  <th className="px-4 py-3 font-bold">Description</th>
                  <th className="px-4 py-3 font-bold text-right">Monthly Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                <tr>
                  <td className="px-4 py-3 font-bold text-foreground">Basic Salary</td>
                  <td className="px-4 py-3 text-muted-foreground">Core taxable pay (~40% of CTC)</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">₹{Math.round(monthlyBasic).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-foreground">House Rent Allowance (HRA)</td>
                  <td className="px-4 py-3 text-muted-foreground">Allowance for accommodation (~50% of Basic)</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">₹{Math.round(monthlyHRA).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-foreground">Special / Flexi Allowance</td>
                  <td className="px-4 py-3 text-muted-foreground">Balancing taxable earnings component</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">₹{Math.round(monthlySpecialAllowance).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-amber-50/40 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
                  <td className="px-4 py-3 font-bold">Employer PF & Gratuity (Included in CTC)</td>
                  <td className="px-4 py-3 text-xs">Retirement fund paid by company on your behalf</td>
                  <td className="px-4 py-3 text-right font-bold">₹{Math.round(monthlyEmployerPF + monthlyGratuity).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-rose-50/40 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300">
                  <td className="px-4 py-3 font-bold">Employee Provident Fund (EPF 12%)</td>
                  <td className="px-4 py-3 text-xs">Statutory monthly employee retirement contribution (12% of Basic)</td>
                  <td className="px-4 py-3 text-right font-bold">- ₹{Math.round(monthlyEmployeePF).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-rose-50/40 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300">
                  <td className="px-4 py-3 font-bold">Professional Tax (PT)</td>
                  <td className="px-4 py-3 text-xs">State government employment tax</td>
                  <td className="px-4 py-3 text-right font-bold">- ₹{monthlyPT}</td>
                </tr>
                {monthlyTDS > 0 && (
                  <tr className="bg-rose-50/40 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300">
                    <td className="px-4 py-3 font-bold">Income Tax (TDS / Month)</td>
                    <td className="px-4 py-3 text-xs">Estimated tax under New Tax Regime (FY 24-25/25-26)</td>
                    <td className="px-4 py-3 text-right font-bold">- ₹{monthlyTDS.toLocaleString('en-IN')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
