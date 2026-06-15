// Tài chính / Đối soát — KPI, dòng tiền, cơ cấu doanh thu, đối soát payout.
const { useState: useFinState } = React;

// KPI tile (big number + trend + sublabel) — clickable to expand a detail strip
function KpiTile({ k, data, active, onToggle }) {
  const { fmtDong, readWords } = window.OPS;
  const up = data.delta >= 0;
  return (
    <button className={"kpi" + (active ? " kpi--on" : "")} onClick={() => onToggle(k)}>
      <div className="kpi__top">
        <span className="kpi__l">{data.vi}</span>
        <span className={"kpi__delta " + (up ? "kpi__delta--up" : "kpi__delta--down")}><I n={up ? "trending-up" : "trending-down"} s={12} />{up ? "+" : ""}{data.delta}%</span>
      </div>
      <div className="kpi__v">{fmtDong(data.value)}</div>
      <div className="kpi__words">{readWords(data.value)}</div>
      <div className="kpi__sub">{data.sub}<I n={active ? "chevron-up" : "chevron-down"} s={13} style={{ marginLeft: "auto" }} /></div>
    </button>);

}

// Cashflow chart — paired in/out bars + net line, SVG
function CashflowChart({ rows }) {
  const w = 760,h = 200,pad = 28;
  const max = Math.max(...rows.map((r) => Math.max(r.in, r.out))) * 1.12;
  const bw = (w - pad * 2) / rows.length;
  const y = (v) => h - pad - v / max * (h - pad * 2);
  const netPts = rows.map((r, i) => [pad + bw * i + bw / 2, y(r.in - r.out)]);
  return (
    <div className="chartwrap">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 200 }}>
        {[0.25, 0.5, 0.75, 1].map((g) =>
        <line key={g} x1={pad} x2={w - pad} y1={h - pad - g * (h - pad * 2)} y2={h - pad - g * (h - pad * 2)} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 4" />
        )}
        {rows.map((r, i) => {
          const cx = pad + bw * i;
          const gap = 3,half = (bw - gap * 3) / 2;
          return (
            <g key={i}>
              <rect x={cx + gap} y={y(r.in)} width={half} height={h - pad - y(r.in)} rx="3" fill="var(--teal-500)" />
              <rect x={cx + gap * 2 + half} y={y(r.out)} width={half} height={h - pad - y(r.out)} rx="3" fill="var(--coral-300)" />
              <text x={cx + bw / 2} y={h - 9} textAnchor="middle" fontSize="8.2" fontWeight="600" fill="var(--text-tertiary)">{r.d.split("/")[0]}</text>
            </g>);

        })}
        <polyline points={netPts.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--teal-900)" strokeWidth="2" strokeLinejoin="round" />
        {netPts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.6" fill="var(--teal-900)" />)}
      </svg>
      <div className="chartlegend">
        <span><span className="leg-dot" style={{ background: "var(--teal-500)" }}></span> Thu (capture)</span>
        <span><span className="leg-dot" style={{ background: "var(--coral-300)" }}></span> Chi (payout)</span>
        <span><span className="leg-dot" style={{ background: "var(--teal-900)" }}></span> Dòng tiền ròng</span>
      </div>
    </div>);

}

// Revenue mix donut
function RevDonut({ rows }) {
  const { fmtVnd } = window.OPS;
  const total = rows.reduce((s, r) => s + r.value, 0);
  const R = 52,C = 2 * Math.PI * R;
  let off = 0;
  return (
    <div className="donutrow">
      <div className="donut">
        <svg viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={R} fill="none" stroke="var(--gray-100)" strokeWidth="16" />
          {rows.map((r, i) => {
            const frac = r.value / total;
            const dash = frac * C;
            const el = <circle key={i} cx="65" cy="65" r={R} fill="none" stroke={r.color} strokeWidth="16"
            strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-off} transform="rotate(-90 65 65)" />;
            off += dash;
            return el;
          })}
        </svg>
        <div className="donut__c"><b>{fmtVnd(total)}</b><span>DT nền tảng</span></div>
      </div>
      <div className="donutlegend">
        {rows.map((r, i) =>
        <div className="dleg" key={i}>
            <span className="leg-dot" style={{ background: r.color }}></span>
            <span className="dleg__l">{r.vi}</span>
            <b>{fmtVnd(r.value)}</b>
            <span className="dleg__p">{Math.round(r.value / total * 100)}%</span>
          </div>
        )}
      </div>
    </div>);

}

