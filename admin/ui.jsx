// Shared small helpers for the Ops console (loaded as babel).
// Lucide icon wrapper — renders into a ref-owned span so lucide's DOM
// mutation never collides with React reconciliation (prevents removeChild crash
// when icons are swapped on re-render, e.g. in dialogs).
function I({ n, s = 18, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.innerHTML = "";
    const ic = document.createElement("i");
    ic.setAttribute("data-lucide", n);
    host.appendChild(ic);
    if (window.lucide) { try { window.lucide.createIcons(); } catch (e) {} }
  }, [n]);
  return <span ref={ref} className="i-host" style={{ display: "inline-flex", width: s, height: s, lineHeight: 0, flex: "none", ...(style || {}) }}></span>;
}

// State pill — colored dot + Vietnamese label, pulses when "live".
function StatePill({ state }) {
  const S = window.OPS.STATES[state];
  if (!S) return null;
  const live = S.live ? " spill--live" : "";
  return (
    <span className={"spill" + live} style={{ color: S.color, background: "color-mix(in srgb, " + S.color + " 14%, white)" }}>
      <span className="spill__dot"></span>{window.tr(S.vi)}
    </span>
  );
}

// Tier badge
function TierTag({ tier }) {
  const ic = { Bronze: "circle", Silver: "circle", Gold: "crown", Elite: "gem" }[tier];
  return <span className={"tier tier--" + tier}><I n={ic} s={11} />{tier}</span>;
}

// Avatar that uses the NovaHost DS Avatar
function Av({ name, status, size = "md" }) {
  const { Avatar } = window.NovaHostDesignSystem_d39808;
  return <Avatar name={name} size={size} status={status} />;
}

function trustColor(t) {
  if (t >= 80) return "var(--mint-500)";
  if (t >= 55) return "var(--amber-500)";
  return "var(--crimson-500)";
}

Object.assign(window, { I, StatePill, TierTag, Av, trustColor });
