// Mạng lưới KTV — quick search, status groups, profile + job-history drawer.
const { useState: useKtvState } = React;

function ktvAccentColor(accept) {
  return accept >= 0.9 ? "var(--teal-700)" : accept >= 0.82 ? "var(--gray-600)" : "var(--crimson-600)";
}
function hxAgo(d) {
  if (d <= 0) return window.tr("Hôm nay");
  if (d === 1) return window.tr("Hôm qua");
  return d + " " + window.tr("ngày trước");
}

// status pill for a KTV
function KtvStatus({ k }) {
  const { KTV_GROUP, ktvGroupOf } = window.OPS;
  const g = ktvGroupOf(k);
  const m = KTV_GROUP[g];
  const live = k.status === "busy";
  return (
    <span className="spill" style={{ color: m.text, background: m.soft }}>
      <span className="spill__dot" style={{ background: m.color }}></span>
      {live ? window.tr("Đang bận") : window.tr(m.vi)}
    </span>
  );
}

// one roster row
function KtvRow({ k, onOpen }) {
  const { ktvHistoryStats } = window.OPS;
  const st = ktvHistoryStats(k.id);
  const closed = k.status === "closed";
  return (
    <button className={"ktvrow" + (closed ? " ktvrow--closed" : "")} onClick={() => onOpen(k.id)}>
      <Av name={k.name} status={k.status === "busy" ? "online" : k.status === "online" ? "online" : undefined} size="sm" />
      <div className="ktvrow__main">
        <div className="row gap6" style={{ flexWrap: "wrap" }}>
          <b style={{ fontSize: 12.9 }}>{k.name}</b>
          <TierTag tier={k.tier} />
        </div>
        <div className="ktvrow__sub">
          <span><I n="star" s={11} style={{ color: "var(--gray-500)", verticalAlign: -1 }} /> {k.rating}</span>
          <span className="dot-sep"></span>
          <span>{k.sessions} {window.tr("buổi")}</span>
          {k.zone ? <><span className="dot-sep"></span><span><I n="map-pin" s={11} style={{ verticalAlign: -1 }} /> {k.zone}</span></> : null}
        </div>
      </div>
      <div className="ktvrow__stat">
        <b className="mono" style={{ color: ktvAccentColor(k.accept) }}>{Math.round(k.accept * 100)}%</b>
        <span>{window.tr("tỷ lệ nhận")}</span>
      </div>
      <div className="ktvrow__stat ktvrow__stat--hide">
        <b className="mono">{st.done}</b>
        <span>{window.tr("cuốc 30 ngày")}</span>
      </div>
      <KtvStatus k={k} />
      <I n="chevron-right" s={16} style={{ color: "var(--text-tertiary)", flex: "none" }} />
    </button>
  );
}