// Payout reconciliation row — expandable
function PayoutRow({ p, expanded, onToggle, onApprove, pulse }) {
  const { ktvById, FIN_STATUS, payoutNet, fmtMoney } = window.OPS;
  const k = ktvById(p.ktvId);const st = FIN_STATUS[p.status];const net = payoutNet(p);
  return (
    <>
      <tr id={"po-" + p.id} className={"porow" + (expanded ? " porow--open" : "") + (pulse ? " porow--pulse" : "")} onClick={() => onToggle(p.id)}>
        <td><I n={expanded ? "chevron-down" : "chevron-right"} s={16} style={{ color: "var(--text-tertiary)" }} /></td>
        <td><div className="row gap10"><Av name={k.name} status={k.status} size="sm" /><div><b style={{ fontSize: 11.6 }}>{k.name}</b><div className="muted" style={{ fontSize: 9.9 }}>{p.id} · {p.sessions} buổi</div></div></div></td>
        <td className="muted" style={{ fontSize: 10.8 }}>{p.period}</td>
        <td className="mono" style={{ fontWeight: 700 }}>{fmtMoney(p.gross)}</td>
        <td className="mono" style={{ fontWeight: 800, color: net >= 0 ? "var(--text-primary)" : "var(--crimson-600)" }}>{fmtMoney(net)}</td>
        <td><span className="postatus" style={{ color: st.text, background: st.soft }}><span className="leg-dot" style={{ width: 6, height: 6, background: st.color }}></span>{st.vi}</span></td>
      </tr>
      {expanded ?
      <tr className="podetail">
          <td colSpan="6">
            <div className="podetail__box">
              {p.hold ? <div className="poflag"><I n="lock" s={14} /> {p.hold}</div> : null}
              <div className="poledger">
                {p.lines.map((l, i) =>
              <div className="poline" key={i}>
                    <span>{l.vi}</span>
                    <b className="mono" style={{ color: l.v >= 0 ? "var(--text-primary)" : "var(--crimson-600)" }}>{l.v >= 0 ? "+" : ""}{fmtMoney(l.v)}</b>
                  </div>
              )}
                <div className="poline poline--total"><span>Thực nhận</span><b className="mono">{fmtMoney(payoutNet(p))}</b></div>
              </div>
              <div className="podetail__actions">
                {p.status === "paid" ? <span className="muted" style={{ fontSize: 10.3, fontWeight: 700 }}><I n="check-check" s={14} style={{ verticalAlign: -2, color: "var(--mint-500)" }} /> Đã chi {p.paidAt}</span> :
              <>
                    <button className="exbtn exbtn--sm"><I n="file-text" s={14} /> Xem sao kê</button>
                    {p.status === "hold" ?
                <button className="exbtn exbtn--sm" style={{ color: "var(--crimson-600)" }}><I n="gavel" s={14} /> Đợi xử lý tranh chấp</button> :
                <button className="exbtn exbtn--sm exbtn--primary" style={{ background: "var(--teal-700)", borderColor: "var(--teal-700)" }} onClick={(e) => {e.stopPropagation();onApprove && onApprove(p);}}><I n="send" s={14} /> Duyệt chi</button>}
                  </>
              }
              </div>
            </div>
          </td>
        </tr> :
      null}
    </>);

}

