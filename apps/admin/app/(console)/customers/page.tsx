import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customer Management" };

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-white">Customer Management</h1>
      <p className="text-gray-400 text-sm">Search, view, suspend and manage all customer accounts.</p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <input type="search" placeholder="Search by name, email or phone..." className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" />
        <p className="text-xs text-gray-600 mt-4 text-center">Customer list loads from /admin/customers API</p>
      </div>
    </div>
  );
}
