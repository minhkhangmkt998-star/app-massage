// LiveMap — stylized HCM district map with KTV + active job pins
function LiveMap({ bookings, selectedId, onSelectBooking }) {
  const { KTV, ktvById, STATES } = window.OPS;

  // Jobs to plot = anything not done/cancelled
  const jobs = bookings.filter((b) => !["COMPLETED", "CANCELLED"].includes(b.state));
  const onlineCount = KTV.filter((k) => k.status === "online").length;
  const busyCount = KTV.filter((k) => k.status === "busy").length;

  const ktvColor = (k) => (k.status === "busy" ? "var(--gray-500)" : "var(--teal-600)");

  return (
    <div className="panel col-map">
      <div className="panel__head">
        <I n="map" s={18} style={{ color: "var(--color-primary)" }} />
        <h3>{window.tr("Bản đồ điều phối")}</h3>
        <span className="panel__count">{jobs.length} {window.tr("đơn")} · {onlineCount} {window.tr("KTV rảnh")}</span>
      </div>
      <div className="mapwrap">
        <div className="mapcanvas"></div>

        {/* roads + zones */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <g className="map-grid">
            {[20, 40, 60, 80].map((v) => <line key={"h" + v} x1="0" y1={v} x2="100" y2={v} />)}
            {[20, 40, 60, 80].map((v) => <line key={"v" + v} x1={v} y1="0" x2={v} y2="100" />)}
          </g>
          <g className="map-road map-road--big">
            <path d="M -5 38 Q 40 30 105 46" />
            <path d="M 30 -5 Q 44 50 36 105" />
          </g>
          <g className="map-road map-road--med">
            <path d="M -5 64 Q 50 58 105 72" />
            <path d="M 66 -5 Q 60 50 78 105" />
            <path d="M -5 18 Q 50 24 105 14" />
          </g>
          <ellipse className="map-zone" cx="42" cy="30" rx="20" ry="15" />
          <text className="map-zone-label" x="42" y="31" textAnchor="middle">Quận 1</text>
          <ellipse className="map-zone" cx="68" cy="62" rx="18" ry="14" />
          <text className="map-zone-label" x="68" y="63" textAnchor="middle">Phú Nhuận</text>
        </svg>

        {/* KTV pins */}
        {KTV.filter((k) => k.status !== "offline").map((k) => (
          <div key={k.id} className="mpin mpin--ktv" style={{ left: k.x + "%", top: k.y + "%", background: ktvColor(k) }} title={k.name}>
            <span className="mpin-av">{k.name.split(" ").slice(-1)[0][0]}</span>
          </div>
        ))}

        {/* Job pins */}
        {jobs.map((b) => {
          const S = STATES[b.state];
          const sel = b.id === selectedId;
          const matching = b.state === "MATCHING";
          return (
            <div key={b.id} className={"mpin mpin--job" + (sel ? " sel" : "")} style={{ left: b.x + "%", top: b.y + "%" }} onClick={() => onSelectBooking(b.id)} title={b.cust}>
              {matching ? <span className="pulse-ring"></span> : null}
              <div className="ringpin" style={{ background: matching ? "var(--crimson-500)" : S.color }}></div>
            </div>
          );
        })}

        {/* floating stats */}
        <div className="map-float">
          <div className="map-stat"><b>{onlineCount}</b><span>Rảnh</span></div>
          <div className="map-stat"><b style={{ color: "var(--gray-600)" }}>{busyCount}</b><span>Bận</span></div>
          <div className="map-stat"><b style={{ color: "var(--crimson-600)" }}>{jobs.filter((j) => j.state === "MATCHING").length}</b><span>Chờ ghép</span></div>
        </div>

        <div className="map-legend">
          <div className="leg-row"><span className="leg-dot" style={{ background: "var(--teal-600)" }}></span> {window.tr("KTV rảnh")}</div>
          <div className="leg-row"><span className="leg-dot" style={{ background: "var(--gray-500)" }}></span> {window.tr("KTV đang bận")}</div>
          <div className="leg-row"><span className="leg-dot" style={{ background: "var(--crimson-500)" }}></span> {window.tr("Đơn chờ ghép")}</div>
          <div className="leg-row"><span className="leg-dot" style={{ background: "var(--teal-300)" }}></span> {window.tr("Đang phục vụ")}</div>
        </div>
      </div>
    </div>
  );
}
window.LiveMap = LiveMap;
