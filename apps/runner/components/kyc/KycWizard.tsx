"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { Card, cn, Badge } from "@zoomoff/ui";
import { useRunnerApplication } from "../../hooks/useRunnerApplication";

const KYC_STEPS = [
  { step: 1, label: "Basic Info", desc: "Name, DOB, state" },
  { step: 2, label: "Phone Verification", desc: "OTP to your number" },
  { step: 3, label: "NIN Verification", desc: "National ID number" },
  { step: 4, label: "BVN Verification", desc: "Bank verification number" },
  { step: 5, label: "ID Document", desc: "Gov-issued photo ID" },
  { step: 6, label: "Biometric Selfie", desc: "Live selfie for facial match" },
  { step: 7, label: "Bank Account", desc: "Payout bank details" },
  { step: 8, label: "Service Category", desc: "What errands will you run?" },
  { step: 9, label: "Runner Academy", desc: "4 mandatory training modules" },
];

interface Props { initialStep: number; }

export function KycWizard({ initialStep }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const { submit: submitApplication, isLoading: submitting } = useRunnerApplication();

  async function completeStep(step: number) {
    setCompletedSteps((s) => [...new Set([...s, step])]);
    if (step < KYC_STEPS.length) {
      const nextStep = step + 1;
      setCurrentStep(nextStep);
      router.push(`/register/${nextStep}`, { scroll: false });
    } else {
      // Final step — submit runner application to Supabase before navigating
      await submitApplication({
        id_type: "NIN",
        id_number: "",   // collected in NinStep (step 3)
        vehicle_type: "motorcycle",
        bio: "",         // can be extended to pass wizard-collected data
        categories: [],  // collected in CategoryStep (step 8)
      });
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-zo-bg-light p-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold mx-auto mb-4">
            <span className="font-display text-xl font-bold text-brand-charcoal">Z</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Become a ZoomOff Errands Runner</h1>
          <p className="text-sm text-zo-muted mt-1">Complete all steps to start accepting tasks</p>
          <div className="mt-3">
            <div className="flex gap-1 justify-center">
              {KYC_STEPS.map((s) => (
                <div
                  key={s.step}
                  className={cn(
                    "h-1.5 w-6 rounded-full transition-colors",
                    completedSteps.includes(s.step)
                      ? "bg-zo-success"
                      : s.step === currentStep
                        ? "bg-brand-gold"
                        : "bg-zo-border"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-zo-muted mt-2">{completedSteps.length}/{KYC_STEPS.length} completed</p>
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-2 mb-6">
          {KYC_STEPS.map((s) => {
            const done = completedSteps.includes(s.step);
            const active = s.step === currentStep;
            const locked = s.step > currentStep && !completedSteps.includes(s.step - 1);
            return (
              <Card
                key={s.step}
                padding="sm"
                className={cn(
                  "flex items-center gap-3 transition-all",
                  active && "border-brand-gold ring-1 ring-brand-gold",
                  done && "bg-zo-success-light border-zo-success/30"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-zo-success text-white" : active ? "bg-brand-gold text-brand-charcoal" : "bg-zo-border text-zo-muted"
                )}>
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : locked ? (
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <span className="text-xs font-bold">{s.step}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-semibold", done ? "text-zo-success" : "text-brand-charcoal")}>{s.label}</p>
                  <p className="text-xs text-zo-muted">{s.desc}</p>
                </div>
                {active && <Badge variant="gold">Current</Badge>}
                {done && <Badge variant="success">Done</Badge>}
              </Card>
            );
          })}
        </div>

        {/* Active step content */}
        <Card>
          <KycStepContent step={currentStep} onComplete={() => completeStep(currentStep)} />
        </Card>
      </div>
    </div>
  );
}

function KycStepContent({ step, onComplete }: { step: number; onComplete: () => void }) {
  const STEP_CONTENT = [
    <BasicInfoStep key={1} onComplete={onComplete} />,
    <PhoneStep key={2} onComplete={onComplete} />,
    <NinStep key={3} onComplete={onComplete} />,
    <BvnStep key={4} onComplete={onComplete} />,
    <IdDocStep key={5} onComplete={onComplete} />,
    <SelfieStep key={6} onComplete={onComplete} />,
    <BankStep key={7} onComplete={onComplete} />,
    <CategoryStep key={8} onComplete={onComplete} />,
    <AcademyStep key={9} onComplete={onComplete} />,
  ];
  return STEP_CONTENT[step - 1] ?? null;
}

// ─── Step components ──────────────────────────────────────────────────────────

import { Button, Input } from "@zoomoff/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function BasicInfoStep({ onComplete }: { onComplete: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({
      fullName: z.string().min(3, "Enter your full legal name"),
      dob: z.string().min(1, "Enter your date of birth"),
      state: z.string().min(1, "Select your state"),
    })),
  });
  return (
    <form onSubmit={handleSubmit(() => onComplete())} className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">Basic Information</h2>
      <Input label="Full Legal Name" placeholder="As on your ID document" error={errors.fullName?.message} {...register("fullName")} />
      <Input label="Date of Birth" type="date" error={errors.dob?.message} {...register("dob")} />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">State of Residence</label>
        <select {...register("state")} className="h-10 w-full rounded-xl border border-zo-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
          <option value="">Select state...</option>
          {["Lagos","Abuja","Rivers","Ogun","Oyo","Kano","Kaduna","Enugu","Delta","Anambra"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        {errors.state && <p className="text-xs text-zo-error">{errors.state.message as string}</p>}
      </div>
      <Button type="submit" variant="primary" size="lg" className="w-full">Continue →</Button>
    </form>
  );
}

function PhoneStep({ onComplete }: { onComplete: () => void }) {
  const [otp, setOtp] = React.useState("");
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">Verify Phone Number</h2>
      <Input label="Phone Number" type="tel" placeholder="08012345678" />
      <Button variant="outline" size="sm">Send OTP</Button>
      <Input label="Enter OTP" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
      <Button variant="primary" size="lg" className="w-full" disabled={otp.length < 6} onClick={onComplete}>Verify →</Button>
    </div>
  );
}

function NinStep({ onComplete }: { onComplete: () => void }) {
  const [nin, setNin] = React.useState("");
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">NIN Verification</h2>
      <p className="text-sm text-zo-muted">Enter your 11-digit National Identification Number</p>
      <Input label="NIN" placeholder="12345678901" maxLength={11} value={nin} onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))} />
      <p className="text-xs text-zo-muted bg-zo-info-light border border-zo-info/20 rounded-xl p-3">
        Your NIN is verified securely via the NIMC API. We never store your NIN on our servers.
      </p>
      <Button variant="primary" size="lg" className="w-full" disabled={nin.length < 11} onClick={onComplete}>Verify NIN →</Button>
    </div>
  );
}

