// ScoreBreakdown — the weighted matching formula made visible (PRD §4.2)
function ScoreBreakdown({ cand }) {
  const { W } = window.OPS;
  const rows = [
    { k: "prox", vi: "Khoảng cách", w: W.prox, c: "var(--teal-600)" },
    { k: "rating", vi: "Đánh giá", w: W.rating, c: "var(--mint-500)" },
    { k: "affinity", vi: "Lịch sử", w: W.affinity, c: "var(--coral-500)" },
    { k: "tier", vi: "Hạng KTV", w: W.tier, c: "var(--amber-500)" },
    { k: "reliability", vi: "Độ tin cậy", w: W.reliability, c: "var(--teal-800)" },
  ];
  return (
    <div className="sbreak">
      {rows.map((r) => {
        const part = cand.parts[r.k];
        const contrib = (r.w * part * 100);
        return (
          <div className="sbar-row" key={r.k}>
            <span className="sbar-label">{r.vi} <span style={{ color: "var(--text-tertiary)", fontWeight: 700 }}>{Math.round(r.w * 100)}%</span></span>
            <span className="sbar-track"><span className="sbar-fill" style={{ width: (part * 100) + "%", background: r.c }}></span></span>
            <span className="sbar-val">+{contrib.toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
}

// Circular TTL countdown
function TtlRing({ ttl, max = 15 }) {
  const r = 20, c = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, ttl / max));
  return (
    <div className="ttlring__ring">
      <svg viewBox="0 0 46 46" style={{ position: "absolute", inset: 0 }}>
        <circle cx="23" cy="23" r={r} fill="none" stroke="var(--coral-100)" strokeWidth="4" />
        <circle cx="23" cy="23" r={r} fill="none" stroke="var(--coral-500)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)} transform="rotate(-90 23 23)"
          style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div className="ttlring__num">{ttl}</div>
    </div>
  );
}

function MatchingPanel({ b, onAssign, onSkip, onExpand, actions }) {
  const { ktvById } = window.OPS;
  const { Button } = window.NovaHostDesignSystem_d39808;
  const [pick, setPick] = React.useState(null); // candidate ktv id expanded for manual assign
  const cands = b.candidates || [];
  const current = cands[b.offerIdx];

  return (
    <div className="dsec" style={{ borderColor: "var(--coral-200, var(--coral-100))" }}>
      <div className="dsec__t" style={{ color: "var(--coral-700)" }}>
        <I n="git-merge" s={14} /> Ghép nối · Offer model (top {cands.length})
      </div>

      {current ? (
        <div className="ttlring" style={{ marginBottom: 14 }}>
          <TtlRing ttl={b.ttl} />
          <div className="ttlring__txt" style={{ flex: 1 }}>
            <b>Đang gửi cho {current.ktv.name}</b>
            <span>TTL còn {b.ttl}s · hết hạn sẽ chuyển KTV kế tiếp</span>
          </div>
          <button className="lull-btn lull-btn--sm lull-btn--ghost" style={{ color: "var(--coral-700)" }} onClick={() => onSkip(b.id)}>
            Bỏ qua <I n="skip-forward" s={14} />
          </button>
        </div>
      ) : (
        <div style={{ background: "var(--crimson-100)", color: "var(--crimson-600)", borderRadius: 8, padding: "11px 13px", marginBottom: 14, fontSize: 10.8, fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}>
          <I n="alert-triangle" s={15} /> Hết ứng viên trong bán kính — cần mở rộng hoặc Ops can thiệp
        </div>
      )}

      {cands.map((c, idx) => {
        const resp = b.responses && b.responses[c.ktv.id];
        const isOffer = idx === b.offerIdx;
        const expanded = pick === c.ktv.id;
        let cls = "cand";
        if (isOffer) cls += " cand--offer";
        if (resp === "declined") cls += " cand--declined";
        return (
          <div key={c.ktv.id}>
            <div className={cls} onClick={() => setPick(expanded ? null : c.ktv.id)}>
              <Av name={c.ktv.name} status={c.ktv.status} size="sm" />
              <div style={{ minWidth: 0 }}>
                <div className="cand__name">{c.ktv.name} <TierTag tier={c.ktv.tier} /></div>
                <div className="cand__meta">
                  <span><I n="star" s={12} style={{ color: "var(--amber-500)", verticalAlign: -2 }} /> {c.ktv.rating}</span>
                  <span className="dot-sep"></span>
                  <span>{c.eta}' · {c.km} km</span>
                  {resp === "declined" ? <><span className="dot-sep"></span><span style={{ color: "var(--crimson-600)", fontWeight: 700 }}>Từ chối</span></> : null}
                  {isOffer ? <><span className="dot-sep"></span><span style={{ color: "var(--coral-700)", fontWeight: 800 }}>ĐANG MỜI · {b.ttl}s</span></> : null}
                </div>
              </div>
              <div className="cand__score">
                <b style={{ color: idx === 0 ? "var(--color-primary)" : "var(--text-primary)" }}>{(c.total * 100).toFixed(0)}</b>
                <span>điểm</span>
              </div>
            </div>
            {expanded ? (
              <div style={{ padding: "0 12px 12px", marginTop: -4 }}>
                <ScoreBreakdown cand={c} />
                <button className="lull-btn lull-btn--sm lull-btn--secondary" style={{ marginTop: 12, width: "100%" }}
                  onClick={(e) => { e.stopPropagation(); onAssign(b.id, c.ktv.id); }}>
                  <I n="user-check" s={15} /> Gán thủ công cho {c.ktv.name.split(" ").slice(-1)[0]}
                </button>
              </div>
            ) : null}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
        <button className="lull-btn lull-btn--sm lull-btn--ghost" style={{ flex: 1 }} onClick={() => onExpand(b.id)}>
          <I n="radius" s={15} /> Mở rộng bán kính
        </button>
        <button className="lull-btn lull-btn--sm lull-btn--ghost" style={{ flex: 1, color: "var(--text-secondary)" }} onClick={() => actions.manual(b.id)}>
          <I n="headset" s={15} /> Ops can thiệp
        </button>
      </div>
    </div>
  );
}

window.MatchingPanel = MatchingPanel;
window.ScoreBreakdown = ScoreBreakdown;
