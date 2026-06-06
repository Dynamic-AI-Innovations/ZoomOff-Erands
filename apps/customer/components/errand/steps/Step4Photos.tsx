"use client";

import * as React from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button, useToast } from "@zoomoff/ui";
import { useErrandStore } from "@/lib/errand-store";
import { useMutation } from "@tanstack/react-query";
import { tasksApi } from "@zoomoff/api-client";

const MAX_FILES = 5;
const MAX_MB = 5;

export function Step4Photos() {
  const { draft, updateDraft, setStep } = useErrandStore();
  const { toast } = useToast();
  const [previews, setPreviews] = React.useState<{ url: string; name: string }[]>([]);
  const [uploadedUrls, setUploadedUrls] = React.useState<string[]>(draft.attachments);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { mutate: upload, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return tasksApi.uploadAttachment(fd);
    },
    onSuccess: (res, file) => {
      const url = res.data.url;
      setUploadedUrls((u) => [...u, url]);
      setPreviews((p) => [...p, { url: URL.createObjectURL(file), name: file.name }]);
    },
    onError: () => toast({ type: "error", title: "Upload failed", description: "Try a smaller image." }),
  });

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_FILES - uploadedUrls.length;
    const toUpload = Array.from(files).slice(0, remaining);
    for (const file of toUpload) {
      if (file.size > MAX_MB * 1024 * 1024) {
        toast({ type: "warning", title: `${file.name} is too large`, description: `Max ${MAX_MB}MB per image.` });
        continue;
      }
      upload(file);
    }
  }

  function removeFile(i: number) {
    setPreviews((p) => p.filter((_, idx) => idx !== i));
    setUploadedUrls((u) => u.filter((_, idx) => idx !== i));
  }

  function next() {
    updateDraft({ attachments: uploadedUrls });
    setStep(5);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-brand-charcoal">Add photos (optional)</h2>
        <p className="text-sm text-zo-muted mt-1">Help your runner identify items — up to {MAX_FILES} photos, {MAX_MB}MB each</p>
      </div>

      {/* Drop zone */}
      <div
        className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zo-border bg-zo-bg-light p-8 text-center transition-colors hover:border-brand-gold cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        role="button"
        tabIndex={0}
        aria-label="Upload photos"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-zo-muted" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-brand-charcoal">Click or drag photos here</p>
          <p className="text-xs text-zo-muted">JPEG, PNG, WebP — max {MAX_MB}MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          aria-hidden="true"
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {previews.map(({ url, name }, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-zo-border">
              <img src={url} alt={name} className="h-full w-full object-cover" />
              <button
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {uploadedUrls.length < MAX_FILES && (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-zo-border bg-zo-bg-light hover:border-brand-gold"
              aria-label="Add more photos"
            >
              <ImageIcon className="h-5 w-5 text-zo-muted" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(3)}>← Back</Button>
        <div className="flex items-center gap-3">
          {isPending && <span className="text-xs text-zo-muted">Uploading...</span>}
          <Button variant="primary" size="lg" disabled={isPending} onClick={next}>
            {uploadedUrls.length > 0 ? "Continue →" : "Skip, no photos →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