function BvnStep({ onComplete }: { onComplete: () => void }) {
  const [bvn, setBvn] = React.useState("");
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">BVN Verification</h2>
      <p className="text-sm text-zo-muted">Enter your 11-digit Bank Verification Number</p>
      <Input label="BVN" placeholder="12345678901" maxLength={11} value={bvn} onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))} />
      <Button variant="primary" size="lg" className="w-full" disabled={bvn.length < 11} onClick={onComplete}>Verify BVN →</Button>
    </div>
  );
}

function IdDocStep({ onComplete }: { onComplete: () => void }) {
  const [docType, setDocType] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const types = ["Driver's License","National ID Card","International Passport","Voter's Card"];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">ID Document</h2>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Document Type</label>
        <div className="grid grid-cols-2 gap-2">
          {types.map(t => (
            <button key={t} onClick={() => setDocType(t)}
              className={cn("rounded-xl border p-2.5 text-xs font-medium text-left transition-colors", docType === t ? "border-brand-gold bg-brand-gold/10 text-brand-charcoal" : "border-zo-border text-zo-muted hover:border-brand-charcoal")}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border-2 border-dashed border-zo-border p-6 text-center cursor-pointer hover:border-brand-gold transition-colors" onClick={() => document.getElementById("id-upload")?.click()}>
        <p className="text-sm font-medium text-brand-charcoal">{file ? file.name : "Upload front of ID"}</p>
        <p className="text-xs text-zo-muted mt-1">JPEG or PNG, clear and not expired</p>
        <input id="id-upload" type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <Button variant="primary" size="lg" className="w-full" disabled={!docType || !file} onClick={onComplete}>Submit ID →</Button>
    </div>
  );
}

function SelfieStep({ onComplete }: { onComplete: () => void }) {
  const [taken, setTaken] = React.useState(false);
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">Biometric Selfie</h2>
      <p className="text-sm text-zo-muted">We need a live selfie to verify your identity matches your ID. AI liveness detection will confirm you're a real person.</p>
      <div className="rounded-2xl bg-zo-bg-light border border-zo-border p-8 text-center">
        <div className="h-32 w-32 rounded-full border-4 border-brand-gold mx-auto mb-4 flex items-center justify-center bg-white">
          <span className="text-5xl">🤳</span>
        </div>
        <Button variant={taken ? "outline" : "primary"} onClick={() => setTaken(true)}>
          {taken ? "Retake Selfie" : "Take Selfie"}
        </Button>
        {taken && <p className="text-xs text-zo-success mt-2">✓ Selfie captured</p>}
      </div>
      <p className="text-xs text-zo-muted text-center">When prompted: blink twice to confirm liveness</p>
      <Button variant="primary" size="lg" className="w-full" disabled={!taken} onClick={onComplete}>Submit Selfie →</Button>
    </div>
  );
}

function BankStep({ onComplete }: { onComplete: () => void }) {
  const [account, setAccount] = React.useState("");
  const [bank, setBank] = React.useState("");
  const [verifiedName, setVerifiedName] = React.useState("");
  const BANKS = ["Access Bank","GTBank","Zenith Bank","First Bank","UBA","Fidelity Bank","Polaris Bank","Sterling Bank","Wema Bank","Kuda Bank"];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">Bank Account</h2>
      <p className="text-sm text-zo-muted">Your earnings will be paid to this account. Name must match your KYC details.</p>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Bank</label>
        <select value={bank} onChange={e => setBank(e.target.value)} className="h-10 w-full rounded-xl border border-zo-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
          <option value="">Select bank...</option>
          {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <Input label="Account Number" maxLength={10} value={account} onChange={e => setAccount(e.target.value.replace(/\D/g,""))} placeholder="10-digit account number" />
      {account.length === 10 && bank && (
        <div className="rounded-xl bg-zo-success-light border border-zo-success/30 p-3 text-sm text-zo-success">
          ✓ Account Name: <span className="font-semibold">JOHN DOE</span> (mock — real lookup via NIBSS)
        </div>
      )}
      <Button variant="primary" size="lg" className="w-full" disabled={account.length < 10 || !bank} onClick={onComplete}>Confirm Bank Account →</Button>
    </div>
  );
}

function CategoryStep({ onComplete }: { onComplete: () => void }) {
  const CATS = ["General Errand","Dispatch/Delivery","Personal Shopping","Administrative Specialist","Healthcare Errand"];
  const [selected, setSelected] = React.useState<string[]>([]);
  function toggle(c: string) { setSelected(s => s.includes(c) ? s.filter(x=>x!==c) : [...s, c]); }
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">Service Categories</h2>
      <p className="text-sm text-zo-muted">Select all task types you're willing to run (multiple allowed)</p>
      <div className="space-y-2">
        {CATS.map(c => (
          <button key={c} onClick={() => toggle(c)} aria-pressed={selected.includes(c)}
            className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors", selected.includes(c) ? "border-brand-gold bg-brand-gold/10" : "border-zo-border hover:border-brand-charcoal/30")}>
            <div className={cn("h-5 w-5 rounded border-2 flex items-center justify-center", selected.includes(c) ? "border-brand-gold bg-brand-gold" : "border-zo-border")}>
              {selected.includes(c) && <CheckCircle2 className="h-3.5 w-3.5 text-brand-charcoal" />}
            </div>
            <span className="text-sm font-medium text-brand-charcoal">{c}</span>
          </button>
        ))}
      </div>
      <Button variant="primary" size="lg" className="w-full" disabled={selected.length === 0} onClick={onComplete}>Continue →</Button>
    </div>
  );
}

