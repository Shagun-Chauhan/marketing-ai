import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://127.0.0.1:8000/api/auth";
const STEPS = { FORM: "form", OTP: "otp" };
const FP_STEPS = { EMAIL: "fp_email", OTP: "fp_otp", RESET: "fp_reset" };

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.FORM);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot password
  const [fpStep, setFpStep] = useState(null);
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState(["", "", "", "", "", ""]);
  const [fpResendTimer, setFpResendTimer] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [newConfirm, setNewConfirm] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);
  const [fpToken, setFpToken] = useState("");
  const [emailNotFound, setEmailNotFound] = useState(false);

  const makeTimer = (setter) => {
    setter(30);
    const iv = setInterval(() => {
      setter((t) => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; });
    }, 1000);
  };

  const handleOtpChange = (arr, setArr, prefix) => (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...arr]; next[index] = value.slice(-1); setArr(next); setError("");
    if (value && index < 5) document.getElementById(`${prefix}-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (arr, prefix) => (index, e) => {
    if (e.key === "Backspace" && !arr[index] && index > 0)
      document.getElementById(`${prefix}-${index - 1}`)?.focus();
  };
  const renderOtpBoxes = (arr, setArr, prefix) =>
    arr.map((digit, i) => (
      <input key={i} id={`${prefix}-${i}`} type="text" inputMode="numeric"
        maxLength={1} value={digit}
        onChange={(e) => handleOtpChange(arr, setArr, prefix)(i, e.target.value)}
        onKeyDown={(e) => handleOtpKeyDown(arr, prefix)(i, e)}
        style={{ ...S.otpBox, borderColor: digit ? "rgba(124,107,255,0.6)" : "rgba(255,255,255,0.1)", color: digit ? "#a78bfa" : "#e8eaf2" }}
        autoFocus={i === 0}
      />
    ));

  // Signup handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/signup/send-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Failed to send OTP."); return; }
      setStep(STEPS.OTP);
      makeTimer(setResendTimer);
    } catch { setError("Cannot connect to server. Is the backend running?"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the 6-digit OTP."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/signup/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Invalid OTP."); return; }
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch { setError("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(["", "", "", "", "", ""]); setError(""); makeTimer(setResendTimer);
    await fetch(`${API}/resend-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => {});
  };

  // Forgot password handlers
  const handleFpSendOtp = async (e) => {
    e.preventDefault();
    if (!fpEmail) { setError("Enter your email address."); return; }
    if (!/\S+@\S+\.\S+/.test(fpEmail)) { setError("Enter a valid email address."); return; }
    setError(""); setEmailNotFound(false); setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password/send-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Email not found. Please check and try again.");
        setEmailNotFound(true);
        return;
      }
      setFpStep(FP_STEPS.OTP);
      makeTimer(setFpResendTimer);
    } catch { setError("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  const handleFpVerifyOtp = async (e) => {
    e.preventDefault();
    const code = fpOtp.join("");
    if (code.length < 6) { setError("Please enter the 6-digit OTP."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Invalid OTP."); return; }
      setFpToken(data.reset_token || "");
      setFpStep(FP_STEPS.RESET);
    } catch { setError("Server error."); }
    finally { setLoading(false); }
  };

  const handleFpResend = async () => {
    if (fpResendTimer > 0) return;
    setFpOtp(["", "", "", "", "", ""]); setError(""); makeTimer(setFpResendTimer);
    await fetch(`${API}/resend-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fpEmail }) }).catch(() => {});
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !newConfirm) { setError("Please fill in all fields."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== newConfirm) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password/reset`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, reset_token: fpToken, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Reset failed."); return; }
      setFpStep(null);
      setNewPassword(""); setNewConfirm("");
      setFpOtp(["", "", "", "", "", ""]);
      setFpEmail("");
    } catch { setError("Server error."); }
    finally { setLoading(false); }
  };

  // ── Forgot password screens ──────────────────────────────────────────────

  if (fpStep === FP_STEPS.EMAIL) {
    return (
      <PageShell>
        <Logo />
        <button onClick={() => { setFpStep(null); setError(""); setEmailNotFound(false); }} style={S.backBtn}>
          <ChevronLeft /> Back to sign up
        </button>
        <h1 style={S.heading}>Forgot password?</h1>
        <p style={S.subheading}>Enter your email and we'll send a reset code</p>
        <form onSubmit={handleFpSendOtp} style={S.form}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Email address</label>
            <input
              type="email"
              value={fpEmail}
              onChange={(e) => { setFpEmail(e.target.value); setError(""); setEmailNotFound(false); }}
              placeholder="you@example.com"
              style={error ? { ...S.input, borderColor: "rgba(239,68,68,0.5)" } : S.input}
              autoComplete="email"
            />
            {error && <span style={S.fieldError}>{error}</span>}
            {emailNotFound && (
              <p style={S.notFoundText}>
                Already have an account?{" "}
                <Link to="/login" style={S.notFoundLink}>Sign in</Link>
              </p>
            )}
          </div>
          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? <Spinner label="Sending code…" /> : "Send reset code"}
          </button>
        </form>
      </PageShell>
    );
  }

  if (fpStep === FP_STEPS.OTP) {
    return (
      <PageShell>
        <Logo />
        <button onClick={() => { setFpStep(FP_STEPS.EMAIL); setFpOtp(["","","","","",""]); setError(""); }} style={S.backBtn}>
          <ChevronLeft /> Back
        </button>
        <h1 style={S.heading}>Check your email</h1>
        <p style={S.subheading}>We sent a 6-digit code to<br /><span style={S.emailHighlight}>{fpEmail}</span></p>
        {error && <div style={S.errorBox}>{error}</div>}
        <form onSubmit={handleFpVerifyOtp} style={S.form}>
          <div style={S.otpRow}>{renderOtpBoxes(fpOtp, setFpOtp, "sfp")}</div>
          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? <Spinner label="Verifying…" /> : "Verify code"}
          </button>
        </form>
        <p style={S.resendText}>
          Didn't get it?{" "}
          <button onClick={handleFpResend} disabled={fpResendTimer > 0} style={{ ...S.resendBtn, opacity: fpResendTimer > 0 ? 0.5 : 1 }}>
            {fpResendTimer > 0 ? `Resend in ${fpResendTimer}s` : "Resend code"}
          </button>
        </p>
      </PageShell>
    );
  }

  if (fpStep === FP_STEPS.RESET) {
    return (
      <PageShell>
        <Logo />
        <h1 style={S.heading}>Set new password</h1>
        <p style={S.subheading}>Choose a strong password for your account</p>
        {error && <div style={S.errorBox}>{error}</div>}
        <form onSubmit={handleResetPassword} style={S.form}>
          <div style={S.fieldGroup}>
            <label style={S.label}>New password</label>
            <div style={S.pwWrap}>
              <input type={showNewPw ? "text" : "password"} value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                placeholder="Min. 6 characters" style={{ ...S.input, paddingRight: "44px" }} autoComplete="new-password" />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} style={S.eyeBtn}><EyeIcon open={showNewPw} /></button>
            </div>
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Confirm new password</label>
            <div style={S.pwWrap}>
              <input type={showNewConfirm ? "text" : "password"} value={newConfirm}
                onChange={(e) => { setNewConfirm(e.target.value); setError(""); }}
                placeholder="Re-enter password" style={{ ...S.input, paddingRight: "44px" }} autoComplete="new-password" />
              <button type="button" onClick={() => setShowNewConfirm(!showNewConfirm)} style={S.eyeBtn}><EyeIcon open={showNewConfirm} /></button>
            </div>
          </div>
          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? <Spinner label="Resetting…" /> : "Reset password"}
          </button>
        </form>
      </PageShell>
    );
  }

  // ── Main signup card ─────────────────────────────────────────────────────
  return (
    <PageShell>
      <Logo />
      {step === STEPS.FORM ? (
        <>
          <h1 style={S.heading}>Create account</h1>
          <p style={S.subheading}>Start growing your brand with AI</p>
          {error && <div style={S.errorBox}>{error}</div>}
          <form onSubmit={handleSendOtp} style={S.form}>
            <div style={S.fieldGroup}>
              <label style={S.label}>Full name</label>
              <input type="text" value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Your name" style={S.input} autoComplete="name" />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>Email address</label>
              <input type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" style={S.input} autoComplete="email" />
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>Password</label>
              <div style={S.pwWrap}>
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Min. 6 characters" style={{ ...S.input, paddingRight: "44px" }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={S.eyeBtn}><EyeIcon open={showPassword} /></button>
              </div>
            </div>
            <div style={S.fieldGroup}>
              <label style={S.label}>Confirm password</label>
              <div style={S.pwWrap}>
                <input type={showConfirm ? "text" : "password"} value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  placeholder="Re-enter password" style={{ ...S.input, paddingRight: "44px" }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={S.eyeBtn}><EyeIcon open={showConfirm} /></button>
              </div>
            </div>
            <button type="submit" style={S.btn} disabled={loading}>
              {loading ? <Spinner label="Sending OTP..." /> : "Create Account"}
            </button>
          </form>
          <div style={S.bottomLinks}>
            <button type="button" onClick={() => { setFpStep(FP_STEPS.EMAIL); setFpEmail(email); setError(""); setEmailNotFound(false); }} style={S.forgotBtn}>
              Forgot password?
            </button>
            <p style={S.switchText}>
              Already have an account?{" "}
              <Link to="/login" style={S.switchLink}>Login</Link>
            </p>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => { setStep(STEPS.FORM); setOtp(["","","","","",""]); setError(""); setSuccess(""); }} style={S.backBtn}>
            <ChevronLeft /> Back
          </button>
          <h1 style={S.heading}>Verify your email</h1>
          <p style={S.subheading}>We sent a 6-digit code to<br /><span style={S.emailHighlight}>{email}</span></p>
          {error && <div style={S.errorBox}>{error}</div>}
          {success && <div style={S.successBox}>{success}</div>}
          <form onSubmit={handleVerifyOtp} style={S.form}>
            <div style={S.otpRow}>{renderOtpBoxes(otp, setOtp, "sotp")}</div>
            <button type="submit" style={S.btn} disabled={loading}>
              {loading ? <Spinner label="Verifying..." /> : "Verify & Create Account"}
            </button>
          </form>
          <p style={S.resendText}>
            Didn't receive the code?{" "}
            <button onClick={handleResend} disabled={resendTimer > 0} style={{ ...S.resendBtn, opacity: resendTimer > 0 ? 0.5 : 1 }}>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
            </button>
          </p>
          <p style={{ ...S.switchText, marginTop: "12px" }}>
            Already have an account?{" "}
            <Link to="/login" style={S.switchLink}>Login</Link>
          </p>
        </>
      )}
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.card}>{children}</div>
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
      <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg,#7c6bff,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h8l-1 7 9-11h-8l1-7z" fill="white" /></svg>
      </div>
      <span style={{ color: "#fff", fontWeight: "700", fontSize: "16px" }}>BrandPilot AI</span>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Spinner({ label }) {
  return (
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
      <span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
      {label}
    </span>
  );
}

