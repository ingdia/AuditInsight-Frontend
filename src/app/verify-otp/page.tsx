"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, MailCheck, RefreshCw, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const nextPath = searchParams.get("next") ?? "/dashboard";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError("");
    if (char && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setDigits(paste.split(""));
      refs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    const code = digits.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit code."); return; }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    // Enforce 10-minute expiry using stored OTP metadata
    const otpMetaRaw = localStorage.getItem("signup_otp_meta");
    if (!otpMetaRaw) {
      setError("No OTP was sent. Please request a new code.");
      setIsSubmitting(false);
      return;
    }
    try {
      const meta = JSON.parse(otpMetaRaw) as { email: string; code: string; sentAt: string };
      const sentAt = new Date(meta.sentAt);
      const now = new Date();
      const minutes = (now.getTime() - sentAt.getTime()) / 60000;
      if (minutes > 10) {
        setError("The code has expired. Please resend a new code.");
        setIsSubmitting(false);
        return;
      }
      if (code === meta.code) {
        localStorage.setItem("otp_verified", "true");
        // preserve which email was verified
        localStorage.setItem("verified_email", meta.email);
        router.push(nextPath);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Invalid OTP metadata. Please resend.");
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const targetEmail = email || localStorage.getItem("signup_email") || "";
    const existingMeta = localStorage.getItem("signup_otp_meta");
    if (!existingMeta && targetEmail) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const meta = { email: targetEmail, code, sentAt: new Date().toISOString() };
      localStorage.setItem("signup_otp_meta", JSON.stringify(meta));
      setSuccessMsg(`A verification code has been sent to ${targetEmail}.`);
    }
  }, [email]);

  const handleResend = async () => {
    setError("");
    setSuccessMsg("");
    setIsResending(true);
    await new Promise((r) => setTimeout(r, 600));
    // generate secure 6-digit code (mock email send)
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const meta = { email: email || localStorage.getItem("signup_email") || "", code, sentAt: new Date().toISOString() };
    localStorage.setItem("signup_otp_meta", JSON.stringify(meta));
    setResendCount((c) => c + 1);
    setSuccessMsg(`A new code has been sent to ${meta.email || "your email"}.`);
    setDigits(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
    setIsResending(false);
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.cardHeader}>
          <div style={s.logoRow}>
            <div style={s.logoMark}><Shield size={16} /></div>
            <span style={s.logoText}>AuditInsight</span>
          </div>
        </div>

        <div style={s.body}>
          <div style={s.iconWrap}><MailCheck size={32} color="#1e3a8a" strokeWidth={1.5} /></div>
          <h2 style={s.title}>Verify your email</h2>
          <p style={s.subtitle}>
            Enter the 6-digit code sent to{" "}
            <strong style={{ color: "#0f172a" }}>{email || "your email"}</strong>
          </p>

          {error && <div style={s.errorBox}>{error}</div>}
          {successMsg && <div style={s.successBox}>{successMsg}</div>}

          {/* 6-box OTP input */}
          <div style={s.otpRow} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{ ...s.otpBox, ...(d ? s.otpBoxFilled : {}), ...(error ? s.otpBoxError : {}) }}
                onFocus={(e) => { e.currentTarget.select(); Object.assign(e.currentTarget.style, s.otpBoxFocus); }}
                onBlur={(e) => { Object.assign(e.currentTarget.style, d ? { ...s.otpBox, ...s.otpBoxFilled } : s.otpBox); }}
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={isSubmitting} style={{ ...s.verifyBtn, opacity: isSubmitting ? 0.75 : 1 }}>
            {isSubmitting ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />
                Verifying…
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </span>
            ) : "Verify Code"}
          </button>

          <div style={s.resendRow}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Didn&apos;t receive the code?</span>
            <button onClick={isResending ? undefined : handleResend} disabled={isResending} style={s.resendBtn}>
              {isResending ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : <RefreshCw size={13} />}
              {isResending ? "Sending…" : "Resend code"}
            </button>
          </div>

          {resendCount > 0 && (
            <p style={{ fontSize: 11.5, color: "#94a3b8", textAlign: "center", margin: "4px 0 0" }}>
              Hint: use any 6-digit number (e.g. 123456)
            </p>
          )}

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link href="/sign-up" style={s.backLink}>
              <ArrowLeft size={14} /> Back to sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return <Suspense><VerifyOtpForm /></Suspense>;
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { width: "100%", maxWidth: 460, borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0" },
  cardHeader: { background: "linear-gradient(135deg,#0c2d6b,#1e3a8a)", padding: "20px 28px" },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  logoText: { color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" },
  body: { padding: "36px 36px 32px" },
  iconWrap: { width: 64, height: 64, borderRadius: "50%", background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  title: { textAlign: "center", fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" },
  subtitle: { textAlign: "center", fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 },
  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 18, textAlign: "center" },
  successBox: { background: "#f0fdf4", border: "1px solid #86efac", color: "#15803d", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 18, textAlign: "center" },
  otpRow: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 },
  otpBox: { width: 52, height: 60, borderRadius: 12, border: "2px solid #e2e8f0", background: "#f8fafc", fontSize: 24, fontWeight: 700, textAlign: "center", color: "#0f172a", outline: "none", fontFamily: "inherit", transition: "all 0.15s", cursor: "text" },
  otpBoxFilled: { border: "2px solid #1e3a8a", background: "#eff6ff" },
  otpBoxFocus: { border: "2px solid #1e3a8a", background: "#fff", boxShadow: "0 0 0 3px rgba(30,58,138,0.12)" },
  otpBoxError: { border: "2px solid #ef4444", background: "#fef2f2" },
  verifyBtn: { width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.2px", marginBottom: 16 },
  resendRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
  resendBtn: { display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#1e3a8a", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" },
  backLink: { display: "inline-flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13, textDecoration: "none", fontWeight: 500 },
};
