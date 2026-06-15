// Tái phân bổ KTV — idle detection + move-to-demand suggestions.

function zoneDemandTag(z) {
  if (z.demand >= 0.75) return { vi: "Cầu rất cao", color: "var(--coral-500)", soft: "var(--coral-50)", text: "var(--coral-700)" };
  if (z.demand >= 0.45) return { vi: "Cầu vừa", color: "var(--amber-500)", soft: "var(--amber-100)", text: "var(--amber-600)" };
  return { vi: "Cầu thấp", color: "var(--teal-500)", soft: "var(--teal-50)", text: "var(--teal-800)" };
}

// idle progress bar: idle vs threshold
function IdleBar({ idle, threshold }) {
  const pct = Math.min(100, (idle / Math.max(threshold, idle)) * 100);
  const over = idle >= threshold;
  const markerPct = Math.min(100, (threshold / Math.max(threshold, idle)) * 100);
  return (
    <div className="idlebar">
      <div className="idlebar__track">
        <div className="idlebar__fill" style={{ width: pct + "%", background: over ? "var(--coral-500)" : "var(--amber-500)" }}></div>
        <div className="idlebar__mark" style={{ left: markerPct + "%" }} title={"Ngưỡng " + threshold + "'"}></div>
      </div>
      <div className="idlebar__legend">
        <span><I n="hourglass" s={12} /> Nhàn rỗi <b>{idle}'</b></span>
        <span className="muted">Ngưỡng {threshold}'</span>
      </div>
    </div>
  );
}

// ===== Threshold analysis (answers "sau bao lâu thì hiện đề xuất?") =====
function ThresholdAnalysis() {
  const { ZONES, expectedWait, repoThreshold, KTV } = window.OPS;
  // global recommended range from per-zone thresholds
  const sample = KTV.filter((k) => k.status === "online").map((k) => repoThreshold(k).value);
  const lo = Math.min(...sample), hi = Math.max(...sample);
  const zones = Object.entries(ZONES);
  const maxScale = 75;

  return (
    <>
      <div className="reco-hero">
        <div className="reco-hero__ic"><I n="timer" s={22} /></div>
        <div style={{ flex: 1 }}>
          <div className="reco-hero__k">Đề xuất hiện sau</div>
          <div className="reco-hero__v">{lo}–{hi} <span>phút nhàn rỗi</span></div>
          <p className="reco-hero__d">Ngưỡng <b>thích ứng</b> theo vùng & giờ — không cố định. Thường <b>20–35'</b> ở điều kiện bình thường, hạ còn <b>~15'</b> khi có vùng surge gần kề, và nâng tới <b>~50'</b> khi cả khu vực đều vắng (di chuyển cũng không lợi).</p>
        </div>
      </div>

      <div className="dsec" style={{ maxWidth: 860 }}>
        <div className="dsec__t"><I n="sliders-horizontal" s={14} /> Cách tính ngưỡng · 2 yếu tố</div>
        <div className="factor2">
          <div className="factor2__col">
            <div className="factor2__h" style={{ color: "var(--teal-800)" }}><I n="activity" s={15} /> Bất thường</div>
            <p>Chờ quá <b>1.5×</b> thời gian kỳ vọng của chính vùng đó → có gì đó không ổn dù vùng vốn vắng.</p>
            <code>ngưỡng₁ = 1.5 × chờ_kỳ_vọng(vùng)</code>
          </div>
          <div className="factor2__col">
            <div className="factor2__h" style={{ color: "var(--coral-700)" }}><I n="trending-up" s={15} /> Cơ hội</div>
            <p>Có vùng cầu cao hơn rõ rệt gần kề → <b>hạ ngưỡng</b> để nudge sớm, chênh cầu càng lớn càng sớm.</p>
            <code>ngưỡng₂ = 36 − 26 × chênh_cầu</code>
          </div>
        </div>
        <div className="factor2__sum"><I n="git-merge" s={14} /> Ngưỡng hiển thị = <b>min(ngưỡng₁, ngưỡng₂)</b>, kẹp trong [15', 50']. Kèm cooldown 20' để không nhắc lại quá dày.</div>
      </div>

      <div className="dsec" style={{ maxWidth: 860 }}>
        <div className="dsec__t"><I n="map" s={14} /> Ngưỡng theo từng vùng hiện tại</div>
        <div className="zbars">
          {zones.map(([name, z]) => {
            const tag = zoneDemandTag(z);
            const ew = expectedWait(z.demand);
            const thr = window.OPS.repoThreshold({ zone: name, idleMin: 0 });
            return (
              <div className="zbar" key={name}>
                <div className="zbar__name">{name}
                  <span className="zbar__dtag" style={{ color: tag.text, background: tag.soft }}>{tag.vi}{z.surge > 1 ? " · " + z.surge + "×" : ""}</span>
                </div>
                <div className="zbar__track">
                  <div className="zbar__wait" style={{ width: (ew / maxScale * 100) + "%" }} title={"Chờ kỳ vọng " + ew + "'"}></div>
                  <div className="zbar__thr" style={{ left: (thr.value / maxScale * 100) + "%" }}></div>
                </div>
                <div className="zbar__nums"><span>chờ ~{ew}'</span><b style={{ color: "var(--coral-700)" }}>đề xuất sau {thr.value}'</b></div>
              </div>
            );
          })}
        </div>
        <div className="zbars__legend">
          <span><span className="leg-dot" style={{ background: "var(--teal-300)" }}></span> Thời gian chờ kỳ vọng</span>
          <span><span className="zbar__thrdot"></span> Mốc hiện đề xuất di chuyển</span>
        </div>
      </div>
    </>
  );
}

