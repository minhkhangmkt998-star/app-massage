// Secondary section pages — lighter but real, so the whole console navigates.
const opsSection = {};

function PageHead({ title, lead }) {
  return <div><h1 className="topbar__title" style={{ marginBottom: 2 }}>{window.tr(title)}</h1><p className="page__lead">{window.tr(lead)}</p></div>;
}

// ---- KTV roster ------------------------------------------
function KtvPage() {
  const { KTV } = window.OPS;
  return (
    <div className="page">
      <PageHead title="Mạng lưới KTV" lead="Hồ sơ, hạng và độ tin cậy của kỹ thuật viên. Hạng tính trên cửa sổ trượt 30 ngày (PRD §3.2)." />
      <table className="dtable">
        <thead><tr><th>KTV</th><th>Hạng</th><th>Đánh giá</th><th>Số buổi</th><th>Tỷ lệ nhận</th><th>Huy hiệu</th><th>Trạng thái</th></tr></thead>
        <tbody>
          {KTV.map((k) => (
            <tr key={k.id}>
              <td><div className="row gap10"><Av name={k.name} status={k.status} size="sm" /><b>{k.name}</b></div></td>
              <td><TierTag tier={k.tier} /></td>
              <td><b className="mono">{k.rating}</b> <I n="star" s={12} style={{ color: "var(--amber-500)", verticalAlign: -1 }} /></td>
              <td className="mono">{k.sessions}</td>
              <td><b className="mono" style={{ color: k.accept >= 0.9 ? "var(--mint-600)" : k.accept >= 0.82 ? "var(--amber-600)" : "var(--crimson-600)" }}>{Math.round(k.accept * 100)}%</b></td>
              <td><span className="muted" style={{ fontSize: 10.8 }}>{k.badges.length ? k.badges.join(" · ") : "—"}</span></td>
              <td>{k.status === "online" ? <span className="spill" style={{ color: "var(--mint-600)", background: "var(--mint-100)" }}><span className="spill__dot"></span>Online</span> : k.status === "busy" ? <span className="spill" style={{ color: "var(--amber-600)", background: "var(--amber-100)" }}><span className="spill__dot"></span>Bận</span> : <span className="spill" style={{ color: "var(--text-tertiary)", background: "var(--gray-100)" }}><span className="spill__dot"></span>Offline</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- KYC queue -------------------------------------------
function KycPage() {
  const [items, setItems] = React.useState([
    { id: 1, name: "Lý Thanh Phong", doc: "CCCD + chứng chỉ nghề", time: "8 phút trước", status: "pending" },
    { id: 2, name: "Ngô Bích Vân", doc: "CCCD + giấy khám SK", time: "26 phút trước", status: "pending" },
    { id: 3, name: "Trương Gia Hân", doc: "CCCD", time: "1 giờ trước", status: "pending", flag: "Ảnh mờ — cần chụp lại" },
    { id: 4, name: "Phan Đăng Khoa", doc: "CCCD + chứng chỉ", time: "2 giờ trước", status: "pending" },
  ]);
  const act = (id, status) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status } : x)));
  return (
    <div className="page">
      <PageHead title="Duyệt KYC" lead="Định danh KTV trước khi cho online — bảo vệ khách & nền tảng. Bắt buộc CCCD; chứng chỉ nghề tăng matching score." />
      <div className="card-grid" style={{ maxWidth: 760 }}>
        {items.map((it) => (
          <div className="lite-card" key={it.id} style={{ opacity: it.status === "pending" ? 1 : 0.6 }}>
            <div className="row between">
              <div className="row gap14">
                <Av name={it.name} size="md" />
                <div>
                  <div className="row gap6"><b style={{ fontSize: 12.9 }}>{it.name}</b>{it.flag ? <span className="spill" style={{ color: "var(--amber-600)", background: "var(--amber-100)" }}><I n="alert-triangle" s={11} />Cần xem</span> : null}</div>
                  <div className="muted" style={{ fontSize: 10.8, marginTop: 2 }}>{it.doc} · {it.time}</div>
                  {it.flag ? <div style={{ fontSize: 10.3, color: "var(--amber-600)", fontWeight: 700, marginTop: 4 }}>{it.flag}</div> : null}
                </div>
              </div>
              {it.status === "pending" ? (
                <div className="row gap10">
                  <button className="lull-btn lull-btn--sm lull-btn--ghost" style={{ color: "var(--crimson-600)" }} onClick={() => act(it.id, "rejected")}>Từ chối</button>
                  <button className="lull-btn lull-btn--sm lull-btn--primary" onClick={() => act(it.id, "approved")}><I n="check" s={15} /> Duyệt</button>
                </div>
              ) : (
                <span className="spill" style={{ color: it.status === "approved" ? "var(--mint-600)" : "var(--crimson-600)", background: it.status === "approved" ? "var(--mint-100)" : "var(--crimson-100)" }}>
                  <I n={it.status === "approved" ? "check" : "x"} s={12} />{it.status === "approved" ? "Đã duyệt" : "Đã từ chối"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- SOS center ------------------------------------------
function SosPage() {
  return (
    <div className="page">
      <PageHead title="An toàn / SOS" lead="USP “KTV được bảo vệ”. SOS ưu tiên tuyệt đối: ngắt buổi, escalate Ops → hotline → cơ quan chức năng (PRD §3.4)." />
      <div className="lite-card" style={{ background: "var(--crimson-100)", borderColor: "var(--crimson-100)", maxWidth: 760, marginBottom: 14 }}>
        <div className="row between">
          <div className="row gap14">
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--crimson-500)", display: "grid", placeItems: "center", color: "#fff" }}><I n="shield-alert" s={22} /></div>
            <div>
              <div className="row gap6"><b style={{ fontSize: 12.9 }}>SOS đang hoạt động · Bùi Anh Tuấn</b><span className="spill spill--live" style={{ color: "var(--crimson-600)", background: "#fff" }}><span className="spill__dot"></span>LIVE</span></div>
              <div style={{ fontSize: 10.8, color: "var(--crimson-600)", fontWeight: 700, marginTop: 2 }}>Discreet SOS · Bình Thạnh · kích hoạt 40 giây trước · SLA phản hồi 2 phút</div>
            </div>
          </div>
          <button className="lull-btn lull-btn--danger"><I n="phone-call" s={16} /> Gọi hotline T&S</button>
        </div>
      </div>
      <div className="card-grid" style={{ maxWidth: 760 }}>
        {[
          { n: "Vũ Thị Mai", t: "Hôm nay 19:12", r: "Check-in trễ — Ops gọi xác minh, KTV an toàn", s: "resolved" },
          { n: "Lê Quốc Bảo", t: "Hôm qua 21:40", r: "KTV rời buổi vì lý do an toàn — no-penalty, mở điều tra", s: "resolved" },
        ].map((x, i) => (
          <div className="lite-card" key={i}>
            <div className="row between">
              <div className="row gap14"><Av name={x.n} size="sm" /><div><b style={{ fontSize: 12 }}>{x.n}</b><div className="muted" style={{ fontSize: 10.8 }}>{x.t} · {x.r}</div></div></div>
              <span className="spill" style={{ color: "var(--mint-600)", background: "var(--mint-100)" }}><I n="check" s={12} />Đã xử lý</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Surge config ----------------------------------------
function SurgePage() {
  const { REGIONS } = window.OPS;
  const init = { "Quận 1": 1.0, "Quận 3": 1.3, "Bình Thạnh": 1.0, "Phú Nhuận": 1.1, "Quận 7": 1.0 };
  const [surge, setSurge] = React.useState(init);
  const SMAX = 1.8;
  return (
    <div className="page">
      <PageHead title="Surge & Giá" lead="Điều tiết cung–cầu real-time. Surge có trần (surge_max) để khách không sốc giá; chênh lệch hội viên do nền tảng bù (PRD §3.3)." />
      <div className="card-grid" style={{ maxWidth: 620 }}>
        {REGIONS.map((r) => {
          const v = surge[r];
          const hot = v >= 1.3;
          return (
            <div className="lite-card" key={r}>
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="row gap10"><I n="map-pin" s={17} style={{ color: "var(--color-primary)" }} /><b style={{ fontSize: 12.5 }}>{r}</b>{hot ? <span className="spill" style={{ color: "var(--coral-700)", background: "var(--coral-100)" }}><I n="flame" s={11} />Khu vực nóng</span> : null}</div>
                <b className="mono" style={{ fontSize: 17.2, color: hot ? "var(--coral-700)" : "var(--text-primary)" }}>{v.toFixed(1)}×</b>
              </div>
              <input type="range" min="1" max={SMAX} step="0.1" value={v} onChange={(e) => setSurge((s) => ({ ...s, [r]: +e.target.value }))}
                style={{ width: "100%", accentColor: hot ? "var(--coral-500)" : "var(--color-primary)" }} />
              <div className="row between" style={{ fontSize: 9.5, color: "var(--text-tertiary)", fontWeight: 700, marginTop: 4 }}><span>1.0× cơ bản</span><span>trần {SMAX}×</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Matching logic explainer ----------------------------
function MatchingLogicPage() {
  const { W } = window.OPS;
  const rows = [
    { vi: "Khoảng cách / ETA", w: W.prox, note: "ETA càng ngắn điểm càng cao; vượt ngưỡng bị loại", c: "var(--teal-600)" },
    { vi: "Đánh giá & chất lượng", w: W.rating, note: "Rating trượt + badge; phạt review tiêu cực gần đây", c: "var(--mint-500)" },
    { vi: "Lịch sử với khách", w: W.affinity, note: "Đã phục vụ & đánh giá tốt → ưu tiên KTV quen", c: "var(--coral-500)" },
    { vi: "Hạng KTV (Tier)", w: W.tier, note: "Gold/Elite +boost; cân bằng fairness floor cho Bronze", c: "var(--amber-500)" },
    { vi: "Độ tin cậy nhận", w: W.reliability, note: "Tỷ lệ accept & không hủy gần đây → giảm match-fail", c: "var(--teal-800)" },
  ];
  return (
    <div className="page">
      <PageHead title="Logic ghép nối" lead="Weighted scoring + hard constraints. Trọng số cấu hình theo vùng/giờ; tổng = 100%. Hội viên lull+ cộng priority_boost sau chuẩn hóa." />
      <div className="lite-card" style={{ maxWidth: 720, marginBottom: 16, background: "var(--teal-900)", color: "#cfe2ea", borderColor: "var(--teal-900)" }}>
        <div className="t-overline" style={{ color: "var(--teal-300)", marginBottom: 8 }}>Công thức</div>
        <div className="mono" style={{ fontSize: 12.9, fontWeight: 700, color: "#fff", lineHeight: 1.7 }}>
          score = 0.30·prox + 0.25·rating + 0.20·affinity + 0.15·tier + 0.10·reliability
        </div>
        <div style={{ fontSize: 10.8, marginTop: 10, color: "#9fc0cd" }}>Offer model: gửi tuần tự cho top-N theo offer_TTL (15s/KTV) thay vì broadcast. Hết vòng → mở rộng bán kính → fallback Ops thủ công.</div>
      </div>
      <div className="card-grid" style={{ maxWidth: 720 }}>
        {rows.map((r) => (
          <div className="lite-card" key={r.vi}>
            <div className="row between" style={{ marginBottom: 8 }}>
              <b style={{ fontSize: 12.5 }}>{r.vi}</b>
              <b className="mono" style={{ fontSize: 15.5, color: r.c }}>{Math.round(r.w * 100)}%</b>
            </div>
            <div className="sbar-track" style={{ height: 8 }}><div className="sbar-fill" style={{ width: r.w * 250 + "%", background: r.c, maxWidth: "100%" }}></div></div>
            <div className="muted" style={{ fontSize: 10.8, marginTop: 8 }}>{r.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericPage({ title, lead, icon }) {
  return (
    <div className="page">
      <PageHead title={title} lead={lead} />
      <div className="empty-hint" style={{ height: 240, flexDirection: "column", gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 8, background: "var(--surface)", border: "1px solid var(--color-border)", display: "grid", placeItems: "center", color: "var(--color-primary)" }}><I n={icon} s={26} /></div>
        {window.tr("Màn hình này nằm ngoài phạm vi prototype điều phối hiện tại.")}
      </div>
    </div>
  );
}

Object.assign(window, { KtvPage, KycPage, SosPage, SurgePage, MatchingLogicPage, GenericPage });
