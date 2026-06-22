// LiveMap — Leaflet tile map with KTV + active job pins
function LiveMap({ bookings, selectedId, onSelectBooking }) {
  const { KTV, ktvById, STATES } = window.OPS;

  const jobs = bookings.filter((b) => !["COMPLETED", "CANCELLED"].includes(b.state));
  const onlineCount = KTV.filter((k) => k.status === "online").length;
  const busyCount   = KTV.filter((k) => k.status === "busy").length;

  const mapRef     = React.useRef(null);
  const leaflet    = React.useRef(null); // { map, tileLayer, markers: [] }
  const [style, setStyle] = React.useState("voyager");

  // HCM bounding box (approx): lat 10.65–10.90, lng 106.58–106.85
  const toLatLng = (x, y) => [10.90 - (y / 100) * 0.25, 106.58 + (x / 100) * 0.27];

  const TILES = {
    voyager: {
      label: "🗺️ Voyager",
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      attr: "© OpenStreetMap © CartoDB",
      sub: "abcd",
    },
    dark: {
      label: "⚫ Dark",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      attr: "© OpenStreetMap © CartoDB",
      sub: "abcd",
    },
    street: {
      label: "📍 Street",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attr: "© OpenStreetMap contributors",
      sub: "abc",
    },
  };

  // Init map once
  React.useEffect(() => {
    if (leaflet.current || !mapRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: true }).setView([10.78, 106.70], 13);
    const t = TILES.voyager;
    const tileLayer = L.tileLayer(t.url, { attribution: t.attr, subdomains: t.sub, maxZoom: 19 }).addTo(map);
    leaflet.current = { map, tileLayer, markers: [] };
    return () => { map.remove(); leaflet.current = null; };
  }, []);

  // Swap tile layer on style change
  React.useEffect(() => {
    if (!leaflet.current) return;
    const { map } = leaflet.current;
    leaflet.current.tileLayer.remove();
    const t = TILES[style];
    leaflet.current.tileLayer = L.tileLayer(t.url, { attribution: t.attr, subdomains: t.sub, maxZoom: 19 }).addTo(map);
  }, [style]);

  // Re-draw markers when data changes
  React.useEffect(() => {
    if (!leaflet.current) return;
    const { map } = leaflet.current;

    leaflet.current.markers.forEach((m) => m.remove());
    leaflet.current.markers = [];

    // KTV markers
    KTV.filter((k) => k.status !== "offline").forEach((k) => {
      const color = k.status === "busy" ? "#6B7280" : "#0D9488";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff">${k.name.split(" ").slice(-1)[0][0]}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const m = L.marker(toLatLng(k.x, k.y), { icon }).addTo(map).bindPopup(k.name);
      leaflet.current.markers.push(m);
    });

    // Job markers
    jobs.forEach((b) => {
      const S = STATES[b.state];
      const matching = b.state === "MATCHING";
      const color = matching ? "#EF4444" : S.color;
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);${matching ? "animation:pulse 1.4s ease-in-out infinite" : ""}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const m = L.marker(toLatLng(b.x, b.y), { icon })
        .addTo(map)
        .on("click", () => onSelectBooking(b.id))
        .bindPopup(b.cust);
      leaflet.current.markers.push(m);
    });
  }, [bookings, style]);

  return (
    <div className="panel col-map">
      <div className="panel__head">
        <I n="map" s={18} style={{ color: "var(--color-primary)" }} />
        <h3>{window.tr("Bản đồ điều phối")}</h3>
        <span className="panel__count">{jobs.length} {window.tr("đơn")} · {onlineCount} {window.tr("KTV rảnh")}</span>
      </div>
      <div className="mapwrap" style={{ position: "relative" }}>
        {/* Leaflet mount point */}
        <div ref={mapRef} style={{ position: "absolute", inset: 0, zIndex: 0 }}></div>

        {/* Tile style switcher — top RIGHT to avoid zoom controls */}
        <div style={{
          position: "absolute", bottom: 10, left: 10, zIndex: 1000,
          display: "flex", gap: 6, flexDirection: "row",
        }}>
          {Object.entries(TILES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setStyle(key)}
              style={{
                padding: "5px 10px",
                borderRadius: 20,
                border: style === key ? "2px solid var(--color-primary, #0D5C75)" : "1px solid rgba(0,0,0,.18)",
                background: style === key ? "#fff" : "rgba(255,255,255,.85)",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: style === key ? 700 : 500,
                color: style === key ? "var(--color-primary, #0D5C75)" : "#333",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,.18)",
                backdropFilter: "blur(4px)",
                transition: "all .15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* floating stats */}
        <div className="map-float" style={{ zIndex: 999 }}>
          <div className="map-stat"><b>{onlineCount}</b><span>Rảnh</span></div>
          <div className="map-stat"><b style={{ color: "var(--gray-600)" }}>{busyCount}</b><span>Bận</span></div>
          <div className="map-stat"><b style={{ color: "var(--crimson-600)" }}>{jobs.filter((j) => j.state === "MATCHING").length}</b><span>Chờ ghép</span></div>
        </div>

        <div className="map-legend" style={{ zIndex: 999 }}>
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
