// Phân xử tranh chấp — dual-claim arbitration UI.

// repeat-behavior badge
function RepeatFlag({ icon, n, label, tone }) {
  const c = tone === "client" ? "var(--coral-500)" : "var(--teal-700)";
  return (
    <span className="repflag" style={{ color: c, background: `color-mix(in srgb, ${c} 12%, white)` }} title={label}>
      <I n={icon} s={12} /> {n}× {label}
    </span>
  );
}

// horizontal lean meter: client (left) ←→ ktv (right)
function LeanMeter({ adv }) {
  const pct = 50 + adv.lean * 50; // 0..100, 50 = neutral
  const clamped = Math.max(6, Math.min(94, pct));
  return (
    <div className="leanmeter">
      <div className="leanmeter__ends"><span><I n="user-round" s={12} /> Khách</span><span>KTV <I n="hand-helping" s={12} /></span></div>
      <div className="leanmeter__track">
        <div className="leanmeter__mid"></div>
        <div className="leanmeter__knob" style={{ left: clamped + "%", background: adv.leanSide === "ktv" ? "var(--teal-600)" : adv.leanSide === "client" ? "var(--coral-500)" : "var(--gray-500)" }}></div>
      </div>
    </div>
  );
}

// one party column (claim card)
function PartyClaim({ who, p, tone, extra }) {
  const c = tone === "client" ? "var(--coral-500)" : "var(--teal-700)";
  const soft = tone === "client" ? "var(--coral-50)" : "var(--teal-50)";
  return (
    <div className="claimcard" style={{ borderTopColor: c }}>
      <div className="claimcard__head">
        <Av name={p.name} size="sm" />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="claimcard__role" style={{ color: c }}>{who}</div>
          <div className="claimcard__name">{p.name}</div>
        </div>
        {p.tier ? <TierTag tier={p.tier} /> : (
          <span className="trust" style={{ color: trustColor(p.trust), fontSize: 10.3 }}>
            <span className="trust__bar" style={{ width: 36 }}><span className="trust__fill" style={{ width: p.trust + "%", background: trustColor(p.trust) }}></span></span>{p.trust}
          </span>
        )}
      </div>
      <p className="claimcard__quote" style={{ background: soft }}>“{p.claim}”</p>
      <div className="claimcard__flags">
        {tone === "client"
          ? <>
              <RepeatFlag icon="message-circle-warning" n={p.complaints} label={"phàn nàn / " + p.complaintsWindow} tone="client" />
              <RepeatFlag icon="rotate-ccw" n={p.refundsWon} label="hoàn thắng" tone="client" />
            </>
          : <>
              <RepeatFlag icon="flag" n={p.accusations} label={"tố khách / " + p.accWindow} tone="ktv" />
              {p.rating ? <span className="repflag" style={{ color: "var(--amber-600)", background: "var(--amber-100)" }}><I n="star" s={12} /> {p.rating}</span> : null}
            </>}
      </div>
      {extra}
    </div>
  );
}

function DisputeAdvisory({ adv, d }) {
  return (
    <div className="dsec" style={{ borderColor: "var(--teal-200, var(--teal-100))" }}>
      <div className="dsec__t" style={{ color: "var(--teal-800)" }}>
        <span className="aicard__spark" style={{ width: 20, height: 20 }}><I n="scale" s={12} /></span> AI cố vấn phân xử
        <span className="airisk" style={{ marginLeft: "auto", color: "var(--amber-600)", background: "var(--amber-100)" }}><I n="lock" s={11} /> Không tự quyết · cần người</span>
      </div>
      <LeanMeter adv={adv} />
      <div className="row between" style={{ margin: "12px 0 4px" }}>
        <b style={{ fontSize: 11.6 }}>{adv.leanLabel}</b>
        <span className="muted" style={{ fontSize: 10.3, fontWeight: 700 }}>Độ chắc chắn {Math.round(adv.conf * 100)}%</span>
      </div>
      <div className="confmeter" style={{ marginBottom: 12 }}>
        <div className="confmeter__track" style={{ flex: 1, width: "auto" }}><div className="confmeter__fill" style={{ width: Math.round(adv.conf * 100) + "%", background: adv.conf >= 0.65 ? "var(--amber-500)" : "var(--crimson-500)" }}></div></div>
      </div>
      <div className="advfactors">
        {adv.factors.map((f, i) => (
          <div className="advfactor" key={i}><I n={f.icon} s={14} style={{ color: "var(--text-tertiary)", flex: "none" }} /><span>{f.t}</span></div>
        ))}
      </div>
      <div className="advsuggest"><I n="lightbulb" s={15} /><div><b>Gợi ý xử lý</b><span>{adv.suggest}</span></div></div>
      <div className="advwarn"><I n="triangle-alert" s={13} /> Ca khó phân xử — AI chỉ tổng hợp tín hiệu, quyết định cuối cùng do điều phối viên chịu trách nhiệm.</div>
    </div>
  );
}

