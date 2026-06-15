// Exception (edge-case) UI — tag, drawer panel, alert bar, full page.
const SEV_RANK = { critical: 0, high: 1, medium: 2 };

// small severity-tinted pill
function ExTag({ type, size = "md" }) {
  const { exMeta, SEV } = window.OPS;
  const m = exMeta(type);
  if (!m) return null;
  const s = SEV[m.sev];
  return (
    <span className="extag" style={{ color: s.text, background: s.soft, fontSize: size === "sm" ? 10.5 : 11.5, padding: size === "sm" ? "1px 7px" : "2px 9px" }}>
      <I n={m.icon} s={size === "sm" ? 11 : 13} />{m.vi}
    </span>);

}

// minutes since
function sinceMin(d) {return Math.max(0, Math.round((Date.now() - d.getTime()) / 60000));}

// confidence meter
function ConfMeter({ v, color }) {
  return (
    <div className="confmeter">
      <div className="confmeter__track"><div className="confmeter__fill" style={{ width: Math.round(v * 100) + "%", background: color }}></div></div>
      <span className="confmeter__val" style={{ color }}>{Math.round(v * 100)}%</span>
    </div>);

}

// AI Copilot suggestion card (drawer) — recommended action + risk + rationale
function AiSuggestion({ b, onApply, onHold, autopilot }) {
  const { aiRecommend, RISK } = window.OPS;
  const rec = aiRecommend(b);
  if (!rec) return null;
  const r = RISK[rec.risk];
  const counting = autopilot && rec.auto && typeof b.aiCountdown === "number";
  return (
    <div className="aicard">
      <div className="aicard__head">
        <span className="aicard__spark"><I n="sparkles" s={14} /></span>
        <b style={{ fontSize: 13 }}>AI Copilot đề xuất</b>
        <span className="airisk" style={{ color: r.text, background: r.soft, marginLeft: "auto" }}>
          <span className="leg-dot" style={{ width: 7, height: 7, background: r.color }}></span>{r.vi} · {rec.auto ? "Tự xử lý được" : "Cần người duyệt"}
        </span>
      </div>
      <div className="aicard__action">
        <span className="aicard__pick"><I n="wand-sparkles" s={15} /> {rec.action}</span>
        <ConfMeter v={rec.confidence} color={rec.confidence >= 0.8 ? "var(--mint-500)" : rec.confidence >= 0.65 ? "var(--amber-500)" : "var(--crimson-500)"} />
      </div>
      <p className="aicard__why">{rec.why}</p>
      {counting ?
      <div className="aiauto">
          <span className="aiauto__txt"><span className="aiauto__dot"></span> AI sẽ tự xử lý sau <b>{b.aiCountdown}s</b></span>
          <button className="exbtn exbtn--sm" onClick={() => onHold(b.id)}>Giữ lại · tôi tự xử</button>
        </div> :

      <button className="exbtn exbtn--primary" style={{ width: "100%", justifyContent: "center", background: "var(--teal-700)", borderColor: "var(--teal-700)" }} onClick={() => onApply(b.id, rec.action, b.exception.type)}>
          <I n="check" s={15} /> Áp dụng đề xuất AI
        </button>
      }
    </div>);

}

// Drawer panel — the tailored resolution surface for one exception
function ExceptionPanel({ b, onResolve, onHold, autopilot }) {
  const { exMeta, SEV } = window.OPS;
  const ex = b.exception;
  if (!ex) return null;
  const m = exMeta(ex.type);
  const s = SEV[m.sev];
  const elapsed = sinceMin(ex.since);
  const over = m.sla > 0 && elapsed >= m.sla;
  const slaTxt = m.sla === 0 ? "SLA tức thời" : over ? `Trễ ${elapsed - m.sla}′ so với SLA ${m.sla}′` : `Còn ${m.sla - elapsed}′ trước escalate`;

  return (
    <div className="expanel" style={{ borderColor: s.color, background: s.soft }}>
      <div className="expanel__head">
        <div className="expanel__icon" style={{ background: s.color }}><I n={m.icon} s={18} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row gap6" style={{ flexWrap: "wrap" }}>
            <b style={{ fontSize: 15, color: s.text }}>{m.vi}</b>
            <span className="exsev" style={{ color: "#fff", background: s.color }}>{s.vi}</span>
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: s.text, marginTop: 2 }}>
            <I n="timer" s={12} style={{ verticalAlign: -2 }} /> {slaTxt}
          </div>
        </div>
      </div>
      <p className="expanel__detail">{ex.detail}</p>

      {/* AI recommendation */}
      <AiSuggestion b={b} onApply={onResolve} onHold={onHold} autopilot={autopilot} />

      <div className="expanel__label">Hoặc chọn hành động khác</div>
      <div className="expanel__actions">
        {m.actions.map((a) =>
        <button key={a} className="exbtn" onClick={() => onResolve(b.id, a, ex.type)}>{a}</button>
        )}
      </div>
    </div>);

}

