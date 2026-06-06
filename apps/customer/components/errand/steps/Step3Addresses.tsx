"use client";

import * as React from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Button, Input, Card } from "@zoomoff/ui";
import { useErrandStore, type AddressField } from "@/lib/errand-store";

// Lightweight address input — wraps a text field.
// In production replace with Google Places Autocomplete component.
function AddressInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: AddressField | null;
  onChange: (val: AddressField) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-brand-charcoal flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
        {label}
      </label>
      <Input
        type="text"
        placeholder={placeholder}
        value={value?.address ?? ""}
        onChange={(e) =>
          onChange({ address: e.target.value, lat: 0, lng: 0 })
        }
        helperText="Google Maps autocomplete will be wired to backend API"
      />
    </div>
  );
}

export function Step3Addresses() {
  const { draft, updateDraft, setStep } = useErrandStore();
  const [pickup, setPickup] = React.useState<AddressField | null>(draft.pickup);
  const [destination, setDestination] = React.useState<AddressField | null>(draft.destination);
  const [waypoints, setWaypoints] = React.useState<AddressField[]>(draft.waypoints);

  function addWaypoint() {
    if (waypoints.length < 3) setWaypoints((w) => [...w, { address: "", lat: 0, lng: 0 }]);
  }

  function removeWaypoint(i: number) {
    setWaypoints((w) => w.filter((_, idx) => idx !== i));
  }

  function updateWaypoint(i: number, val: AddressField) {
    setWaypoints((w) => w.map((wp, idx) => (idx === i ? val : wp)));
  }

  const canContinue = !!pickup?.address && !!destination?.address;

  function next() {
    updateDraft({ pickup, destination, waypoints });
    setStep(4);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">Pickup & destination</h2>
        <p className="text-sm text-zo-muted mt-1">Where should your runner go?</p>
      </div>

      <div className="space-y-4">
        <AddressInput
          label="Pickup address"
          value={pickup}
          onChange={setPickup}
          placeholder="Where should the runner pick up from?"
        />

        {waypoints.map((wp, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <AddressInput
                label={`Stop ${i + 1}`}
                value={wp}
                onChange={(v) => updateWaypoint(i, v)}
                placeholder="Additional stop address"
              />
            </div>
            <button
              onClick={() => removeWaypoint(i)}
              className="mb-1 p-2 rounded-lg text-zo-muted hover:text-zo-error hover:bg-zo-error-light"
              aria-label="Remove stop"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {waypoints.length < 3 && (
          <button
            onClick={addWaypoint}
            className="flex items-center gap-1.5 text-sm text-brand-gold hover:text-brand-gold-dark font-medium"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add a stop (up to 3)
          </button>
        )}

        <AddressInput
          label="Final destination"
          value={destination}
          onChange={setDestination}
          placeholder="Where should the runner deliver to?"
        />
      </div>

      {/* Map placeholder */}
      <Card padding="none" className="h-40 bg-zo-bg-light flex items-center justify-center rounded-xl">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-zo-border mx-auto mb-2" aria-hidden="true" />
          <p className="text-xs text-zo-muted">Map preview — Google Maps JS API</p>
        </div>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
        <Button variant="primary" size="lg" disabled={!canContinue} onClick={next}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
