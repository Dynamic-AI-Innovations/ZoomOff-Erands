"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@zoomoff/api-client";
import { Card, Badge } from "@zoomoff/ui";
import { MapPin, Users, Activity } from "lucide-react";

interface MapStats {
  activeTasks: number;
  onlineRunners: number;
  availableRunners: number;
  cityCoverage: string[];
}

const CITIES = ["Lagos","Abuja","Port Harcourt"];

export function LiveOpsMap() {
  const [selectedCity, setSelectedCity] = React.useState("Lagos");

  const { data: stats } = useQuery({
    queryKey: ["ops-map-stats", selectedCity],
    queryFn: () => apiClient.get<{ data: MapStats }>(`/admin/ops/stats?city=${selectedCity}`).then(r => r.data.data),
    refetchInterval: 5000,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Live Operations Map</h1>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="h-2 w-2 rounded-full bg-zo-success animate-pulse inline-block" />
          Live — refreshes every 5s
        </div>
      </div>

      {/* City selector */}
      <div className="flex gap-2">
        {CITIES.map(city => (
          <button key={city} onClick={() => setSelectedCity(city)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${selectedCity === city ? "border-brand-gold bg-brand-gold/20 text-brand-gold" : "border-white/10 text-gray-400 hover:border-white/30"}`}>
            {city}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Tasks", value: stats?.activeTasks ?? "—", icon: Activity, color: "text-brand-gold" },
          { label: "Online Runners", value: stats?.onlineRunners ?? "—", icon: Users, color: "text-zo-success" },
          { label: "Available", value: stats?.availableRunners ?? "—", icon: MapPin, color: "text-zo-info" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="rounded-2xl border border-white/10 bg-white/5 h-[500px] flex flex-col items-center justify-center gap-4">
        <MapPin className="h-16 w-16 text-brand-gold/30" aria-hidden="true" />
        <div className="text-center">
          <p className="font-semibold text-white">Google Maps Live Operations View</p>
          <p className="text-sm text-gray-400 mt-1">
            Active tasks (colour-coded by status) + online runners (tier-coded dots)
          </p>
          <p className="text-xs text-gray-600 mt-1">Wire Google Maps JS API with admin token to enable</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
        {[
          { color: "bg-brand-gold", label: "Awaiting Runner" },
          { color: "bg-zo-info", label: "In Progress" },
          { color: "bg-zo-error", label: "Disputed" },
          { color: "bg-gray-400", label: "Standard Runner" },
          { color: "bg-zo-info", label: "Verified Runner" },
          { color: "bg-brand-gold", label: "Elite Runner" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-full ${color}`} aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