// Slim full-width alert bar on the dispatch board (critical only)
function ExceptionAlertBar({ bookings, onShow }) {
  const crit = bookings.filter((b) => b.exception && window.OPS.exMeta(b.exception.type).sev === "critical");
  const high = bookings.filter((b) => b.exception && window.OPS.exMeta(b.exception.type).sev === "high");
  if (!crit.length && !high.length) return null;
  return (
    <div className="exbar" onClick={onShow}>
      <div className="exbar__pulse"><I n="alert-triangle" s={17} /></div>
      <b style={{ fontSize: 13.5 }}>
        {crit.length ? <span>{crit.length} đơn cần can thiệp gấp</span> : null}
        {crit.length && high.length ? <span style={{ opacity: .6, margin: "0 8px" }}>·</span> : null}
        {high.length ? <span style={{ fontWeight: 600 }}>{high.length} cảnh báo</span> : null}
      </b>
      <div className="exbar__names">
        {crit.slice(0, 3).map((b) => <span key={b.id} className="exbar__chip">{b.id} · {window.OPS.exMeta(b.exception.type).vi}</span>)}
      </div>
      <span className="exbar__cta">Xem tất cả <I n="arrow-right" s={14} /></span>
    </div>);

}

// Full page — exceptions grouped by severity + edge-case catalog
function ExceptionsPage({ bookings, onSelect, onResolve, onHold, autopilot, onToggleAuto, aiHandled }) {
  const { exMeta, SEV, EXCEPTIONS, SERVICES, aiRecommend, RISK } = window.OPS;
  const live = bookings.filter((b) => b.exception).sort((a, c) => SEV_RANK[exMeta(a.exception.type).sev] - SEV_RANK[exMeta(c.exception.type).sev]);
  const groups = [
  { sev: "critical", items: live.filter((b) => exMeta(b.exception.type).sev === "critical") },
  { sev: "high", items: live.filter((b) => exMeta(b.exception.type).sev === "high") },
  { sev: "medium", items: live.filter((b) => exMeta(b.exception.type).sev === "medium") }];

  const autoEligible = live.filter((b) => {const r = aiRecommend(b);return r && r.auto;}).length;
  const needHuman = live.length - autoEligible;

  return (
    <div className="page">
      <div>
        <h1 className="topbar__title" style={{ marginBottom: 2 }}>Ngoại lệ cần xử lý</h1>
        <p className="page__lead">Mọi tình huống lệch khỏi luồng chuẩn được gom về đây. AI Copilot đề xuất hướng xử lý cho từng case và tự quyết định các trường hợp ít rủi ro khi bật Auto-pilot.</p>
      </div>

      {/* AI Auto-pilot control strip */}
      <div className={"aibar" + (autopilot ? " aibar--on" : "")}>
        <span className="aibar__spark"><I n="sparkles" s={18} /></span>
        <div style={{ flex: 1 }}>
          <div className="row gap6"><b style={{ fontSize: 14.5 }}>AI Auto-pilot</b>
            <span className="airisk" style={{ color: autopilot ? "var(--mint-600)" : "var(--text-secondary)", background: autopilot ? "var(--mint-100)" : "var(--gray-100)" }}>{autopilot ? "Đang bật" : "Đang tắt"}</span>
          </div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
            Tự xử lý <b style={{ color: "var(--mint-600)" }}>{autoEligible}</b> case rủi ro thấp · chuyển <b style={{ color: "var(--amber-600)" }}>{needHuman}</b> case cho người trực · đã xử lý <b>{aiHandled}</b> hôm nay
          </div>
        </div>
        <button className={"aitoggle" + (autopilot ? " aitoggle--on" : "")} onClick={onToggleAuto} role="switch" aria-checked={autopilot} style={{ backgroundColor: "rgb(108, 225, 61)" }}>
          <span className="aitoggle__knob"></span>
        </button>
      </div>

      {/* severity summary */}
      <div className="exsummary">
        {groups.map((g) => {
          const s = SEV[g.sev];
          return (
            <div className="exsum-tile" key={g.sev} style={{ borderColor: g.items.length ? s.color : "var(--color-border)" }}>
              <div className="exsum-n" style={{ color: s.color }}>{g.items.length}</div>
              <div className="exsum-l"><span className="leg-dot" style={{ background: s.color, width: 9, height: 9 }}></span>{s.vi}</div>
            </div>);

        })}
      </div>

      {groups.map((g) => g.items.length ?
      <div key={g.sev} style={{ marginBottom: 22 }}>
          <div className="exgroup-h"><span className="leg-dot" style={{ background: SEV[g.sev].color }}></span> {SEV[g.sev].vi} <span className="muted" style={{ fontWeight: 600 }}>· {g.items.length}</span></div>
          <div className="card-grid">
            {g.items.map((b) => {
            const m = exMeta(b.exception.type);const s = SEV[m.sev];
            const elapsed = sinceMin(b.exception.since);
            const over = m.sla > 0 && elapsed >= m.sla;
            const rec = aiRecommend(b);const r = rec && RISK[rec.risk];
            const counting = autopilot && rec && rec.auto && typeof b.aiCountdown === "number";
            return (
              <div className="excard" key={b.id} style={{ borderLeftColor: s.color }}>
                  <div className="excard__icon" style={{ background: s.soft, color: s.text }}><I n={m.icon} s={20} /></div>
                  <div className="excard__body">
                    <div className="row gap6" style={{ flexWrap: "wrap" }}>
                      <b style={{ fontSize: 14.5 }}>{m.vi}</b>
                      <ExTag type={b.exception.type} size="sm" />
                      {over ? <span className="extag" style={{ color: "#fff", background: "var(--crimson-500)" }}><I n="alarm-clock-off" s={11} />Trễ SLA</span> : null}
                    </div>
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                      <b style={{ color: "var(--text-primary)" }}>{b.id}</b> · {b.cust} · {SERVICES[b.serviceKey].vi} · {b.region} · {elapsed}′ trước
                    </div>
                    <p style={{ margin: "7px 0 10px", fontSize: 13, color: "var(--ink-soft)" }}>{b.exception.detail}</p>

                    {/* AI recommendation inline */}
                    {rec ?
                  <div className="airow">
                        <span className="airow__spark"><I n="sparkles" s={12} /></span>
                        <span className="airow__txt">AI đề xuất <b>{rec.action}</b></span>
                        <span className="airow__conf" style={{ color: rec.confidence >= 0.8 ? "var(--mint-600)" : rec.confidence >= 0.65 ? "var(--amber-600)" : "var(--crimson-600)" }}>{Math.round(rec.confidence * 100)}%</span>
                        <span className="airow__risk" style={{ color: r.text, background: r.soft }}>{rec.auto ? "tự xử" : "cần duyệt"}</span>
                      </div> :
                  null}

                    <div className="row gap6" style={{ flexWrap: "wrap", marginTop: 9 }}>
                      {counting ?
                    <span className="aiauto aiauto--inline"><span className="aiauto__dot"></span> AI tự xử sau <b>{b.aiCountdown}s</b>
                          <button className="exbtn exbtn--sm" style={{ marginLeft: 8 }} onClick={() => onHold(b.id)}>Giữ lại</button>
                        </span> :

                    <button className="exbtn exbtn--sm exbtn--primary" style={{ background: "var(--teal-700)", borderColor: "var(--teal-700)" }}
                    onClick={() => onResolve(b.id, rec.action, b.exception.type)}><I n="wand-sparkles" s={13} /> Áp dụng AI</button>
                    }
                      {m.actions.filter((a) => a !== (rec && rec.action)).map((a) =>
                    <button key={a} className="exbtn exbtn--sm" onClick={() => onResolve(b.id, a, b.exception.type)}>{a}</button>
                    )}
                      <button className="exbtn exbtn--sm" style={{ marginLeft: "auto", color: "var(--text-secondary)" }} onClick={() => onSelect(b.id)}>
                        Mở đơn <I n="arrow-up-right" s={13} />
                      </button>
                    </div>
                  </div>
                </div>);

          })}
          </div>
        </div> :
      null)}

      {live.length === 0 ? <div className="empty-hint" style={{ height: 160 }}><I n="party-popper" s={18} /> Không còn ngoại lệ nào — luồng đang sạch</div> : null}

      {/* catalog */}
      <div className="exgroup-h" style={{ marginTop: 8 }}><I n="book-open" s={16} style={{ color: "var(--color-primary)" }} /> Danh mục edge case hệ thống xử lý</div>
      <div className="excatalog">
        {Object.entries(EXCEPTIONS).map(([k, m]) => {
          const s = SEV[m.sev];
          return (
            <div className="excat" key={k}>
              <div className="excat__top">
                <span className="excat__ic" style={{ background: s.soft, color: s.text }}><I n={m.icon} s={16} /></span>
                <b style={{ fontSize: 13 }}>{m.vi}</b>
                <span className="excat__sev" style={{ background: s.color }}></span>
              </div>
              <div className="excat__sla">SLA {m.sla === 0 ? "tức thời" : m.sla + "′"} · {m.actions.length} hành động</div>
            </div>);

        })}
      </div>
    </div>);

}

Object.assign(window, { ExTag, ExceptionPanel, ExceptionAlertBar, ExceptionsPage });