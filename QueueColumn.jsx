// QueueColumn — stat strip + filter chips + live booking list
function StatStrip({ bookings, filter, onFilter }) {
  const { STATES } = window.OPS;
  const count = (pred) => bookings.filter(pred).length;
  const tiles = [
  { key: "all", n: bookings.filter((b) => !["COMPLETED", "CANCELLED"].includes(b.state)).length, l: "Đang hoạt động", c: "var(--teal-700)", icon: "activity", delta: "+2.5%", up: true },
  { key: "MATCHING", n: count((b) => b.state === "MATCHING"), l: "Đang ghép", c: "var(--coral-500)", icon: "loader", delta: "live", up: true },
  { key: "active", n: count((b) => ["ACCEPTED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(b.state)), l: "Đang phục vụ", c: "var(--mint-500)", icon: "footprints", delta: "+2.5%", up: true },
  { key: "exception", n: count((b) => b.exception), l: "Cần xử lý", c: "var(--crimson-500)", icon: "triangle-alert", delta: "-1.5%", up: false },
  { key: "COMPLETED", n: count((b) => b.state === "COMPLETED"), l: "Hoàn thành hôm nay", c: "var(--mint-600)", icon: "check-check", delta: "+2.5%", up: true }];

  return (
    <div className="statstrip" style={{ padding: "0px" }}>
      {tiles.map((t) =>
      <div key={t.key} className={"stat-tile" + (filter === t.key ? " stat-tile--on" : "")} onClick={() => onFilter(filter === t.key ? "all" : t.key)} style={{ height: "287px" }}>
          <div className="stat-tile__ic" style={{ background: `color-mix(in srgb, ${t.c} 13%, white)`, color: t.c }}><I n={t.icon} s={22} /></div>
          <div className="stat-tile__body">
            <div className="stat-tile__l">{t.l}</div>
            <div className="stat-tile__row">
              <span className="stat-tile__n">{t.n}</span>
              {t.delta === "live" ?
            <span className="stat-tile__delta stat-tile__delta--up"><span className="livechip__dot" style={{ width: 6, height: 6 }}></span>live</span> :

            <span className={"stat-tile__delta " + (t.up ? "stat-tile__delta--up" : "stat-tile__delta--down")}><I n={t.up ? "trending-up" : "trending-down"} s={11} />{t.delta}</span>
            }
            </div>
          </div>
        </div>
      )}
    </div>);

}

function BookingRow({ b, selected, onSelect, autopilot }) {
  const { STATES, SERVICES, ktvById, priceOf, fmtMoney, ago } = window.OPS;
  const S = STATES[b.state];
  const svc = SERVICES[b.serviceKey];
  const p = priceOf(b);
  const k = b.assigned ? ktvById(b.assigned) : null;
  const ex = b.exception ? window.OPS.exMeta(b.exception.type) : null;
  const exColor = ex ? window.OPS.SEV[ex.sev].color : null;

  let sub = null;
  if (ex) {
    const counting = autopilot && typeof b.aiCountdown === "number";
    sub = counting ?
    <span className="row gap6" style={{ color: "var(--mint-600)", fontWeight: 800 }}><I n="sparkles" s={13} /> AI tự xử sau {b.aiCountdown}s</span> :
    <span className="row gap6" style={{ color: window.OPS.SEV[ex.sev].text, fontWeight: 700 }}><I n={ex.icon} s={13} /> {b.exception.detail.split(" — ")[0].split(".")[0]}</span>;
  } else if (b.state === "MATCHING") {
    const cur = b.candidates && b.candidates[b.offerIdx];
    sub = cur ?
    <span className="ttl-mini"><I n="timer" s={12} /> Mời {cur.ktv.name.split(" ").slice(-1)[0]} · còn {b.ttl}s</span> :
    <span className="ttl-mini" style={{ color: "var(--crimson-600)" }}><I n="alert-circle" s={12} /> Hết ứng viên</span>;
  } else if (k) {
    sub = <span className="row gap6"><I n="user-check" s={13} /> {k.name}</span>;
  }

  return (
    <div className={"brow" + (selected ? " brow--on" : "") + (ex ? " brow--ex" : "")} style={ex ? { "--exc": exColor } : undefined} onClick={() => onSelect(b.id)}>
      <div className="brow__state" style={{ background: ex ? exColor : S.color }}></div>
      <div className="brow__main">
        <div className="brow__top">
          <span className="brow__cust">{b.cust}</span>
          {ex ? <ExTag type={b.exception.type} size="sm" /> : <StatePill state={b.state} />}
        </div>
        <div className="brow__meta">
          <span>{svc.vi} · {b.dur}'</span>
          <span className="dot-sep"></span>
          <span><I n="map-pin" s={13} /> {b.region}</span>
          {b.surge > 1 ? <><span className="dot-sep"></span><span className="surge-tag">{b.surge}× surge</span></> : null}
        </div>
        <div className="brow__meta" style={{ marginTop: 4 }}>{sub}</div>
      </div>
      <div className="brow__right">
        <span className="brow__price">{fmtMoney(p.total)}</span>
        <span className="brow__id">{b.id}</span>
        <span className="brow__id" style={{ fontWeight: 500, color: "var(--text-tertiary)" }}>{ago(b.createdAt)}</span>
      </div>
    </div>);

}

function QueueColumn({ bookings, statFilter, onStatFilter, chipFilter, onChipFilter, selectedId, onSelect, autopilot }) {
  const { STATES } = window.OPS;

  // chip filters (state groups)
  const chips = [
  { key: "all", vi: "Tất cả" },
  { key: "MATCHING", vi: "Đang ghép" },
  { key: "active", vi: "Đang phục vụ" },
  { key: "exception", vi: "Ngoại lệ" },
  { key: "done", vi: "Đã xong" }];


  let list = bookings.slice();
  const applyKey = (key) => {
    if (key === "all") return list.filter((b) => true);
    if (key === "active") return list.filter((b) => ["ACCEPTED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(b.state));
    if (key === "done") return list.filter((b) => ["COMPLETED", "CANCELLED"].includes(b.state));
    if (key === "exception") return list.filter((b) => b.exception);
    return list.filter((b) => b.state === key);
  };
  // statFilter (from tiles) takes precedence if set to a specific group
  if (statFilter === "active") list = applyKey("active");else
  if (statFilter === "exception") list = applyKey("exception");else
  if (statFilter !== "all") list = applyKey(statFilter);else
  list = applyKey(chipFilter);

  // sort: exceptions first (by severity), then matching, active, done
  const sevRank = { critical: -3, high: -2, medium: -1 };
  const rank = (b) => {
    if (b.exception) return sevRank[window.OPS.exMeta(b.exception.type).sev] ?? 0;
    return { MATCHING: 0, EN_ROUTE: 1, ARRIVED: 1, ACCEPTED: 2, IN_PROGRESS: 1, DISPUTED: 0, COMPLETED: 4, CANCELLED: 5 }[b.state] ?? 3;
  };
  list.sort((a, c) => rank(a) - rank(c) || c.createdAt - a.createdAt);

  const countFor = (key) => {
    if (key === "all") return bookings.length;
    if (key === "active") return bookings.filter((b) => ["ACCEPTED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(b.state)).length;
    if (key === "done") return bookings.filter((b) => ["COMPLETED", "CANCELLED"].includes(b.state)).length;
    if (key === "exception") return bookings.filter((b) => b.exception).length;
    return bookings.filter((b) => b.state === key).length;
  };

  return (
    <div className="panel col-queue">
      <div className="panel__head">
        <I n="radio" s={18} style={{ color: "var(--color-primary)" }} />
        <h3>Hàng đợi điều phối</h3>
        <span className="panel__count">{list.length} đơn</span>
      </div>
      <div className="filterbar">
        {chips.map((c) =>
        <button key={c.key} className={"fchip" + ((statFilter === "all" ? chipFilter : null) === c.key ? " fchip--on" : "")}
        onClick={() => {onStatFilter("all");onChipFilter(c.key);}}>
            {c.vi} <span className="fchip__n">{countFor(c.key)}</span>
          </button>
        )}
      </div>
      <div className="queue-scroll">
        {list.length === 0 ?
        <div className="empty-hint"><I n="inbox" s={18} /> Không có đơn nào</div> :
        list.map((b) =>
        <BookingRow key={b.id} b={b} selected={b.id === selectedId} onSelect={onSelect} autopilot={autopilot} />
        )}
      </div>
    </div>);

}
window.QueueColumn = QueueColumn;
window.StatStrip = StatStrip;