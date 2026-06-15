// StatusBar — persistent bottom bar (IDE status-bar pattern for desktop ops).
// Left: live system health. Right: page context + the page's primary action,
// always reachable without scrolling. Data-driven per route.

function SbStat({ icon, dot, dotColor, children, tone }) {
  return (
    <span className="sbar__stat" style={tone ? { color: tone } : undefined}>
      {dot ? <span className="sbar__dot" style={{ background: dotColor }}></span> : null}
      {icon ? <I n={icon} s={13} /> : null}
      {children}
    </span>
  );
}

// Build per-route context summary + primary actions.
function buildStatusCtx({ route, counts, onlineKtv, autopilot, OPS, tr, nav, toggleAuto, onPayout }) {
  const fmtVnd = OPS.fmtVnd || ((v) => v.toLocaleString("vi-VN"));
  switch (route) {
    case "dispatch":
    case "bookings": {
      const ctx = (
        <><b>{counts.bookings}</b> {tr("đơn đang xử lý")} · <b style={counts.exceptions ? { color: "var(--crimson-600)" } : null}>{counts.exceptions}</b> {tr("cần can thiệp")}</>
      );
      const actions = counts.exceptions > 0
        ? [{ label: tr("Xử lý ngoại lệ"), icon: "siren", tone: "danger", onClick: () => nav("exceptions") }]
        : [{ label: tr("Xem ngoại lệ"), icon: "list-checks", onClick: () => nav("exceptions") }];
      return { ctx, actions };
    }
    case "exceptions": {
      const autoN = OPS && counts.exceptions;
      const ctx = <><b style={counts.exceptions ? { color: "var(--crimson-600)" } : null}>{counts.exceptions}</b> {tr("ngoại lệ đang mở")}</>;
      const actions = [{
        label: autopilot ? tr("Tắt Auto-pilot") : tr("Bật Auto-pilot"),
        icon: "sparkles", primary: !autopilot, onClick: toggleAuto,
      }];
      return { ctx, actions };
    }
    case "finance": {
      const q = OPS.FIN_PAYOUT_QUEUE || { total: 0, count: 0 };
      const ctx = <><I n="hand-coins" s={13} style={{ verticalAlign: -2, marginRight: 3 }} />{tr("Payout chờ duyệt")}: <b>{fmtVnd(q.total)}</b> · {q.count.toLocaleString("vi-VN")} {tr("khoản")}</>;
      const actions = [{ label: tr("Duyệt chi"), icon: "send", primary: true, onClick: onPayout }];
      return { ctx, actions };
    }
    case "feedback": {
      const inc = OPS.detectPaymentIncident ? OPS.detectPaymentIncident(OPS.FEEDBACK) : { active: false };
      const ctx = inc.active
        ? <span style={{ color: "var(--crimson-600)", fontWeight: 700 }}><I n="siren" s={13} style={{ verticalAlign: -2, marginRight: 3 }} />{tr("Sự cố thanh toán đang diễn ra")}</span>
        : <><b>{counts.feedback}</b> {tr("mục cần chú ý")}</>;
      const actions = [{ label: tr("Mở Đối soát"), icon: "wallet", primary: inc.active, tone: inc.active ? "danger" : null, onClick: () => nav("finance") }];
      return { ctx, actions };
    }
    case "ktv": {
      const KTV = OPS.KTV || [];
      const online = KTV.filter((k) => OPS.ktvGroupOf(k) === "online").length;
      const offline = KTV.filter((k) => OPS.ktvGroupOf(k) === "offline").length;
      const closed = KTV.filter((k) => OPS.ktvGroupOf(k) === "closed").length;
      const ctx = <><b style={{ color: "var(--teal-700)" }}>{online}</b> {tr("online")} · {offline} {tr("offline")} · {closed} {tr("đóng")}</>;
      const actions = [{ label: tr("Tái phân bổ KTV"), icon: "navigation", onClick: () => nav("reposition") }];
      return { ctx, actions };
    }
    case "reposition": {
      const ctx = <><b style={{ color: "var(--teal-700)" }}>{counts.idle}</b> {tr("KTV nhàn rỗi đủ điều kiện")}</>;
      const actions = [{ label: tr("Bản đồ điều phối"), icon: "map", onClick: () => nav("dispatch") }];
      return { ctx, actions };
    }
    case "disputes": {
      const ctx = <><b>{counts.disputes}</b> {tr("tranh chấp chờ phân xử")}</>;
      return { ctx, actions: [] };
    }
    case "customers": {
      const n = (OPS.CUSTOMERS || []).length;
      const atRisk = (OPS.CUSTOMERS || []).filter((c) => OPS.custSegOf(c) === "at_risk" || OPS.custSegOf(c) === "blocked").length;
      const ctx = <><b>{n}</b> {tr("hồ sơ")} · <b style={atRisk ? { color: "var(--coral-700)" } : null}>{atRisk}</b> {tr("cần theo dõi")}</>;
      return { ctx, actions: [] };
    }
    default:
      return { ctx: null, actions: [] };
  }
}

function StatusBar({ route, counts, onlineKtv, autopilot, clock, nav, toggleAuto, onPayout }) {
  const OPS = window.OPS;
  const tr = window.tr || ((s) => s);
  const { ctx, actions } = buildStatusCtx({ route, counts, onlineKtv, autopilot, OPS, tr, nav, toggleAuto, onPayout });

  return (
    <footer className="sbar">
      {/* live system health */}
      <div className="sbar__group">
        <SbStat><span className="sbar__live"></span>{onlineKtv} {tr("KTV online")}</SbStat>
        <span className="sbar__sep"></span>
        <SbStat dot dotColor={counts.exceptions ? "var(--crimson-500)" : "var(--gray-400)"} tone={counts.exceptions ? "var(--crimson-600)" : null}>
          {counts.exceptions} {tr("ngoại lệ")}
        </SbStat>
        <span className="sbar__sep sbar__hide-sm"></span>
        <SbStat icon="sparkles" tone={autopilot ? "var(--teal-700)" : null}>
          {tr("Auto-pilot")} {autopilot ? tr("BẬT") : tr("TẮT")}
        </SbStat>
      </div>

      {/* contextual summary */}
      {ctx ? <div className="sbar__ctx">{ctx}</div> : null}

      <div className="sbar__spacer"></div>

      {/* sync clock */}
      <SbStat icon="circle-check" tone="var(--mint-600)"><span className="sbar__hide-sm">{tr("Đồng bộ")} </span>{clock}</SbStat>

      {/* primary action(s) */}
      {actions && actions.length ? (
        <div className="sbar__actions">
          {actions.map((a, i) => (
            <button
              key={i}
              className={"sbar__btn" + (a.primary ? " sbar__btn--primary" : "") + (a.tone === "danger" ? " sbar__btn--danger" : "")}
              onClick={a.onClick}
            >
              {a.icon ? <I n={a.icon} s={14} /> : null}{a.label}
            </button>
          ))}
        </div>
      ) : null}
    </footer>
  );
}

Object.assign(window, { StatusBar });
