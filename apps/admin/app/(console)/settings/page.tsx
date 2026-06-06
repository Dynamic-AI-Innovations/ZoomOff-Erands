import type { Metadata } from "next";

export const metadata: Metadata = { title: "Platform Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Super Admin only — feature flags and platform configuration</p>
      </div>

      {[
        { label: "Split Payment", key: "splitPayment", enabled: false, desc: "Allow customers to split task cost with up to 3 users" },
        { label: "Recurring Tasks", key: "recurringTasks", enabled: true, desc: "Allow customers to schedule recurring errands" },
        { label: "Task Templates", key: "taskTemplates", enabled: true, desc: "Allow customers to save tasks as reusable templates" },
        { label: "Runner Zone Preferences", key: "zonePreferences", enabled: true, desc: "Allow runners to set preferred working zones" },
        { label: "Surge Pricing", key: "surgePricing", enabled: true, desc: "Dynamic pricing multiplier during peak demand" },
        { label: "Multi-Stop Tasks", key: "multiStop", enabled: true, desc: "Allow up to 5 waypoints per errand" },
      ].map(({ label, key, enabled, desc }) => (
        <div key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="font-semibold text-white">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </div>
          <button
            className={`flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-brand-gold justify-end" : "bg-white/20 justify-start"}`}
            aria-pressed={enabled}
            aria-label={`Toggle ${label}`}
          >
            <div className="h-5 w-5 rounded-full bg-white shadow mx-0.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
