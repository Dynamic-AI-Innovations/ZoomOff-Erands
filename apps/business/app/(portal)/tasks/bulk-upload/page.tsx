"use client";

import * as React from "react";
import { Upload, Download, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, Badge, useToast } from "@zoomoff/ui";
import { apiClient } from "@zoomoff/api-client";

interface RowResult { row: number; status: "valid" | "error"; error?: string; preview?: string; }

export default function BulkUploadPage() {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [validation, setValidation] = React.useState<RowResult[] | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const { mutate: validate, isPending: validating } = useMutation({
    mutationFn: (f: File) => {
      const fd = new FormData(); fd.append("csv", f);
      return apiClient.post<{ data: RowResult[] }>("/business/tasks/bulk-validate", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(r => r.data.data);
    },
    onSuccess: (rows) => setValidation(rows),
    onError: () => toast({ type: "error", title: "Validation failed", description: "Ensure CSV matches the template." }),
  });

  const { mutate: submit, isPending: submitting } = useMutation({
    mutationFn: () => {
      const fd = new FormData(); fd.append("csv", file!);
      return apiClient.post<{ data: { created: number; pending: number } }>("/business/tasks/bulk-submit", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(r => r.data.data);
    },
    onSuccess: (res) => {
      toast({ type: "success", title: `${res.created} tasks created`, description: `${res.pending} pending approval.` });
      setFile(null); setValidation(null);
    },
    onError: () => toast({ type: "error", title: "Submission failed" }),
  });

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith(".csv")) { setFile(f); setValidation(null); validate(f); }
    else toast({ type: "warning", title: "CSV files only" });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setValidation(null); validate(f); }
  }

  const validRows = validation?.filter(r => r.status === "valid") ?? [];
  const errorRows = validation?.filter(r => r.status === "error") ?? [];
  const allValid = validation !== null && errorRows.length === 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Bulk Task Upload</h1>
        <p className="text-sm text-zo-muted mt-1">Upload up to 100 tasks at once via CSV</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <a href="/templates/bulk-tasks-template.csv" download>
            <Download className="h-4 w-4" aria-hidden="true" /> Download CSV Template
          </a>
        </Button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("csv-input")?.click()}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${isDragging ? "border-brand-gold bg-brand-gold/5" : "border-zo-border bg-zo-bg-light hover:border-brand-charcoal/30"}`}
      >
        <Upload className="h-10 w-10 text-zo-muted" aria-hidden="true" />
        <div>
          <p className="font-semibold text-brand-charcoal">
            {file ? file.name : "Drop CSV file here or click to browse"}
          </p>
          <p className="text-xs text-zo-muted mt-1">Max 100 rows · UTF-8 encoded</p>
        </div>
        <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
      </div>

      {/* Validation results */}
      {validating && <p className="text-sm text-zo-muted">Validating rows...</p>}

      {validation && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand-charcoal">Validation Results</h2>
            <div className="flex gap-2">
              <Badge variant="success">{validRows.length} valid</Badge>
              {errorRows.length > 0 && <Badge variant="error">{errorRows.length} errors</Badge>}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5">
            {validation.map(row => (
              <div key={row.row} className={`flex items-start gap-3 rounded-xl p-2.5 text-sm ${row.status === "valid" ? "bg-zo-success-light" : "bg-zo-error-light"}`}>
                <div className="shrink-0 mt-0.5">
                  {row.status === "valid"
                    ? <CheckCircle2 className="h-4 w-4 text-zo-success" aria-hidden="true" />
                    : <AlertCircle className="h-4 w-4 text-zo-error" aria-hidden="true" />
                  }
                </div>
                <div>
                  <span className="font-semibold">Row {row.row}: </span>
                  {row.status === "valid" ? (
                    <span className="text-zo-muted">{row.preview}</span>
                  ) : (
                    <span className="text-zo-error">{row.error}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {errorRows.length > 0 && (
            <div className="mt-4 rounded-xl bg-zo-warning-light border border-zo-warning/20 p-3 text-xs text-zo-warning">
              Fix the {errorRows.length} error{errorRows.length > 1 ? "s" : ""} in your CSV and re-upload. Partial submission is not allowed.
            </div>
          )}

          {allValid && (
            <Button variant="primary" size="lg" className="w-full mt-4" loading={submitting} onClick={() => submit()}>
              Submit {validRows.length} Tasks
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