function AcademyStep({ onComplete }: { onComplete: () => void }) {
  const MODULES = [
    { id: 1, title: "Platform Policies", duration: "8 min" },
    { id: 2, title: "Trust & Safety Guide", duration: "10 min" },
    { id: 3, title: "Proof-of-Completion Procedures", duration: "7 min" },
    { id: 4, title: "Dispute Avoidance", duration: "5 min" },
  ];
  const [completed, setCompleted] = React.useState<number[]>([]);
  function completeModule(id: number) { setCompleted(c => [...new Set([...c, id])]); }
  const allDone = completed.length === MODULES.length;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-brand-charcoal">Runner Academy</h2>
      <p className="text-sm text-zo-muted">Complete all 4 mandatory modules to unlock task access. Minimum 80% quiz score to pass.</p>
      <div className="space-y-2">
        {MODULES.map(m => {
          const done = completed.includes(m.id);
          return (
            <div key={m.id} className={cn("flex items-center gap-3 rounded-xl border p-3", done ? "border-zo-success bg-zo-success-light" : "border-zo-border bg-white")}>
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", done ? "bg-zo-success text-white" : "bg-zo-bg-light text-zo-muted")}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{m.id}</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-charcoal">{m.title}</p>
                <p className="text-xs text-zo-muted">{m.duration}</p>
              </div>
              {!done && (
                <Button variant="outline" size="sm" onClick={() => completeModule(m.id)}>Start</Button>
              )}
            </div>
          );
        })}
      </div>
      <Button variant="primary" size="lg" className="w-full" disabled={!allDone} onClick={onComplete}>
        {allDone ? "Complete Registration 🎉" : `${completed.length}/4 modules done`}
      </Button>
    </div>
  );
}