// ===== reposition suggestion card =====
function RepoCard({ row, onSend, onSkip }) {
  const { ZONES, hourlyEarn, fmtMoney } = window.OPS;
  const { ktv, thr, sug, over, eligible } = row;
  if (!sug) return null;
  const hereTag = zoneDemandTag(ZONES[ktv.zone]);
  const destTag = zoneDemandTag(sug.z);

  return (
    <div className={"repocard" + (eligible ? " repocard--hot" : "")}>
      <div className="repocard__main">
        <Av name={ktv.name} status={ktv.status} size="md" />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="row gap6"><b style={{ fontSize: 12.5 }}>{ktv.name}</b><TierTag tier={ktv.tier} />
            {eligible ? <span className="diffpill" style={{ color: "#fff", background: "var(--coral-500)" }}><I n="bell-ring" s={11} /> Nên gợi ý ngay</span>
              : <span className="diffpill" style={{ color: "var(--text-secondary)", background: "var(--gray-100)" }}><I n="eye" s={11} /> Đang theo dõi</span>}
          </div>
          <div className="muted" style={{ fontSize: 10.3, marginTop: 2 }}>{ktv.sessions} buổi · nhận {Math.round(ktv.accept * 100)}% · đang ở {ktv.zone}</div>
        </div>
        {eligible ? <div className="repocard__over"><b>+{over}'</b><span>quá ngưỡng</span></div> : <div className="repocard__over" style={{ color: "var(--text-tertiary)" }}><b>{thr.value - ktv.idleMin}'</b><span>còn lại</span></div>}
      </div>

      <IdleBar idle={ktv.idleMin} threshold={thr.value} />

      <div className="reroute">
        <div className="reroute__node">
          <span className="reroute__z" style={{ color: hereTag.text }}><I n="map-pin" s={13} /> {ktv.zone}</span>
          <span className="reroute__tag" style={{ color: hereTag.text, background: hereTag.soft }}>{hereTag.vi}</span>
        </div>
        <div className="reroute__arrow"><I n="move-right" s={18} /><span>{sug.tMin}' di chuyển</span></div>
        <div className="reroute__node">
          <span className="reroute__z" style={{ color: destTag.text }}><I n="map-pin" s={13} /> {sug.zone}</span>
          <span className="reroute__tag" style={{ color: "#fff", background: destTag.color }}>{destTag.vi}{sug.z.surge > 1 ? " · " + sug.z.surge + "×" : ""}</span>
        </div>
      </div>

      <div className="repometrics">
        <div className="repometric"><I n="clock-arrow-down" s={15} style={{ color: "var(--mint-500)" }} /><div><b>−{sug.waitCut}'</b><span>chờ ngắn hơn</span></div></div>
        <div className="repometric"><I n="trending-up" s={15} style={{ color: "var(--coral-500)" }} /><div><b>+{fmtMoney(Math.max(0, sug.net))}/giờ</b><span>thu nhập ước tính</span></div></div>
        <div className="repometric"><I n="users" s={15} style={{ color: "var(--teal-600)" }} /><div><b>{sug.z.waiting} đơn</b><span>đang chờ ở đích</span></div></div>
      </div>

      {eligible ? (
        <div className="repocard__actions">
          <button className="exbtn exbtn--sm" style={{ color: "var(--text-secondary)" }} onClick={() => onSkip(ktv.id)}>Bỏ qua</button>
          <button className="exbtn exbtn--sm exbtn--primary" style={{ background: "var(--teal-700)", borderColor: "var(--teal-700)", marginLeft: "auto" }} onClick={() => onSend(ktv.id, sug.zone)}>
            <I n="send" s={14} /> Gửi đề xuất di chuyển
          </button>
        </div>
      ) : null}
    </div>
  );
}

function RepositionPage({ onSend }) {
  const { repoCandidates } = window.OPS;
  const [skipped, setSkipped] = React.useState({});
  const rows = repoCandidates().filter((r) => !skipped[r.ktv.id]);
  const eligible = rows.filter((r) => r.eligible);
  const watching = rows.filter((r) => !r.eligible);

  const send = (id, zone) => { onSend && onSend(id, zone); setSkipped((s) => ({ ...s, [id]: true })); };
  const skip = (id) => setSkipped((s) => ({ ...s, [id]: true }));

  return (
    <div className="page">
      <div>
        <h1 className="topbar__title" style={{ marginBottom: 2 }}>{window.tr("Tái phân bổ KTV")}</h1>
        <p className="page__lead">{window.tr("KTV nhàn rỗi quá lâu được gợi ý di chuyển tới vùng cầu cao. Ngưỡng hiện đề xuất là thích ứng theo cung–cầu thực tế, không cố định.")}</p>
      </div>

      <ThresholdAnalysis />

      <div className="exgroup-h" style={{ marginTop: 22 }}><span className="leg-dot" style={{ background: "var(--coral-500)" }}></span> Nên gợi ý di chuyển ngay <span className="muted" style={{ fontWeight: 600 }}>· {eligible.length}</span></div>
      {eligible.length ? (
        <div className="card-grid" style={{ marginBottom: 22 }}>
          {eligible.map((r) => <RepoCard key={r.ktv.id} row={r} onSend={send} onSkip={skip} />)}
        </div>
      ) : <div className="empty-hint" style={{ height: 90 }}><I n="check-check" s={17} /> Không có KTV nào vượt ngưỡng</div>}

      <div className="exgroup-h"><span className="leg-dot" style={{ background: "var(--amber-500)" }}></span> Đang theo dõi (chưa tới ngưỡng) <span className="muted" style={{ fontWeight: 600 }}>· {watching.length}</span></div>
      <div className="card-grid">
        {watching.map((r) => <RepoCard key={r.ktv.id} row={r} onSend={send} onSkip={skip} />)}
      </div>
    </div>
  );
}

Object.assign(window, { RepositionPage });
