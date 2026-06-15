// Hồ sơ khách hàng — search, phân khúc, trust & lịch sử đặt.
const { useState: useCustState } = React;

function trustColor(t) {
  return t >= 80 ? "var(--teal-700)" : t >= 55 ? "var(--amber-600)" : "var(--crimson-600)";
}
function cbAgo(d) {
  if (d <= 0) return window.tr("Hôm nay");
  if (d === 1) return window.tr("Hôm qua");
  return d + " " + window.tr("ngày trước");
}

function CustSeg({ seg }) {
  const { CUST_SEG } = window.OPS;
  const m = CUST_SEG[seg]; if (!m) return null;
  return <span className="spill" style={{ color: m.text, background: m.soft }}><I n={m.icon} s={11} />{window.tr(m.vi)}</span>;
}

// trust meter (compact)
function TrustBar({ t, w }) {
  return (
    <span className="trustbar" style={{ width: w || 54 }}>
      <span className="trustbar__track"><span className="trustbar__fill" style={{ width: t + "%", background: trustColor(t) }}></span></span>
      <b className="mono" style={{ color: trustColor(t), fontSize: 11 }}>{t}</b>
    </span>
  );
}

function CustRow({ c, onOpen }) {
  const { custSegOf, custHistoryStats } = window.OPS;
  const seg = custSegOf(c);
  const st = custHistoryStats(c.id);
  const fmtK = (v) => v.toLocaleString("vi-VN") + "k";
  return (
    <button className={"ktvrow" + (c.blocked ? " ktvrow--closed" : "")} onClick={() => onOpen(c.id)}>
      <Av name={c.name} size="sm" />
      <div className="ktvrow__main">
        <div className="row gap6" style={{ flexWrap: "wrap" }}>
          <b style={{ fontSize: 12.9 }}>{c.name}</b>
          {c.member ? <span className="spill" style={{ color: "var(--amber-600)", background: "var(--amber-100)" }}><I n="crown" s={11} />lull+</span> : null}
        </div>
        <div className="ktvrow__sub">
          <span><I n="map-pin" s={11} style={{ verticalAlign: -1 }} /> {c.area}</span>
          <span className="dot-sep"></span>
          <span>{c.bookings} {window.tr("lần đặt")}</span>
          {c.complaints > 0 ? <><span className="dot-sep"></span><span style={{ color: "var(--crimson-600)" }}><I n="flag" s={11} style={{ verticalAlign: -1 }} /> {c.complaints} {window.tr("khiếu nại")}</span></> : null}
        </div>
      </div>
      <div className="ktvrow__stat ktvrow__stat--hide">
        <b className="mono">{fmtK(st.spent)}</b>
        <span>{window.tr("chi tiêu")}</span>
      </div>
      <div className="custrow__trust">
        <span className="custrow__trustl">{window.tr("Trust")}</span>
        <TrustBar t={c.trust} />
      </div>
      <CustSeg seg={seg} />
      <I n="chevron-right" s={16} style={{ color: "var(--text-tertiary)", flex: "none" }} />
    </button>
  );
}