// list page
function DisputesPage({ onSelect }) {
  const { DISPUTES, DISPUTE_CAT, SERVICES, disputeDifficulty, fmtMoney, ago } = window.OPS;
  const sorted = DISPUTES.slice().sort((a, b) => b.difficulty - a.difficulty);
  const veryHard = DISPUTES.filter((d) => d.difficulty >= 85).length;
  const repeatBoth = DISPUTES.filter((d) => d.client.complaints >= 5 && d.ktv.accusations >= 3).length;

  return (
    <div className="page">
      <div>
        <h1 className="topbar__title" style={{ marginBottom: 2 }}>{window.tr("Phân xử tranh chấp")}</h1>
        <p className="page__lead">{window.tr("Các ca khách phàn nàn liên tục vs KTV tố cáo liên tục, lời khai mâu thuẫn, bằng chứng không ngã ngũ. AI tổng hợp tín hiệu — điều phối viên ra phán quyết.")}</p>
      </div>

      <div className="exsummary" style={{ maxWidth: 680 }}>
        <div className="exsum-tile" style={{ borderColor: "var(--crimson-500)" }}>
          <div className="exsum-n" style={{ color: "var(--crimson-500)" }}>{DISPUTES.length}</div>
          <div className="exsum-l"><I n="gavel" s={14} style={{ color: "var(--crimson-500)" }} /> Đang chờ phân xử</div>
        </div>
        <div className="exsum-tile" style={{ borderColor: "var(--amber-500)" }}>
          <div className="exsum-n" style={{ color: "var(--amber-500)" }}>{veryHard}</div>
          <div className="exsum-l"><I n="flame" s={14} style={{ color: "var(--amber-500)" }} /> Rất khó (≥85)</div>
        </div>
        <div className="exsum-tile" style={{ borderColor: "var(--teal-500)" }}>
          <div className="exsum-n" style={{ color: "var(--teal-700)" }}>{repeatBoth}</div>
          <div className="exsum-l"><I n="repeat" s={14} style={{ color: "var(--teal-700)" }} /> Cả hai bên tái phạm</div>
        </div>
      </div>

      <div className="card-grid">
        {sorted.map((d) => {
          const cat = DISPUTE_CAT[d.cat]; const diff = disputeDifficulty(d);
          const bothRepeat = d.client.complaints >= 5 && d.ktv.accusations >= 3;
          return (
            <div className="dispcard" key={d.id} onClick={() => onSelect(d.id)}>
              <div className="dispcard__cat" style={{ background: diff.soft, color: diff.text }}><I n={cat.icon} s={20} /></div>
              <div className="dispcard__body">
                <div className="row gap6" style={{ flexWrap: "wrap" }}>
                  <b style={{ fontSize: 12.5 }}>{cat.vi}</b>
                  <span className="diffpill" style={{ color: "#fff", background: diff.color }}><I n="gauge" s={11} /> {diff.vi} · {d.difficulty}</span>
                  {d.safetyLock ? <span className="diffpill" style={{ color: "var(--crimson-600)", background: "var(--crimson-100)" }}><I n="siren" s={11} /> SOS</span> : null}
                  {bothRepeat ? <span className="diffpill" style={{ color: "var(--teal-800)", background: "var(--teal-100)" }}><I n="repeat" s={11} /> 2 bên tái phạm</span> : null}
                </div>
                <div className="muted" style={{ fontSize: 10.8, marginTop: 3 }}>
                  <b style={{ color: "var(--text-primary)" }}>{d.id}</b> · {d.bookingId} · {SERVICES[d.svc].vi} · {d.region} · {fmtMoney(d.amount)} · {ago(d.openedAt)}
                </div>
                <div className="dispcard__vs">
                  <span className="vsparty vsparty--client"><I n="user-round" s={13} /> {d.client.name} <em>{d.client.complaints}× phàn nàn</em></span>
                  <span className="vsx">đối chất</span>
                  <span className="vsparty vsparty--ktv"><I n="hand-helping" s={13} /> {d.ktv.name} <em>{d.ktv.accusations}× tố cáo</em></span>
                </div>
                <p className="dispcard__conflict">{d.conflict}</p>
              </div>
              <I n="chevron-right" s={20} style={{ color: "var(--text-tertiary)", alignSelf: "center", flex: "none" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// detail drawer
function DisputeDrawer({ d, onClose, onRule }) {
  const { DISPUTE_CAT, SERVICES, disputeDifficulty, disputeAdvisory, RULINGS, fmtMoney, ago } = window.OPS;
  if (!d) return null;
  const cat = DISPUTE_CAT[d.cat]; const diff = disputeDifficulty(d); const adv = disputeAdvisory(d);
  const sideColor = { client: "var(--coral-500)", ktv: "var(--teal-700)", neutral: "var(--gray-500)" };
  const sideLabel = { client: "Lợi cho khách", ktv: "Lợi cho KTV", neutral: "Trung lập" };

  return (
    <div className="drawer drawer--wide drawer--on">
      <div className="drawer__head">
        <div className="row between" style={{ marginBottom: 10 }}>
          <span className="drawer__id">{d.id} · {d.bookingId} · {ago(d.openedAt)}</span>
          <button className="icon-pill" style={{ width: 34, height: 34, border: "none", boxShadow: "none" }} onClick={onClose}><I n="x" s={18} /></button>
        </div>
        <div className="row between">
          <div className="row gap10">
            <div className="dispcard__cat" style={{ background: diff.soft, color: diff.text, width: 42, height: 42 }}><I n={cat.icon} s={20} /></div>
            <div>
              <div style={{ fontSize: 14.6, fontWeight: 800, letterSpacing: "-.01em" }}>{cat.vi}</div>
              <div className="muted" style={{ fontSize: 10.8 }}>{SERVICES[d.svc].vi} · {d.region} · {fmtMoney(d.amount)}</div>
            </div>
          </div>
          <span className="diffpill" style={{ color: "#fff", background: diff.color, height: 26 }}><I n="gauge" s={12} /> {diff.vi} · {d.difficulty}</span>
        </div>
      </div>

      <div className="drawer__body">
        {d.safetyLock ? (
          <div className="safetybanner"><I n="siren" s={17} /><div><b>Liên quan an toàn KTV (SOS)</b><span>Chính sách bảo vệ KTV ưu tiên — không phạt KTV khi SOS hợp lệ.</span></div></div>
        ) : null}

        {/* dual claim */}
        <div className="claimgrid">
          <PartyClaim who="KHÁCH HÀNG" p={d.client} tone="client" />
          <PartyClaim who="KỸ THUẬT VIÊN" p={d.ktv} tone="ktv" />
        </div>

        {/* conflict summary */}
        <div className="dsec">
          <div className="dsec__t"><I n="git-compare-arrows" s={14} /> Vì sao khó phân xử</div>
          <p style={{ margin: 0, fontSize: 11.6, lineHeight: 1.55, color: "var(--ink-soft)" }}>{d.conflict}</p>
        </div>

        {/* evidence locker */}
        <div className="dsec">
          <div className="dsec__t"><I n="folder-search" s={14} /> Kho bằng chứng <span className="panel__count" style={{ marginLeft: "auto" }}>{d.evidence.length}</span></div>
          <div className="evlist">
            {d.evidence.map((e, i) => (
              <div className="evrow" key={i}>
                <span className="evrow__ic" style={{ background: `color-mix(in srgb, ${sideColor[e.side]} 13%, white)`, color: sideColor[e.side] }}><I n={e.icon} s={15} /></span>
                <span className="evrow__t">{e.t}</span>
                <span className="evrow__side" style={{ color: sideColor[e.side], borderColor: sideColor[e.side] }}>{sideLabel[e.side]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI advisory */}
        <DisputeAdvisory adv={adv} d={d} />

        {/* ruling */}
        <div className="dsec">
          <div className="dsec__t"><I n="gavel" s={14} /> Phán quyết của điều phối viên</div>
          <div className="rulegrid">
            {RULINGS.map((r) => {
              const c = r.tone === "client" ? "var(--coral-500)" : r.tone === "ktv" ? "var(--teal-700)" : "var(--gray-500)";
              return (
                <button key={r.key} className="rulebtn" onClick={() => onRule(d.id, r)}>
                  <span className="rulebtn__ic" style={{ color: c }}><I n={r.icon} s={16} /></span>{r.vi}
                </button>
              );
            })}
          </div>
          <div className="advwarn" style={{ marginTop: 10 }}><I n="info" s={13} /> Mọi phán quyết được ghi log kèm danh tính người xử lý để đối soát sau.</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DisputesPage, DisputeDrawer });
