// ConfirmDialog — bước xác nhận cho thao tác quyết định quan trọng.
// Dùng qua hook: const [confirmEl, askConfirm] = useConfirm();
// askConfirm({ title, message, detail, impact, confirmLabel, cancelLabel, tone, icon, onConfirm,
//   verify: { reason, approver } })  // có verify → bắt xác minh 2 lớp (step-up) trước khi cho phép
//   tone: "danger" | "primary" | "warn"
const { useState: useCfState, useCallback: useCfCb, useEffect: useCfEffect, useRef: useCfRef } = React;

function ConfirmDialog({ data, onClose }) {
  const [code, setCode] = useCfState("");
  const [attempts, setAttempts] = useCfState(0);
  const [err, setErr] = useCfState("");
  const [ok, setOk] = useCfState(false);
  const [mode, setMode] = useCfState("otp");        // otp | recovery | backup
  const [escalated, setEscalated] = useCfState(false);
  const [expected, setExpected] = useCfState("");
  const [backup, setBackup] = useCfState("");
  const inputRef = useCfRef(null);

  // Mỗi lần mở một thử thách mới → sinh mã, reset trạng thái
  useCfEffect(() => {
    if (data && data.verify) {
      setExpected(String(Math.floor(100000 + Math.random() * 900000)));
      const blk = () => Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "X");
      setBackup(blk() + "-" + blk());
      setCode(""); setAttempts(0); setErr(""); setOk(false); setMode("otp"); setEscalated(false);
      setTimeout(() => { try { inputRef.current && inputRef.current.focus(); } catch (e) {} }, 60);
    }
  }, [data]);

  if (!data) return null;
  const tone = data.tone || "primary";
  const toneColor = tone === "danger" ? "var(--crimson-500)" : tone === "warn" ? "var(--amber-500)" : "var(--teal-700)";
  const toneSoft = tone === "danger" ? "var(--crimson-100)" : tone === "warn" ? "var(--amber-100)" : "var(--teal-50)";
  const icon = data.icon || (tone === "danger" ? "alert-triangle" : tone === "warn" ? "alert-circle" : "help-circle");

  const needVerify = !!data.verify;
  const approver = (data.verify && data.verify.approver) || "Trưởng Tài chính";
  const LOCK_AT = 3;
  const locked = attempts >= LOCK_AT;
  const verified = ok || !needVerify;

  const submitCode = () => {
    if (locked) return;
    if (code === expected) { setOk(true); setErr(""); }
    else {
      const n = attempts + 1;
      setAttempts(n); setCode("");
      setErr(n >= LOCK_AT ? "Sai quá số lần cho phép — phiên duyệt chi đã bị khoá." : "Mã không đúng. Còn " + (LOCK_AT - n) + " lần thử.");
      try { inputRef.current && inputRef.current.focus(); } catch (e) {}
    }
  };
  const submitBackup = () => {
    if (code.toUpperCase().replace(/\s/g, "") === backup.replace("-", "").replace("-", "")) { setOk(true); setErr(""); }
    else if (code.toUpperCase() === backup) { setOk(true); setErr(""); }
    else setErr("Mã dự phòng không đúng. Mỗi mã chỉ dùng được một lần.");
  };

  const confirm = () => { if (!verified) return; data.onConfirm && data.onConfirm(); onClose(); };
  const goRecovery = () => { setMode("recovery"); setErr(""); setCode(""); };

  // ---- render verify body theo mode ----
  function renderVerify() {
    if (ok) return <div className="cf-verify__okmsg"><I n="check" s={13} /> Đã xác minh — bạn có thể duyệt chi.</div>;

    if (escalated) return (
      <div className="cf-recov__done">
        <div className="cf-recov__doneic"><I n="send" s={16} /></div>
        <div><b>Đã chuyển yêu cầu cho {approver}</b><div className="cf-recov__donesub">Khoản chi này cần {approver} đăng nhập và phê duyệt. Bạn sẽ nhận thông báo khi hoàn tất — bạn <b>không</b> tự chi được khi chưa xác minh.</div></div>
      </div>
    );

    if (mode === "backup") return (
      <>
        <div className="cf-verify__reason">Nhập một <b>mã dự phòng</b> (8 ký tự) đã lưu khi thiết lập bảo mật. Mỗi mã chỉ dùng được một lần.</div>
        <div className="cf-otp">
          <I n="shield-check" s={16} style={{ color: "var(--text-tertiary)", flex: "none" }} />
          <input ref={inputRef} className="cf-otp__in cf-otp__in--backup" autoComplete="off" maxLength={9} placeholder="XXXX-XXXX"
            value={code} onChange={(e) => { setErr(""); setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 9)); }}
            onKeyDown={(e) => { if (e.key === "Enter") submitBackup(); }} />
          <button className="cf-otp__go" disabled={code.replace("-", "").length < 8} onClick={submitBackup}>Xác minh</button>
        </div>
        {err ? <div className="cf-verify__err"><I n="alert-circle" s={13} /> {err}</div> : null}
        <div className="cf-verify__demo"><I n="key-round" s={12} /> Mã dự phòng (demo): <b className="mono">{backup}</b></div>
        <button className="cf-recov__back" onClick={() => { setMode("recovery"); setErr(""); setCode(""); }}><I n="arrow-left" s={12} /> Cách khôi phục khác</button>
      </>
    );

    if (mode === "recovery") return (
      <>
        <div className="cf-verify__reason">Không có mã từ ứng dụng xác thực? Chọn một cách khôi phục an toàn — hệ thống <b>không</b> bỏ qua bước xác minh.</div>
        <div className="cf-recov">
          <button className="cf-recov__opt" onClick={() => { setMode("backup"); setErr(""); setCode(""); setTimeout(() => { try { inputRef.current && inputRef.current.focus(); } catch (e) {} }, 50); }}>
            <span className="cf-recov__ic" style={{ background: "var(--teal-50)", color: "var(--teal-700)" }}><I n="shield-check" s={15} /></span>
            <span className="cf-recov__txt"><b>Dùng mã dự phòng</b><span>Mã 8 ký tự lưu khi thiết lập 2FA</span></span>
            <I n="chevron-right" s={15} style={{ color: "var(--text-tertiary)" }} />
          </button>
          <button className="cf-recov__opt" onClick={() => setEscalated(true)}>
            <span className="cf-recov__ic" style={{ background: "var(--amber-100)", color: "var(--amber-600)" }}><I n="users" s={15} /></span>
            <span className="cf-recov__txt"><b>Nhờ {approver} duyệt (2 người)</b><span>Chuyển khoản chi cho người có quyền phê duyệt</span></span>
            <I n="chevron-right" s={15} style={{ color: "var(--text-tertiary)" }} />
          </button>
          <button className="cf-recov__opt" onClick={() => setMode("security")}>
            <span className="cf-recov__ic" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }}><I n="headset" s={15} /></span>
            <span className="cf-recov__txt"><b>Khôi phục qua đội Bảo mật</b><span>Xác minh danh tính trực tiếp · không tức thời</span></span>
            <I n="chevron-right" s={15} style={{ color: "var(--text-tertiary)" }} />
          </button>
        </div>
        {!locked ? <button className="cf-recov__back" onClick={() => { setMode("otp"); setErr(""); }}><I n="arrow-left" s={12} /> Quay lại nhập mã</button> : null}
      </>
    );

    if (mode === "security") return (
      <div className="cf-recov__done">
        <div className="cf-recov__doneic" style={{ background: "var(--gray-600)" }}><I n="headset" s={16} /></div>
        <div><b>Khôi phục qua đội Bảo mật</b><div className="cf-recov__donesub">Liên hệ <b>security@lull.vn</b> hoặc hotline nội bộ <b>#1900</b>. Đội Bảo mật sẽ xác minh danh tính (giấy tờ + người quản lý xác nhận) rồi cấp lại 2FA. Đây là quy trình có chủ đích chậm để chống chiếm quyền.</div>
        <button className="cf-recov__back" onClick={() => setMode("recovery")}><I n="arrow-left" s={12} /> Cách khôi phục khác</button></div>
      </div>
    );

    // mode === "otp"
    if (locked) return (
      <>
        <div className="cf-verify__lockmsg"><I n="lock" s={13} /> Đã nhập sai {LOCK_AT} lần. Để bảo vệ quỹ chi trả, nhập mã trực tiếp đã bị khoá — hãy khôi phục bằng cách an toàn bên dưới.</div>
        <button className="cf-recov__cta" onClick={goRecovery}><I n="life-buoy" s={14} /> Khôi phục quyền duyệt chi</button>
      </>
    );
    return (
      <>
        <div className="cf-verify__reason">{data.verify.reason || "Duyệt chi là thao tác chuyển tiền không thể thu hồi. Nhập mã 6 số từ ứng dụng xác thực (Authenticator) để xác nhận chính bạn đang thao tác."}</div>
        <div className="cf-otp">
          <I n="key-round" s={16} style={{ color: "var(--text-tertiary)", flex: "none" }} />
          <input ref={inputRef} className="cf-otp__in" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="––––––"
            value={code} onChange={(e) => { setErr(""); setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); }}
            onKeyDown={(e) => { if (e.key === "Enter" && code.length === 6) submitCode(); }} />
          <button className="cf-otp__go" disabled={code.length !== 6} onClick={submitCode}>Xác minh</button>
        </div>
        {err ? <div className="cf-verify__err"><I n="alert-circle" s={13} /> {err}</div> : null}
        <div className="cf-verify__row">
          <span className="cf-verify__demo"><I n="smartphone" s={12} /> Trình xác thực (demo): <b className="mono">{expected}</b></span>
          <button className="cf-verify__help" onClick={goRecovery}>Không nhập được mã?</button>
        </div>
      </>
    );
  }

  const headTitle = ok ? "Đã xác minh danh tính"
    : escalated ? "Đã chuyển phê duyệt"
    : (mode === "recovery" || mode === "backup" || mode === "security") ? "Khôi phục xác minh"
    : locked ? "Phiên đã bị khoá" : "Xác minh lại danh tính";
  const headIcon = ok ? "shield-check" : (locked && mode === "otp") ? "shield-x" : (mode !== "otp" || escalated) ? "life-buoy" : "shield-alert";
  const headClass = ok ? "cf-verify--ok" : (locked && mode === "otp") ? "cf-verify--lock" : (mode !== "otp" || escalated) ? "cf-verify--recov" : "";

  return (
    <div className="cf-scrim" onClick={onClose}>
      <div className="cf-box" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="cf-icon" style={{ background: toneSoft, color: toneColor }}><I n={icon} s={24} /></div>
        <h3 className="cf-title">{data.title}</h3>
        <p className="cf-msg">{data.message}</p>
        {data.detail ? (
          <div className="cf-detail">
            {(Array.isArray(data.detail) ? data.detail : [data.detail]).map((d, i) => (
              <div className="cf-detail__row" key={i}><I n="dot" s={14} style={{ color: toneColor, flex: "none" }} /><span>{d}</span></div>
            ))}
          </div>
        ) : null}
        {data.impact ? (
          <div className="cf-impact" style={{ borderColor: toneColor, background: toneSoft }}>
            <I n="info" s={15} style={{ color: toneColor, flex: "none" }} />
            <span>{data.impact}</span>
          </div>
        ) : null}

        {needVerify ? (
          <div className={"cf-verify " + headClass}>
            <div className="cf-verify__head">
              <span className="cf-verify__badge"><I n={headIcon} s={14} /></span>
              <b>{headTitle}</b>
              {!ok && !escalated && mode === "otp" && !locked ? <span className="cf-verify__req">bắt buộc</span> : null}
            </div>
            {renderVerify()}
          </div>
        ) : null}

        <div className="cf-actions">
          <button className="lull-btn lull-btn--ghost cf-btn" onClick={onClose}>{(locked || escalated) ? "Đóng" : (data.cancelLabel || "Huỷ bỏ")}</button>
          <button className="lull-btn cf-btn cf-btn--go"
            style={{ background: verified ? toneColor : "var(--gray-200)", borderColor: verified ? toneColor : "var(--gray-200)", color: verified ? "#fff" : "var(--text-tertiary)", cursor: verified ? "pointer" : "not-allowed" }}
            onClick={confirm} disabled={!verified} autoFocus={!needVerify}>
            {needVerify && !ok ? <I n="lock" s={15} /> : (data.confirmIcon ? <I n={data.confirmIcon} s={16} /> : null)}
            {data.confirmLabel || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}

function useConfirm() {
  const [data, setData] = useCfState(null);
  const askConfirm = useCfCb((cfg) => setData(cfg), []);
  const el = <ConfirmDialog data={data} onClose={() => setData(null)} />;
  return [el, askConfirm];
}

Object.assign(window, { ConfirmDialog, useConfirm });