// detail drawer with profile + job history
function KtvDrawer({ k, onClose }) {
  const { ktvHistory, ktvHistoryStats, HX_OUTCOME, priceOf } = window.OPS;
  const [outFilter, setOutFilter] = useKtvState("all");
  if (!k) return null;
  const hist = ktvHistory(k.id);
  const st = ktvHistoryStats(k.id);
  const closed = k.status === "closed";
  const fmtK = (v) => v.toLocaleString("vi-VN") + "k";

  const filters = [
    { k: "all", vi: "Tất cả" },
    { k: "completed", vi: "Hoàn thành" },
    { k: "cancelled", vi: "Huỷ" },
    { k: "noshow_client", vi: "Vắng mặt" },
  ];
  const shown = hist.filter((j) =>
    outFilter === "all" ? true : outFilter === "cancelled" ? j.outcome.startsWith("cancelled") : j.outcome === outFilter
  );

  return (
    <div className="drawer drawer--on drawer--wide">
      <div className="drawer__head">
        <div className="row between" style={{ marginBottom: 12 }}>
          <span className="drawer__id">{window.tr("Hồ sơ KTV")} · {k.id.toUpperCase()}</span>
          <button className="icon-pill" style={{ width: 32, height: 32, border: "none", boxShadow: "none" }} onClick={onClose}><I n="x" s={17} /></button>
        </div>
        <div className="row gap12">
          <Av name={k.name} status={k.status === "offline" || closed ? undefined : "online"} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row gap6" style={{ flexWrap: "wrap" }}><b style={{ fontSize: 16 }}>{k.name}</b><TierTag tier={k.tier} /></div>
            <div className="row gap6" style={{ marginTop: 5 }}>
              <KtvStatus k={k} />
              {k.zone ? <span className="muted" style={{ fontSize: 11.5 }}><I n="map-pin" s={12} style={{ verticalAlign: -2 }} /> {k.zone}</span> : null}
            </div>
          </div>
        </div>
        {closed ? (
          <div className="ktvclosed">
            <I n="user-x" s={15} />
            <div><b>{window.tr("Hồ sơ đã đóng")}</b> · {k.closedAt}<div style={{ fontWeight: 600, marginTop: 1 }}>{k.closedReason}</div></div>
          </div>
        ) : null}
      </div>

      <div className="drawer__body">
        {/* quick metrics */}
        <div className="ktvmetrics">
          <div className="ktvmetric"><b className="mono">{k.rating}</b><span>{window.tr("Đánh giá")}</span></div>
          <div className="ktvmetric"><b className="mono">{Math.round(k.accept * 100)}%</b><span>{window.tr("Tỷ lệ nhận")}</span></div>
          <div className="ktvmetric"><b className="mono">{st.done}</b><span>{window.tr("Cuốc 30 ngày")}</span></div>
          <div className="ktvmetric"><b className="mono">{fmtK(st.earn)}</b><span>{window.tr("Thu nhập 30 ngày")}</span></div>
        </div>

        {k.svc && k.svc.length ? (
          <div className="dsec">
            <div className="dsec__t"><I n="hand" s={13} /> {window.tr("Dịch vụ")}</div>
            <div className="row gap6" style={{ flexWrap: "wrap" }}>
              {k.svc.map((s) => <span key={s} className="svtag">{window.OPS.SERVICES && window.OPS.SERVICES[s] ? window.OPS.SERVICES[s].vi : s}</span>)}
            </div>
            {k.badges && k.badges.length ? <div className="row gap6" style={{ flexWrap: "wrap", marginTop: 9 }}>{k.badges.map((b) => <span key={b} className="badge-soft"><I n="badge-check" s={11} />{b}</span>)}</div> : null}
          </div>
        ) : null}

        {/* job history */}
        <div className="dsec">
          <div className="dsec__t" style={{ marginBottom: 9 }}>
            <I n="history" s={13} /> {window.tr("Lịch sử nhận cuốc")}
            <span className="muted" style={{ marginLeft: "auto", fontWeight: 600, fontSize: 11 }}>{st.done}/{st.total} {window.tr("hoàn thành")}</span>
          </div>
          <div className="hxfilters">
            {filters.map((f) => {
              const n = f.k === "all" ? hist.length : f.k === "cancelled" ? hist.filter((j) => j.outcome.startsWith("cancelled")).length : hist.filter((j) => j.outcome === f.k).length;
              return <button key={f.k} className={"fchip" + (outFilter === f.k ? " fchip--on" : "")} onClick={() => setOutFilter(f.k)}>{window.tr(f.vi)} <span className="fchip__n">{n}</span></button>;
            })}
          </div>
          <div className="hxtable">
            <div className="hxhead">
              <span>{window.tr("Thời gian")}</span>
              <span>{window.tr("Dịch vụ")}</span>
              <span>{window.tr("Khu vực")}</span>
              <span style={{ textAlign: "right" }}>{window.tr("Cước")}</span>
              <span style={{ textAlign: "center" }}>{window.tr("Kết quả")}</span>
            </div>
            {shown.map((j, i) => {
              const om = HX_OUTCOME[j.outcome];
              return (
                <div className="hxrow" key={j.id + i}>
                  <span className="hxrow__time">
                    <b>{hxAgo(j.daysAgo)}</b>
                    <span className="muted">{j.time} · {j.id}</span>
                  </span>
                  <span>
                    <b style={{ fontSize: 11.6 }}>{j.svc}</b>
                    <span className="muted" style={{ display: "block", fontSize: 10.3 }}>{j.dur}′{j.surge > 1 ? " · ×" + j.surge : ""}</span>
                  </span>
                  <span className="muted">{j.area}</span>
                  <span style={{ textAlign: "right" }} className="mono">
                    {j.fare ? fmtK(j.fare) : "—"}
                    {j.rating ? <span className="hxrow__rate"><I n="star" s={10} /> {j.rating}</span> : null}
                  </span>
                  <span style={{ textAlign: "center" }}>
                    <span className="spill" style={{ color: om.color, background: om.soft, fontSize: 10 }}>{window.tr(om.vi)}</span>
                  </span>
                </div>
              );
            })}
            {shown.length === 0 ? <div className="empty-hint" style={{ height: 80 }}>{window.tr("Không có cuốc nào")}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function KtvNetworkPage() {
  const { KTV, KTV_GROUP, ktvGroupOf } = window.OPS;
  const [q, setQ] = useKtvState("");
  const [grp, setGrp] = useKtvState("all");
  const [openId, setOpenId] = useKtvState(null);

  const counts = { all: KTV.length };
  Object.keys(KTV_GROUP).forEach((g) => { counts[g] = KTV.filter((k) => ktvGroupOf(k) === g).length; });

  const ql = q.trim().toLowerCase();
  const visible = KTV.filter((k) => {
    if (grp !== "all" && ktvGroupOf(k) !== grp) return false;
    if (ql && !(k.name.toLowerCase().includes(ql) || k.id.toLowerCase().includes(ql) || (k.zone || "").toLowerCase().includes(ql))) return false;
    return true;
  });

  // group visible by status when showing "all"
  const sections = grp === "all"
    ? Object.keys(KTV_GROUP).map((g) => ({ g, items: visible.filter((k) => ktvGroupOf(k) === g) })).filter((s) => s.items.length)
    : [{ g: grp, items: visible }];

  const tabs = [{ key: "all", vi: "Tất cả", icon: "users" }, ...Object.entries(KTV_GROUP).map(([key, m]) => ({ key, vi: m.vi, icon: m.icon }))];
  const open = KTV.find((k) => k.id === openId) || null;

  return (
    <div className="page">
      <div>
        <h1 className="topbar__title" style={{ marginBottom: 2 }}>{window.tr("Mạng lưới KTV")}</h1>
        <p className="page__lead">{window.tr("Tìm nhanh kỹ thuật viên, phân nhóm theo trạng thái hoạt động và xem chi tiết lịch sử nhận cuốc của từng người.")}</p>
      </div>

      {/* search + group tabs */}
      <div className="ktvbar">
        <div className="ktvsearch">
          <I n="search" s={16} style={{ color: "var(--text-tertiary)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={window.tr("Tìm theo tên, mã KTV, khu vực…")} />
          {q ? <button className="ktvsearch__clear" onClick={() => setQ("")}><I n="x" s={14} /></button> : null}
        </div>
        <div className="ktvtabs">
          {tabs.map((t) => (
            <button key={t.key} className={"ktvtab" + (grp === t.key ? " ktvtab--on" : "")} onClick={() => setGrp(t.key)}>
              <I n={t.icon} s={14} />{window.tr(t.vi)}<span className="ktvtab__n">{counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* roster grouped */}
      {sections.map((s) => {
        const m = KTV_GROUP[s.g];
        return (
          <div key={s.g} style={{ marginBottom: 18 }}>
            {grp === "all" ? (
              <div className="exgroup-h">
                <span className="fbsum__ic" style={{ width: 24, height: 24, borderRadius: 7, background: m.soft, color: m.text }}><I n={m.icon} s={13} /></span>
                {window.tr(m.vi)} <span className="muted" style={{ fontWeight: 600 }}>· {s.items.length}</span>
              </div>
            ) : null}
            <div className="ktvlist">
              {s.items.map((k) => <KtvRow key={k.id} k={k} onOpen={setOpenId} />)}
            </div>
          </div>
        );
      })}
      {visible.length === 0 ? <div className="empty-hint" style={{ height: 120 }}><I n="search-x" s={18} /> {window.tr("Không tìm thấy KTV phù hợp")}</div> : null}

      <div className={"scrim" + (open ? " scrim--on" : "")} onClick={() => setOpenId(null)}></div>
      {open ? <KtvDrawer k={open} onClose={() => setOpenId(null)} /> : null}
    </div>
  );
}

Object.assign(window, { KtvNetworkPage });