function FinancePage({ askConfirm, onToast, focusRef, onClearFocus }) {
  const { FIN_KPIS, FIN_CASHFLOW, FIN_REVMIX, FIN_METHODS, FIN_PAYOUTS, FIN_PAYOUT_QUEUE, FIN_STATUS, payoutNet, fmtMoney, fmtVnd, TAKE_RATE, ktvById } = window.OPS;
  const [kpiOpen, setKpiOpen] = useFinState(null);
  const [openRow, setOpenRow] = useFinState(null);
  const [poFilter, setPoFilter] = useFinState("all");
  const [pulseId, setPulseId] = useFinState(null);

  // Deep-link: khi tới từ Phản hồi → nhảy đúng case, mở rộng & highlight
  const focusPayout = focusRef && focusRef.kind === "payout" ? FIN_PAYOUTS.find((p) => p.id === focusRef.id) : null;
  React.useEffect(() => {
    if (!focusRef) return;
    if (focusPayout) {
      setPoFilter("all");
      setOpenRow(focusPayout.id);
      setPulseId(focusPayout.id);
      const t1 = setTimeout(() => {
        const el = document.getElementById("po-" + focusPayout.id);
        if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 120);
      const t2 = setTimeout(() => setPulseId(null), 2600);
      return () => {clearTimeout(t1);clearTimeout(t2);};
    }
    // booking ref: scroll to focus banner
    const t = setTimeout(() => {const el = document.getElementById("fin-focus");if (el) el.scrollIntoView({ block: "start", behavior: "smooth" });}, 120);
    return () => clearTimeout(t);
  }, [focusRef && focusRef.at]);

  const kpiDetail = {
    gmv: "358.400 đơn hoàn tất tháng này · trung bình 358k/đơn · cao điểm 18–21h chiếm 47% GMV.",
    netRev: "Take rate hiệu dụng " + Math.round(TAKE_RATE * 100) + "% · trừ 1.24 tỷ hoàn tiền & 680tr khuyến mãi lull+.",
    payoutDue: "1.284 KTV chờ đối soát tuần 23 · chu kỳ chi tự động Thứ 4 hàng tuần.",
    escrow: "2.140 đơn đang giữ tiền · capture khi COMPLETED hoặc hoàn khi CANCELLED."
  };

  const payouts = FIN_PAYOUTS.filter((p) => poFilter === "all" || p.status === poFilter);
  const totalDue = FIN_PAYOUTS.filter((p) => p.status === "pending").reduce((s, p) => s + payoutNet(p), 0);
  const onHold = FIN_PAYOUTS.filter((p) => p.status === "hold").length;

  const poFilters = [
  { k: "all", vi: "Tất cả" }, { k: "pending", vi: "Chờ chi" }, { k: "hold", vi: "Đang giữ" }, { k: "paid", vi: "Đã chi" }];


  const pendingCount = FIN_PAYOUTS.filter((p) => p.status === "pending").length;
  const approveOne = (p) => {
    const k = ktvById(p.ktvId);
    askConfirm && askConfirm({
      tone: "primary", icon: "wallet", title: "Duyệt chi payout?",
      message: "Chi trả cho " + (k ? k.name : p.ktvId) + " — kỳ " + p.period + ".",
      detail: ["Số tiền thực chi: " + fmtMoney(payoutNet(p)), p.id + " · " + p.sessions + " buổi"],
      impact: "Tiền được chuyển ngay vào ví KTV, không thể thu hồi tự động.",
      confirmLabel: "Duyệt chi", confirmIcon: "send",
      verify: { reason: "Duyệt chi là thao tác chuyển tiền không thể thu hồi. Nhập mã 6 số từ ứng dụng xác thực (Authenticator) để xác nhận chính bạn đang thao tác — bước này chặn người chiếm quyền admin tự ý chi tiền." },
      onConfirm: () => onToast && onToast("✓ Đã duyệt chi " + fmtMoney(payoutNet(p)) + " cho " + (k ? k.name : p.ktvId))
    });
  };
  const approveAll = () => {
    const queueCount = FIN_PAYOUT_QUEUE.count;
    askConfirm && askConfirm({
      tone: "danger", icon: "check-check", title: "Duyệt chi toàn bộ?",
      message: "Duyệt chi cho tất cả " + queueCount.toLocaleString("vi-VN") + " khoản payout đang chờ. Các khoản đang giữ (tranh chấp) sẽ được bỏ qua.",
      detail: ["Tổng thực chi: " + fmtVnd(FIN_PAYOUT_QUEUE.total), FIN_PAYOUT_QUEUE.held + " khoản đang giữ (" + fmtVnd(FIN_PAYOUT_QUEUE.heldValue) + ") sẽ không chi"],
      impact: "Đây là thao tác hàng loạt — tiền chuyển ngay vào ví tất cả KTV đủ điều kiện.",
      confirmLabel: "Duyệt chi " + queueCount.toLocaleString("vi-VN") + " khoản", confirmIcon: "check-check",
      verify: { reason: "Chi hàng loạt " + fmtVnd(FIN_PAYOUT_QUEUE.total) + " — rủi ro rất cao nếu tài khoản bị chiếm quyền. Nhập mã 6 số từ ứng dụng xác thực (Authenticator) để xác minh lại danh tính trước khi chi." },
      onConfirm: () => onToast && onToast("✓ Đã duyệt chi " + fmtVnd(FIN_PAYOUT_QUEUE.total) + " cho " + queueCount.toLocaleString("vi-VN") + " khoản")
    });
  };

  return (
    <div className="page" style={{ textAlign: "left" }}>
      <div className="row between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: 12, margin: "0px 0px 10px" }}>
        <div>
          <h1 className="topbar__title" style={{ marginBottom: 2 }}>{window.tr("Tài chính & Đối soát")}</h1>
          <p className="page__lead" style={{ marginBottom: 0 }}>{window.tr("Dòng tiền, doanh thu nền tảng và đối soát payout cho KTV. Bấm vào KPI hoặc từng dòng payout để mở rộng chi tiết.")}</p>
        </div>
        <div className="row gap10">
          <button className="exbtn exbtn--sm"><I n="calendar" s={14} /> Hôm nay</button>
          <button className="exbtn exbtn--sm"><I n="download" s={14} /> Xuất báo cáo</button>
        </div>
      </div>

      {/* deep-link focus banner */}
      {focusRef ?
      <div className="finfocus" id="fin-focus">
          <span className="finfocus__ic"><I n="crosshair" s={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row gap6" style={{ flexWrap: "wrap" }}>
              <b style={{ fontSize: 11.6 }}>Đang tra cứu từ phản hồi</b>
              <span className="finfocus__chip"><I n={focusRef.kind === "payout" ? "hand-coins" : "receipt"} s={11} />{focusRef.id}</span>
              <span className="muted" style={{ fontSize: 10.3 }}>{focusRef.label} · {fmtMoney(focusRef.amount)}</span>
            </div>
            <div className="muted" style={{ fontSize: 10.3, marginTop: 2 }}>
              {focusPayout ? "Đã mở đúng khoản payout bên dưới — kiểm tra sổ chi tiết & xử lý." : "Tra giao dịch theo mã đơn — đối chiếu capture/hoàn trong sao kê đơn."}
            </div>
          </div>
          {focusPayout ? <button className="exbtn exbtn--sm" onClick={() => {setOpenRow(focusPayout.id);setPulseId(focusPayout.id);const el = document.getElementById("po-" + focusPayout.id);if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });}}><I n="locate" s={14} /> Tới khoản</button> : null}
          <button className="icon-pill" style={{ width: 32, height: 32, boxShadow: "none" }} onClick={onClearFocus} title="Đóng"><I n="x" s={16} /></button>
        </div> :
      null}

      {/* KPI tiles */}
      <div className="kpigrid">
        {Object.entries(FIN_KPIS).map(([k, data]) =>
        <KpiTile key={k} k={k} data={data} active={kpiOpen === k} onToggle={(kk) => setKpiOpen(kpiOpen === kk ? null : kk)} />
        )}
      </div>
      {kpiOpen ? <div className="kpidetail"><I n="info" s={15} style={{ color: "var(--color-primary)", flex: "none" }} />{kpiDetail[kpiOpen]}</div> : null}

      {/* charts row */}
      <div className="finrow">
        <div className="lite-card" style={{ flex: "1.6 1 460px" }}>
          <div className="row between" style={{ marginBottom: 14 }}>
            <div><div className="section-title">Dòng tiền 14 ngày</div><div className="muted" style={{ fontSize: 10.3 }}>Đơn vị: tỷ đồng</div></div>
            <span className="postatus" style={{ color: "var(--mint-600)", background: "var(--mint-100)" }}><I n="arrow-up-right" s={12} /> +18% so với kỳ trước</span>
          </div>
          <CashflowChart rows={FIN_CASHFLOW} />
        </div>
        <div className="lite-card" style={{ flex: "1 1 320px" }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Cơ cấu doanh thu</div>
          <RevDonut rows={FIN_REVMIX} />
        </div>
      </div>

      {/* methods strip */}
      <div className="lite-card" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Phương thức thanh toán</div>
        <div className="methodbar">
          {FIN_METHODS.map((m, i) =>
          <div key={i} className="methodseg" style={{ flex: m.pct }} title={m.vi + " " + m.pct + "%"}>
              <span className="methodseg__fill" style={{ background: ["var(--teal-800)", "var(--teal-600)", "var(--teal-500)", "var(--teal-300)", "var(--gray-400)"][i] }}></span>
            </div>
          )}
        </div>
        <div className="methodlegend">
          {FIN_METHODS.map((m, i) =>
          <div className="mleg" key={i}><span className="leg-dot" style={{ background: ["var(--teal-800)", "var(--teal-600)", "var(--teal-500)", "var(--teal-300)", "var(--gray-400)"][i] }}></span><I n={m.icon} s={13} style={{ color: "var(--text-tertiary)" }} />{m.vi} <b>{m.pct}%</b></div>
          )}
        </div>
      </div>

      {/* payout reconciliation */}
      <div className="lite-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="row between" style={{ padding: "15px 18px 13px", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div className="section-title">Đối soát payout KTV</div>
            <div className="muted" style={{ fontSize: 10.3 }}>Hàng đợi mạng lưới <b style={{ color: "var(--text-primary)" }}>{fmtVnd(FIN_PAYOUT_QUEUE.total)}</b> · {FIN_PAYOUT_QUEUE.count.toLocaleString("vi-VN")} khoản{FIN_PAYOUT_QUEUE.held ? <> · <span style={{ color: "var(--crimson-600)", fontWeight: 700 }}>{FIN_PAYOUT_QUEUE.held} đang giữ</span></> : null} · hiển thị 6 khoản ưu tiên</div>
          </div>
          <div className="row gap6">
            <div className="fbfilters__seg">
              {poFilters.map((f) =>
              <button key={f.k} className={"segbtn" + (poFilter === f.k ? " segbtn--on" : "")} onClick={() => setPoFilter(f.k)}>{f.vi}</button>
              )}
            </div>
            <button className="exbtn exbtn--sm exbtn--primary" style={{ background: "var(--teal-700)", borderColor: "var(--teal-700)" }} onClick={approveAll}><I n="check-check" s={14} /> Duyệt chi tất cả</button>
          </div>
        </div>
        <table className="dtable" style={{ border: "none", borderRadius: 0, boxShadow: "none" }}>
          <thead><tr><th style={{ width: 36 }}></th><th>KTV</th><th>Kỳ đối soát</th><th>Doanh thu</th><th>Thực nhận</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {payouts.map((p) => <PayoutRow key={p.id} p={p} expanded={openRow === p.id} pulse={pulseId === p.id} onToggle={(id) => setOpenRow(openRow === id ? null : id)} onApprove={approveOne} />)}
          </tbody>
        </table>
      </div>
    </div>);

}

window.FinancePage = FinancePage;