const S = {
  page: { minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", position: "relative", overflow: "hidden", padding: "20px" },
  blob1: { position: "absolute", top: "-120px", left: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(99,91,255,0.12)", filter: "blur(70px)", pointerEvents: "none" },
  blob2: { position: "absolute", bottom: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(139,92,246,0.1)", filter: "blur(70px)", pointerEvents: "none" },
  card: { background: "#161b27", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "40px 36px", width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 },
  heading: { color: "#fff", fontSize: "24px", fontWeight: "700", margin: "0 0 5px" },
  subheading: { color: "#8b8fa8", fontSize: "13px", margin: "0 0 24px", lineHeight: "1.6" },
  emailHighlight: { color: "#a78bfa", fontWeight: "600" },
  errorBox: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", color: "#f87171", fontSize: "13px", padding: "10px 14px", marginBottom: "18px" },
  successBox: { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", color: "#4ade80", fontSize: "13px", padding: "10px 14px", marginBottom: "18px" },
  fieldError: { color: "#f87171", fontSize: "12px", marginTop: "4px" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { color: "#c1c5d6", fontSize: "13px", fontWeight: "500" },
  input: { background: "#1e2435", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", color: "#e8eaf2", fontSize: "14px", padding: "11px 14px", outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
  pwWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8b8fa8", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" },
  btn: { background: "linear-gradient(135deg,#7c6bff,#a855f7)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "15px", fontWeight: "600", padding: "13px", cursor: "pointer", marginTop: "2px", width: "100%", fontFamily: "inherit" },
  backBtn: { display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", color: "#8b8fa8", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "20px", fontFamily: "inherit" },
  otpRow: { display: "flex", gap: "10px", justifyContent: "center" },
  otpBox: { width: "48px", height: "56px", background: "#1e2435", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "22px", fontWeight: "700", textAlign: "center", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" },
  resendText: { color: "#8b8fa8", fontSize: "13px", textAlign: "center", marginTop: "18px" },
  resendBtn: { background: "none", border: "none", color: "#7c6bff", fontWeight: "600", fontSize: "13px", cursor: "pointer", padding: "0", fontFamily: "inherit" },
  bottomLinks: { marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
  forgotBtn: { background: "none", border: "none", color: "#7c6bff", fontSize: "13px", cursor: "pointer", padding: "0", fontFamily: "inherit" },
  switchText: { color: "#8b8fa8", fontSize: "13px", textAlign: "center", margin: "0" },
  switchLink: { color: "#7c6bff", fontWeight: "600", textDecoration: "none" },
  notFoundText: { color: "#8b8fa8", fontSize: "13px", margin: "4px 0 0" },
  notFoundLink: { color: "#7c6bff", fontWeight: "600", textDecoration: "none" },
};