function CustDrawer({ c, onClose }) {
  const { custHistory, custHistoryStats, custSegOf, CB_OUTCOME, ktvById, SERVICES } = window.OPS;
  const [outFilter, setOutFilter] = useCustState("all");
  if (!c) return null;
  const hist = custHistory(c.id);
  const st = custHistoryStats(c.id);
  const seg = custSegOf(c);
  const fmtK = (v) => v.toLocaleString("vi-VN") + "k";
  const fav = c.fav ? ktvById(c.fav) : null;

  const filters = [
    { k: "all", vi: "Tất cả" },
    { k: "completed", vi: "Hoàn thành" },
    { k: "cancelled_client", vi: "Huỷ" },
    { k: "refunded", vi: "Hoàn tiền" },
    { k: "disputed", vi: "Khiếu nại" },
  ];
  const shown = hist.filter((j) => outFilter === "all" ? true : j.outcome === outFilter);

  return (
    <div className="drawer drawer--on drawer--wide">
      <div className="drawer__head">
        <div className="row between" style={{ marginBottom: 12 }}>
          <span className="drawer__id">{window.tr("Hồ sơ khách")} · {c.id.toUpperCase()}</span>
          <button className="icon-pill" style={{ width: 32, height: 32, border: "none", boxShadow: "none" }} onClick={onClose}><I n="x" s={17} /></button>
        </div>
        <div className="row gap12">
          <Av name={c.name} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row gap6" style={{ flexWrap: "wrap" }}>
              <b style={{ fontSize: 16 }}>{c.name}</b>
              {c.member ? <span className="spill" style={{ color: "var(--amber-600)", background: "var(--amber-100)" }}><I n="crown" s={11} />lull+</span> : null}
            </div>
            <div className="row gap6" style={{ marginTop: 5, flexWrap: "wrap" }}>
              <CustSeg seg={seg} />
              <span className="muted" style={{ fontSize: 11.5 }}><I n="map-pin" s={12} style={{ verticalAlign: -2 }} /> {c.area}</span>
              <span className="muted" style={{ fontSize: 11.5 }}><I n="calendar" s={12} style={{ verticalAlign: -2 }} /> {window.tr("Tham gia")} {c.joined}</span>
            </div>
          </div>
        </div>
        {c.blocked ? (
          <div className="ktvclosed">
            <I n="ban" s={15} />
            <div><b>{window.tr("Tài khoản đã bị chặn")}</b> · {c.blockedAt}<div style={{ fontWeight: 600, marginTop: 1 }}>{c.blockedReason}</div></div>
          </div>
        ) : c.riskNote ? (
          <div className="ktvclosed" style={{ background: "var(--coral-50)", color: "var(--coral-700)" }}>
            <I n="shield-alert" s={15} />
            <div><b>{window.tr("Khách rủi ro")}</b><div style={{ fontWeight: 600, marginTop: 1 }}>{c.riskNote}</div></div>
          </div>
        ) : null}
      </div>

      <div className="drawer__body">
        {/* trust score block */}
        <div className="dsec">
          <div className="dsec__t" style={{ marginBottom: 10 }}><I n="shield-check" s={13} /> {window.tr("Điểm tin cậy")}</div>
          <div className="row between" style={{ alignItems: "flex-end", marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: trustColor(c.trust) }}>{c.trust}<span style={{ fontSize: 14, color: "var(--text-tertiary)" }}>/100</span></span>
            <span className="muted" style={{ fontSize: 11 }}>{c.trust >= 80 ? window.tr("Tốt — ưu tiên ghép nhanh") : c.trust >= 55 ? window.tr("Trung bình — theo dõi") : window.tr("Thấp — yêu cầu trả trước")}</span>
          </div>
          <div className="trustbar__track" style={{ height: 8 }}><div className="trustbar__fill" style={{ width: c.trust + "%", background: trustColor(c.trust) }}></div></div>
        </div>

        {/* quick metrics */}
        <div className="ktvmetrics">
          <div className="ktvmetric"><b className="mono">{c.bookings}</b><span>{window.tr("Tổng lần đặt")}</span></div>
          <div className="ktvmetric"><b className="mono">{fmtK(st.spent)}</b><span>{window.tr("Tổng chi tiêu")}</span></div>
          <div className="ktvmetric"><b className="mono" style={{ color: st.avg ? trustColor(st.avg * 20) : undefined }}>{st.avg ? st.avg.toFixed(1) : "—"}</b><span>{window.tr("Sao đã chấm")}</span></div>
          <div className="ktvmetric"><b className="mono" style={{ color: c.complaints ? "var(--crimson-600)" : undefined }}>{c.complaints}</b><span>{window.tr("Khiếu nại")}</span></div>
        </div>

        {/* profile facts */}
        <div className="dsec">
          <div className="custfacts">
            <div className="custfact"><span><I n="phone" s={12} /> {window.tr("SĐT")}</span><b>{c.phone}</b></div>
            <div className="custfact"><span><I n="credit-card" s={12} /> {window.tr("Thanh toán")}</span><b>{c.pay}</b></div>
            <div className="custfact"><span><I n="heart" s={12} /> {window.tr("KTV ưa thích")}</span><b>{fav ? fav.name : window.tr("Chưa có")}</b></div>
            <div className="custfact"><span><I n="hand" s={12} /> {window.tr("Hay đặt")}</span><b>{c.svc.map((s) => SERVICES[s] ? SERVICES[s].vi : s).join(", ")}</b></div>
          </div>
        </div>

        {/* booking history */}
        <div className="dsec">
          <div className="dsec__t" style={{ marginBottom: 9 }}>
            <I n="history" s={13} /> {window.tr("Lịch sử đặt")}
            <span className="muted" style={{ marginLeft: "auto", fontWeight: 600, fontSize: 11 }}>{st.done}/{st.total} {window.tr("hoàn thành")}</span>
          </div>
          <div className="hxfilters">
            {filters.map((f) => {
              const n = f.k === "all" ? hist.length : hist.filter((j) => j.outcome === f.k).length;
              if (f.k !== "all" && n === 0) return null;
              return <button key={f.k} className={"fchip" + (outFilter === f.k ? " fchip--on" : "")} onClick={() => setOutFilter(f.k)}>{window.tr(f.vi)} <span className="fchip__n">{n}</span></button>;
            })}
          </div>
          <div className="hxtable">
            <div className="hxhead">
              <span>{window.tr("Thời gian")}</span>
              <span>{window.tr("Dịch vụ")}</span>
              <span>{window.tr("KTV")}</span>
              <span style={{ textAlign: "right" }}>{window.tr("Cước")}</span>
              <span style={{ textAlign: "center" }}>{window.tr("Kết quả")}</span>
            </div>
            {shown.map((j, i) => {
              const om = CB_OUTCOME[j.outcome];
              const ktv = ktvById(j.ktvId);
              return (
                <div className="hxrow" key={j.id + i}>
                  <span className="hxrow__time">
                    <b>{cbAgo(j.daysAgo)}</b>
                    <span className="muted">{j.time} · {j.id}</span>
                  </span>
                  <span>
                    <b style={{ fontSize: 11.6 }}>{j.svc}</b>
                    <span className="muted" style={{ display: "block", fontSize: 10.3 }}>{j.dur}′{j.surge > 1 ? " · ×" + j.surge : ""}</span>
                  </span>
                  <span className="muted">{ktv ? ktv.name : "—"}</span>
                  <span style={{ textAlign: "right" }} className="mono">
                    {j.fare ? fmtK(j.fare) : "—"}
                    {j.rated ? <span className="hxrow__rate"><I n="star" s={10} /> {j.rated}</span> : null}
                  </span>
                  <span style={{ textAlign: "center" }}>
                    <span className="spill" style={{ color: om.color, background: om.soft, fontSize: 10 }}>{window.tr(om.vi)}</span>
                  </span>
                </div>
              );
            })}
            {shown.length === 0 ? <div className="empty-hint" style={{ height: 80 }}>{window.tr("Không có lần đặt nào")}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomersPage() {
  const { CUSTOMERS, CUST_SEG, custSegOf } = window.OPS;
  const [q, setQ] = useCustState("");
  const [seg, setSeg] = useCustState("all");
  const [openId, setOpenId] = useCustState(null);

  const counts = { all: CUSTOMERS.length };
  Object.keys(CUST_SEG).forEach((s) => { counts[s] = CUSTOMERS.filter((c) => custSegOf(c) === s).length; });

  const ql = q.trim().toLowerCase();
  const visible = CUSTOMERS.filter((c) => {
    if (seg !== "all" && custSegOf(c) !== seg) return false;
    if (ql && !(c.name.toLowerCase().includes(ql) || c.id.toLowerCase().includes(ql) || (c.phone || "").includes(ql) || c.area.toLowerCase().includes(ql))) return false;
    return true;
  });

  // when "all", group by segment
  const segOrder = ["vip", "loyal", "regular", "new", "at_risk", "blocked"];
  const sections = seg === "all"
    ? segOrder.map((s) => ({ s, items: visible.filter((c) => custSegOf(c) === s) })).filter((x) => x.items.length)
    : [{ s: seg, items: visible }];

  const tabs = [{ key: "all", vi: "Tất cả", icon: "users" }, ...segOrder.filter((s) => counts[s]).map((key) => ({ key, vi: CUST_SEG[key].vi, icon: CUST_SEG[key].icon }))];
  const open = CUSTOMERS.find((c) => c.id === openId) || null;

  return (
    <div className="page">
      <div>
        <h1 className="topbar__title" style={{ marginBottom: 2 }}>{window.tr("Hồ sơ khách hàng")}</h1>
        <p className="page__lead">{window.tr("Tìm nhanh khách, phân khúc theo mức độ thân thiết và rủi ro, xem điểm tin cậy cùng toàn bộ lịch sử đặt.")}</p>
      </div>

      <div className="ktvbar">
        <div className="ktvsearch">
          <I n="search" s={16} style={{ color: "var(--text-tertiary)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={window.tr("Tìm theo tên, mã, SĐT, khu vực…")} />
          {q ? <button className="ktvsearch__clear" onClick={() => setQ("")}><I n="x" s={14} /></button> : null}
        </div>
        <div className="ktvtabs">
          {tabs.map((t) => (
            <button key={t.key} className={"ktvtab" + (seg === t.key ? " ktvtab--on" : "")} onClick={() => setSeg(t.key)}>
              <I n={t.icon} s={14} />{window.tr(t.vi)}<span className="ktvtab__n">{counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {sections.map((x) => {
        const m = CUST_SEG[x.s];
        return (
          <div key={x.s} style={{ marginBottom: 18 }}>
            {seg === "all" ? (
              <div className="exgroup-h">
                <span className="fbsum__ic" style={{ width: 24, height: 24, borderRadius: 7, background: m.soft, color: m.text }}><I n={m.icon} s={13} /></span>
                {window.tr(m.vi)} <span className="muted" style={{ fontWeight: 600 }}>· {x.items.length}</span>
              </div>
            ) : null}
            <div className="ktvlist">
              {x.items.map((c) => <CustRow key={c.id} c={c} onOpen={setOpenId} />)}
            </div>
          </div>
        );
      })}
      {visible.length === 0 ? <div className="empty-hint" style={{ height: 120 }}><I n="search-x" s={18} /> {window.tr("Không tìm thấy khách phù hợp")}</div> : null}

      <div className={"scrim" + (open ? " scrim--on" : "")} onClick={() => setOpenId(null)}></div>
      {open ? <CustDrawer c={open} onClose={() => setOpenId(null)} /> : null}
    </div>
  );
}

Object.assign(window, { CustomersPage });
