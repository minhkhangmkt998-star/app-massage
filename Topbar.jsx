// Topbar — title, region selector, live KTV count, alerts
function Topbar({ title, sub, region, onRegion, onlineKtv, clock, autopilot, onToggleAuto }) {
  const { REGIONS } = window.OPS;
  const [open, setOpen] = React.useState(false);
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar__title" style={{ fontFamily: "\"Plus Jakarta Sans\"" }}>{title}</h1>
        {sub ? <div className="topbar__sub">{sub}</div> : null}
      </div>
      <div className="topbar__spacer"></div>

      <div className="livechip" title={onlineKtv + " KTV đang online"}><span className="livechip__dot"></span><I n="users" s={15} /> {onlineKtv}</div>

      <button className={"aichip aichip--compact" + (autopilot ? " aichip--on" : "")} onClick={onToggleAuto} title={"AI Auto-pilot — tự xử lý case rủi ro thấp (" + (autopilot ? "đang bật" : "đang tắt") + ")"}>
        <span className="aichip__spark"><I n="sparkles" s={16} /></span>
        <span className={"aitoggle" + (autopilot ? " aitoggle--on" : "")}><span className="aitoggle__knob"></span></span>
      </button>

      <div style={{ position: "relative" }}>
        <button className="region-sel" onClick={() => setOpen((o) => !o)}>
          <I n="map-pin" s={17} /> {region} <I n="chevron-down" s={15} style={{ color: "var(--text-tertiary)" }} />
        </button>
        {open ?
        <div style={{ position: "absolute", top: 46, right: 0, zIndex: 30, background: "#fff", border: "1px solid var(--color-border)", borderRadius: 8, boxShadow: "var(--elevation-2)", padding: 6, width: 180 }}>
            {["Tất cả khu vực", ...REGIONS].map((r) =>
          <button key={r} onClick={() => {onRegion(r);setOpen(false);}}
          style={{ display: "block", width: "100%", textAlign: "left", border: "none", background: r === region ? "var(--teal-50)" : "transparent", color: r === region ? "var(--color-primary)" : "var(--text-primary)", fontWeight: r === region ? 700 : 600, padding: "9px 11px", borderRadius: 8, cursor: "pointer", fontSize: 13.5 }}>
                {r}
              </button>
          )}
          </div> :
        null}
      </div>

      <div className="region-sel region-sel--clock" style={{ cursor: "default", gap: 8, color: "var(--text-secondary)" }} title="Giờ hệ thống">
        <I n="clock" s={16} style={{ color: "var(--text-secondary)" }} /> <span className="mono" style={{ color: "var(--text-primary)" }}>{clock}</span>
      </div>

      <button className="icon-pill" title="Thông báo"><I n="bell" s={19} /><span className="icon-pill__count">3</span></button>
    </header>);

}
window.Topbar = Topbar;