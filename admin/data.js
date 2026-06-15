/* ============================================================
   Lull Ops Console — mock data, state machine & matching logic
   ============================================================ */
(function () {
  // ---- Booking state machine ------------------------------
  // colorVar maps to a CSS custom property for the state hue.
  const STATES = {
    CREATED:     { key: "CREATED",     vi: "Đã tạo",      color: "var(--gray-500)",   group: "queue",  i: 0 },
    MATCHING:    { key: "MATCHING",    vi: "Đang ghép",   color: "var(--amber-500)",  group: "queue",  i: 1, live: true },
    ACCEPTED:    { key: "ACCEPTED",    vi: "Đã nhận",     color: "var(--teal-500)",   group: "active", i: 2 },
    EN_ROUTE:    { key: "EN_ROUTE",    vi: "Đang đến",    color: "var(--teal-600)",   group: "active", i: 3, live: true },
    ARRIVED:     { key: "ARRIVED",     vi: "Đã đến",      color: "var(--teal-700)",   group: "active", i: 4 },
    IN_PROGRESS: { key: "IN_PROGRESS", vi: "Đang làm",    color: "var(--mint-500)",   group: "active", i: 5, live: true },
    COMPLETED:   { key: "COMPLETED",   vi: "Hoàn thành",  color: "var(--mint-600)",   group: "done",   i: 6 },
    CANCELLED:   { key: "CANCELLED",   vi: "Đã hủy",      color: "var(--gray-400)",   group: "done",   i: 7 },
    DISPUTED:    { key: "DISPUTED",    vi: "Khiếu nại",   color: "var(--crimson-500)",group: "alert",  i: 8 },
  };
  // canonical happy path order for the stepper
  const FLOW = ["CREATED", "MATCHING", "ACCEPTED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS", "COMPLETED"];
  const FLOW_LABEL = {
    CREATED: "Đã tạo · giữ tiền",
    MATCHING: "Đang tìm KTV",
    ACCEPTED: "KTV đã nhận",
    EN_ROUTE: "KTV đang di chuyển",
    ARRIVED: "KTV đã đến nơi",
    IN_PROGRESS: "Đang trị liệu",
    COMPLETED: "Hoàn thành · thu tiền",
  };

  // ---- Edge cases / exceptions (PRD failure modes) --------
  // Each: severity, hue, icon, plain-VI label, and the resolution
  // actions Ops can take. `sla` = minutes before it auto-escalates.
  const EXCEPTIONS = {
    NO_SUPPLY:      { vi: "Hết KTV trong bán kính",        sev: "high",     icon: "user-x",       sla: 5,  actions: ["Mở rộng bán kính", "Đánh thức KTV gần nhất", "Đề nghị hẹn lại"] },
    ALL_DECLINED:   { vi: "Tất cả KTV từ chối",            sev: "high",     icon: "thumbs-down",  sla: 4,  actions: ["Tăng thưởng nhận đơn", "Gán Ops thủ công", "Hủy & hoàn tiền"] },
    SLA_BREACH:     { vi: "Quá hạn ghép · SLA",            sev: "critical", icon: "alarm-clock-off", sla: 0, actions: ["Ưu tiên ghép gấp", "Tặng voucher xin lỗi", "Leo thang quản lý"] },
    KTV_CANCELLED:  { vi: "KTV hủy sau khi nhận",          sev: "critical", icon: "user-minus",   sla: 2,  actions: ["Ghép lại ưu tiên", "Phạt độ tin cậy KTV", "Thông báo khách"] },
    KTV_NOSHOW:     { vi: "KTV mất tín hiệu / không đến", sev: "critical", icon: "wifi-off",     sla: 3,  actions: ["Gọi KTV", "Ghép KTV thay thế", "Mở điều tra an toàn"] },
    CLIENT_NOSHOW:  { vi: "Khách không có mặt",            sev: "medium",   icon: "door-closed",  sla: 5,  actions: ["Gọi khách", "Tính phí no-show", "Hủy đơn"] },
    PAYMENT_FAILED: { vi: "Giữ tiền thất bại",            sev: "high",     icon: "credit-card",  sla: 4,  actions: ["Thử lại thanh toán", "Đổi phương thức", "Tạm giữ đơn"] },
    ADDRESS_OOZ:    { vi: "Ngoài vùng phục vụ",            sev: "medium",   icon: "map-pin-off",  sla: 6,  actions: ["Xác minh địa chỉ", "Mở vùng tạm thời", "Hủy đơn"] },
    LOW_TRUST:      { vi: "Khách rủi ro cao",              sev: "high",     icon: "shield-x",     sla: 8,  actions: ["Yêu cầu trả trước 100%", "Gọi xác minh", "Chặn & hủy"] },
    SURGE_CAP:      { vi: "Cầu vượt cung · surge trần",   sev: "medium",   icon: "flame",       sla: 10, actions: ["Điều KTV vùng lân cận", "Mở hàng đợi ưu tiên", "Thông báo chờ"] },
    DISPUTE:        { vi: "Khiếu nại · giữ payout",        sev: "high",     icon: "flag",        sla: 30, actions: ["Mở ticket T&S", "Hoàn tiền khách", "Đối chất hai bên"] },
  };
  const SEV = {
    critical: { vi: "Nghiêm trọng", color: "var(--crimson-500)", dot: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)" },
    high:     { vi: "Cao",          color: "var(--teal-700)",     dot: "var(--teal-700)",     soft: "var(--teal-50)",     text: "var(--teal-800)" },
    medium:   { vi: "Trung bình",   color: "var(--gray-500)",     dot: "var(--gray-400)",     soft: "var(--gray-100)",    text: "var(--text-secondary)" },
  };
  const exMeta = (type) => EXCEPTIONS[type] || null;

  // Nhóm edge case theo ĐỐI TƯỢNG để dễ quản lý
  const EX_OBJECTS = {
    ktv:      { vi: "KTV (Kỹ thuật viên)", short: "KTV", icon: "hand-helping", color: "var(--teal-700)", soft: "var(--teal-50)",
      types: ["NO_SUPPLY", "ALL_DECLINED", "KTV_CANCELLED", "KTV_NOSHOW"] },
    client:   { vi: "Khách hàng", short: "Khách", icon: "user-round", color: "var(--coral-500)", soft: "var(--coral-50)",
      types: ["CLIENT_NOSHOW", "LOW_TRUST"] },
    payment:  { vi: "Thanh toán & Tranh chấp", short: "Thanh toán", icon: "wallet", color: "var(--amber-500)", soft: "var(--amber-100)",
      types: ["PAYMENT_FAILED", "DISPUTE"] },
    system:   { vi: "Hệ thống & Vận hành", short: "Hệ thống", icon: "settings-2", color: "var(--teal-600)", soft: "var(--teal-50)",
      types: ["SLA_BREACH", "ADDRESS_OOZ", "SURGE_CAP"] },
  };
  // tra cứu ngược: type -> object key
  const EX_OBJ_OF = {};
  Object.entries(EX_OBJECTS).forEach(([k, o]) => o.types.forEach((t) => { EX_OBJ_OF[t] = k; }));

  const SERVICES = {
    thai:    { vi: "Thái cổ truyền", icon: "person-standing" },
    deep:    { vi: "Mô sâu",         icon: "hand-helping" },
    swedish: { vi: "Thụy Điển",      icon: "waves" },
    foot:    { vi: "Bấm huyệt chân", icon: "footprints" },
    hot:     { vi: "Đá nóng",        icon: "flame" },
    sports:  { vi: "Thể thao",       icon: "activity" },
  };

  const REGIONS = ["Quận 1", "Quận 3", "Bình Thạnh", "Phú Nhuận", "Quận 7"];

  // ---- KTV (providers) ------------------------------------
  // x/y are 0–100 map coords. Each carries attrs the scorer reads.
  const KTV = [
    { id: "k1", name: "Nguyễn Thu Hà",  tier: "Gold",   rating: 4.9, sessions: 612, accept: 0.94, status: "online", x: 34, y: 30, svc: ["deep","swedish"], badges: ["Đúng giờ","Khách quay lại cao"] },
    { id: "k2", name: "Trần Minh Anh",  tier: "Elite",  rating: 4.95,sessions: 980, accept: 0.97, status: "online", x: 58, y: 22, svc: ["thai","hot"],     badges: ["Chứng chỉ nghề","Vệ sinh 5★"] },
    { id: "k3", name: "Lê Quốc Bảo",    tier: "Silver", rating: 4.7, sessions: 188, accept: 0.86, status: "online", x: 46, y: 52, svc: ["sports","deep"],   badges: ["Đúng giờ"] },
    { id: "k4", name: "Phạm Mỹ Linh",   tier: "Gold",   rating: 4.85,sessions: 421, accept: 0.91, status: "busy",   x: 72, y: 44, svc: ["swedish","foot"],  badges: ["Khách quay lại cao"] },
    { id: "k5", name: "Đỗ Hoàng Nam",   tier: "Bronze", rating: 4.6, sessions: 47,  accept: 0.80, status: "online", x: 24, y: 62, svc: ["thai","foot"],     badges: [] },
    { id: "k6", name: "Vũ Thị Mai",     tier: "Silver", rating: 4.75,sessions: 233, accept: 0.88, status: "online", x: 64, y: 66, svc: ["deep","hot"],      badges: ["Vệ sinh 5★"] },
    { id: "k7", name: "Bùi Anh Tuấn",   tier: "Gold",   rating: 4.88,sessions: 503, accept: 0.93, status: "busy",   x: 40, y: 78, svc: ["sports","swedish"], badges: ["Đúng giờ","Chứng chỉ nghề"] },
    { id: "k8", name: "Hồ Ngọc Diệp",   tier: "Bronze", rating: 4.55,sessions: 31,  accept: 0.78, status: "online", x: 82, y: 30, svc: ["foot","swedish"],   badges: [] },
    { id: "k9", name: "Đặng Kim Yến",   tier: "Silver", rating: 4.72,sessions: 156, accept: 0.85, status: "offline",x: 16, y: 40, svc: ["thai","deep"],     badges: ["Đúng giờ"] },
    { id: "k10", name: "Phan Hữu Lộc",   tier: "Bronze", rating: 4.3, sessions: 64,  accept: 0.71, status: "offline",x: 28, y: 18, svc: ["foot","swedish"],  badges: [] },
    { id: "k11", name: "Lương Thị Cẩm",  tier: "Silver", rating: 4.65,sessions: 142, accept: 0.83, status: "offline",x: 70, y: 58, svc: ["deep","hot"],      badges: ["Đúng giờ"] },
    { id: "k12", name: "Trịnh Văn Hải",  tier: "Bronze", rating: 3.9, sessions: 88,  accept: 0.58, status: "closed", x: 52, y: 36, svc: ["sports"],          badges: [], closedAt: "02/06/2026", closedReason: "Vi phạm chính sách an toàn — 2 cảnh báo SOS" },
    { id: "k13", name: "Mai Thanh Tùng",  tier: "Silver", rating: 4.1, sessions: 203, accept: 0.64, status: "closed", x: 38, y: 24, svc: ["swedish","foot"], badges: [], closedAt: "21/05/2026", closedReason: "KTV chủ động ngừng hợp tác" },
  ];
  const ktvById = (id) => KTV.find((k) => k.id === id);

  // ---- Trạng thái KTV (gom nhóm) --------------------------
  const KTV_GROUP = {
    online:  { vi: "Đang online", en: "Online",  icon: "wifi",       color: "var(--teal-700)", soft: "var(--teal-50)", text: "var(--teal-800)", match: (k) => k.status === "online" || k.status === "busy" },
    offline: { vi: "Đang offline", en: "Offline", icon: "wifi-off",   color: "var(--gray-500)", soft: "var(--gray-100)", text: "var(--text-secondary)", match: (k) => k.status === "offline" },
    closed:  { vi: "Đã đóng hồ sơ", en: "Closed", icon: "user-x",     color: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)", match: (k) => k.status === "closed" },
  };
  function ktvGroupOf(k) { return k.status === "closed" ? "closed" : k.status === "offline" ? "offline" : "online"; }

  // ---- Lịch sử nhận cuốc (per-KTV) ------------------------
  const _HX_SVC = ["deep", "swedish", "thai", "hot", "sports", "foot"];
  const _HX_AREA = ["Quận 1", "Quận 3", "Quận 7", "Bình Thạnh", "Phú Nhuận", "Quận 2", "Gò Vấp", "Tân Bình"];
  const _HX_OUT = [
    { k: "completed", w: 80 }, { k: "cancelled_ktv", w: 6 }, { k: "cancelled_client", w: 8 }, { k: "noshow_client", w: 6 },
  ];
  const HX_OUTCOME = {
    completed:        { vi: "Hoàn thành",        en: "Completed",        color: "var(--teal-700)",   soft: "var(--teal-50)" },
    cancelled_ktv:    { vi: "KTV huỷ",           en: "Therapist cancelled", color: "var(--crimson-600)", soft: "var(--crimson-100)" },
    cancelled_client: { vi: "Khách huỷ",         en: "Client cancelled",  color: "var(--gray-600)",   soft: "var(--gray-100)" },
    noshow_client:    { vi: "Khách vắng mặt",    en: "Client no-show",    color: "var(--gray-700)",   soft: "var(--gray-100)" },
  };
  function _seed(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function _pickW(rnd, arr) { const tot = arr.reduce((s, a) => s + a.w, 0); let r = rnd() * tot; for (const a of arr) { if ((r -= a.w) < 0) return a.k; } return arr[0].k; }
  const _HX_CACHE = {};
  function ktvHistory(id) {
    if (_HX_CACHE[id]) return _HX_CACHE[id];
    const k = ktvById(id); if (!k) return [];
    const rnd = _seed(id + "|hx");
    const n = Math.min(24, Math.max(8, Math.round(k.sessions / 14)));
    const svcMap = { deep: { vi: "Mô sâu", dur: 90, base: 520 }, swedish: { vi: "Thuỵ Điển", dur: 60, base: 420 }, thai: { vi: "Thái cổ truyền", dur: 90, base: 480 }, hot: { vi: "Đá nóng", dur: 75, base: 560 }, sports: { vi: "Thể thao", dur: 60, base: 500 }, foot: { vi: "Bấm chân", dur: 45, base: 300 } };
    const out = [];
    let dayCursor = 0;
    for (let i = 0; i < n; i++) {
      dayCursor += rnd() * 2.4;
      const svcKey = (k.svc[Math.floor(rnd() * k.svc.length)]) || _HX_SVC[Math.floor(rnd() * _HX_SVC.length)];
      const sv = svcMap[svcKey] || svcMap.swedish;
      const outcome = _pickW(rnd, _HX_OUT);
      const surge = rnd() < 0.22 ? +(1.1 + rnd() * 0.6).toFixed(1) : 1;
      const fare = outcome === "completed" ? Math.round(sv.base * surge / 10) * 10 : 0;
      const dh = Math.floor(rnd() * 14) + 7;
      out.push({
        id: "LB-" + (4200 + Math.floor(rnd() * 600)),
        daysAgo: Math.round(dayCursor),
        time: String(dh).padStart(2, "0") + ":" + String(Math.floor(rnd() * 6) * 10).padStart(2, "0"),
        svc: sv.vi, svcKey, dur: sv.dur, area: _HX_AREA[Math.floor(rnd() * _HX_AREA.length)],
        fare, surge, outcome,
        rating: outcome === "completed" ? (rnd() < 0.72 ? 5 : rnd() < 0.6 ? 4 : 3) : null,
      });
    }
    _HX_CACHE[id] = out;
    return out;
  }
  // Tổng hợp nhanh từ lịch sử
  function ktvHistoryStats(id) {
    const h = ktvHistory(id);
    const done = h.filter((j) => j.outcome === "completed");
    const earn = done.reduce((s, j) => s + j.fare, 0);
    const rated = done.filter((j) => j.rating);
    const avg = rated.length ? rated.reduce((s, j) => s + j.rating, 0) / rated.length : 0;
    return { total: h.length, done: done.length, cancelled: h.filter((j) => j.outcome.startsWith("cancelled")).length, noshow: h.filter((j) => j.outcome === "noshow_client").length, earn, avg };
  }

  // ============================================================
  //  KHÁCH HÀNG — hồ sơ, phân khúc, trust & lịch sử đặt
  // ============================================================
  const CUST_SEG = {
    vip:     { vi: "VIP / lull+",   en: "VIP / lull+",  icon: "crown",      color: "var(--amber-500)",   soft: "var(--amber-100)",   text: "var(--amber-600)" },
    loyal:   { vi: "Thân thiết",    en: "Loyal",        icon: "heart",      color: "var(--teal-700)",    soft: "var(--teal-50)",     text: "var(--teal-800)" },
    regular: { vi: "Thường xuyên",  en: "Regular",      icon: "user-round", color: "var(--gray-600)",    soft: "var(--gray-100)",    text: "var(--text-secondary)" },
    new:     { vi: "Mới",           en: "New",          icon: "sparkle",    color: "var(--teal-600)",    soft: "var(--teal-50)",     text: "var(--teal-800)" },
    at_risk: { vi: "Rủi ro",        en: "At-risk",      icon: "shield-alert", color: "var(--coral-500)", soft: "var(--coral-50)",    text: "var(--coral-700)" },
    blocked: { vi: "Đã chặn",       en: "Blocked",      icon: "ban",        color: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)" },
  };
  function custSegOf(c) {
    if (c.blocked) return "blocked";
    if (c.trust < 45 || c.complaints >= 3) return "at_risk";
    if (c.member) return "vip";
    if (c.bookings >= 30) return "loyal";
    if (c.bookings <= 3) return "new";
    return "regular";
  }

  const CUSTOMERS = [
    { id: "c1", name: "Phan Thảo Vy",     joined: "08/2024", member: true,  trust: 96, bookings: 84, area: "Quận 1",     pay: "Thẻ Visa ••4417", complaints: 0, fav: "k2", svc: ["thai","hot"],     phone: "0903••421" },
    { id: "c2", name: "Lâm Hoàng Phúc",   joined: "03/2024", member: true,  trust: 92, bookings: 61, area: "Quận 7",     pay: "MoMo ••88",       complaints: 1, fav: "k4", svc: ["swedish","foot"], phone: "0938••109" },
    { id: "c3", name: "Trương Mỹ Duyên",  joined: "11/2024", member: false, trust: 88, bookings: 37, area: "Bình Thạnh", pay: "Thẻ MB ••2093",   complaints: 0, fav: "k1", svc: ["deep"],          phone: "0912••763" },
    { id: "c4", name: "Đoàn Khánh Hưng",  joined: "01/2025", member: false, trust: 81, bookings: 22, area: "Phú Nhuận",  pay: "MoMo ••42",       complaints: 1, fav: "k6", svc: ["deep","hot"],     phone: "0977••318" },
    { id: "c5", name: "Bùi Thanh Trúc",   joined: "05/2025", member: false, trust: 74, bookings: 12, area: "Quận 3",     pay: "Thẻ VCB ••7741",  complaints: 0, fav: null, svc: ["foot"],          phone: "0901••552" },
    { id: "c6", name: "Vương Gia Bảo",    joined: "06/2026", member: false, trust: 68, bookings: 2,  area: "Quận 1",     pay: "MoMo ••07",       complaints: 0, fav: null, svc: ["swedish"],       phone: "0934••880" },
    { id: "c7", name: "Hồ Minh Khôi",     joined: "09/2025", member: false, trust: 38, bookings: 9,  area: "Bình Thạnh", pay: "Tiền mặt",        complaints: 4, fav: null, svc: ["deep"],          phone: "0967••204",
      riskNote: "4 khiếu nại trong 60 ngày · 2 lần báo KTV sai sự thật (đã đối chứng)" },
    { id: "c8", name: "Ngô Văn Phú",      joined: "10/2025", member: false, trust: 24, bookings: 6,  area: "Quận 7",     pay: "Tiền mặt",        complaints: 5, fav: null, svc: ["thai"],          phone: "0921••746",
      blocked: true, blockedAt: "07/06/2026", blockedReason: "Lạm dụng hoàn tiền · hành vi không phù hợp với KTV (2 báo cáo độc lập)" },
  ];
  const custById = (id) => CUSTOMERS.find((c) => c.id === id);

  const _CB_CACHE = {};
  function custHistory(id) {
    if (_CB_CACHE[id]) return _CB_CACHE[id];
    const c = custById(id); if (!c) return [];
    const rnd = _seed(id + "|cb");
    const n = Math.min(20, Math.max(4, Math.round(c.bookings / 6)));
    const svcMap = { deep: { vi: "Mô sâu", dur: 90, base: 520 }, swedish: { vi: "Thuỵ Điển", dur: 60, base: 420 }, thai: { vi: "Thái cổ truyền", dur: 90, base: 480 }, hot: { vi: "Đá nóng", dur: 75, base: 560 }, sports: { vi: "Thể thao", dur: 60, base: 500 }, foot: { vi: "Bấm chân", dur: 45, base: 300 } };
    const ktvPool = KTV.map((k) => k.id);
    const riskOut = c.trust < 45;
    const out = [];
    let dayCursor = 0;
    for (let i = 0; i < n; i++) {
      dayCursor += rnd() * 3.2;
      const svcKey = (c.svc[Math.floor(rnd() * c.svc.length)]) || "swedish";
      const sv = svcMap[svcKey] || svcMap.swedish;
      const ow = riskOut
        ? [{ k: "completed", w: 55 }, { k: "cancelled_client", w: 14 }, { k: "noshow_client", w: 13 }, { k: "refunded", w: 12 }, { k: "disputed", w: 6 }]
        : [{ k: "completed", w: 86 }, { k: "cancelled_client", w: 9 }, { k: "noshow_client", w: 3 }, { k: "refunded", w: 2 }];
      const outcome = _pickW(rnd, ow);
      const surge = rnd() < 0.2 ? +(1.1 + rnd() * 0.6).toFixed(1) : 1;
      const fare = (outcome === "completed" || outcome === "disputed") ? Math.round(sv.base * surge / 10) * 10 : 0;
      const fav = c.fav && rnd() < 0.5 ? c.fav : ktvPool[Math.floor(rnd() * ktvPool.length)];
      const dh = Math.floor(rnd() * 13) + 8;
      out.push({
        id: "LB-" + (4100 + Math.floor(rnd() * 700)),
        daysAgo: Math.round(dayCursor),
        time: String(dh).padStart(2, "0") + ":" + String(Math.floor(rnd() * 6) * 10).padStart(2, "0"),
        svc: sv.vi, svcKey, dur: sv.dur, ktvId: fav,
        fare, surge, outcome,
        rated: outcome === "completed" ? (rnd() < 0.78 ? (rnd() < 0.7 ? 5 : 4) : 3) : null,
      });
    }
    _CB_CACHE[id] = out;
    return out;
  }
  const CB_OUTCOME = {
    completed:        { vi: "Hoàn thành",     en: "Completed",   color: "var(--teal-700)",    soft: "var(--teal-50)" },
    cancelled_client: { vi: "Khách huỷ",      en: "Cancelled",   color: "var(--gray-600)",    soft: "var(--gray-100)" },
    noshow_client:    { vi: "Khách vắng mặt", en: "No-show",     color: "var(--gray-700)",    soft: "var(--gray-100)" },
    refunded:         { vi: "Đã hoàn tiền",   en: "Refunded",    color: "var(--amber-600)",   soft: "var(--amber-100)" },
    disputed:         { vi: "Khiếu nại",      en: "Disputed",    color: "var(--crimson-600)", soft: "var(--crimson-100)" },
  };
  function custHistoryStats(id) {
    const h = custHistory(id);
    const done = h.filter((j) => j.outcome === "completed");
    const spent = h.reduce((s, j) => s + j.fare, 0);
    const rated = done.filter((j) => j.rated);
    const avg = rated.length ? rated.reduce((s, j) => s + j.rated, 0) / rated.length : 0;
    return { total: h.length, done: done.length, cancelled: h.filter((j) => j.outcome === "cancelled_client").length, noshow: h.filter((j) => j.outcome === "noshow_client").length, refunded: h.filter((j) => j.outcome === "refunded").length, disputed: h.filter((j) => j.outcome === "disputed").length, spent, avg };
  }

  // ---- Scoring (PRD §4) -----------------------------------
  // score = 0.30·prox + 0.25·rating + 0.20·affinity + 0.15·tier + 0.10·reliability
  const W = { prox: 0.30, rating: 0.25, affinity: 0.20, tier: 0.15, reliability: 0.10 };
  const TIER_SCORE = { Bronze: 0.45, Silver: 0.66, Gold: 0.86, Elite: 1.0 };

  function dist(a, b) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }
  function etaFromDist(d) { return Math.max(8, Math.round(d * 0.9 + 6)); } // minutes

  // returns {total, parts:{prox,rating,affinity,tier,reliability}, eta, km}
  function scoreFor(ktv, booking) {
    const d = dist(ktv, booking);
    const eta = etaFromDist(d);
    const prox = Math.max(0, 1 - d / 70);                 // closer = higher
    const rating = (ktv.rating - 4.4) / 0.6;              // 4.4→0, 5.0→1
    const affinity = (booking.affinity || []).includes(ktv.id) ? 0.95 : 0.18;
    const tier = TIER_SCORE[ktv.tier];
    const reliability = (ktv.accept - 0.7) / 0.3;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const parts = {
      prox: clamp(prox), rating: clamp(rating), affinity: clamp(affinity),
      tier: clamp(tier), reliability: clamp(reliability),
    };
    const total = W.prox * parts.prox + W.rating * parts.rating + W.affinity * parts.affinity
      + W.tier * parts.tier + W.reliability * parts.reliability;
    return { total, parts, eta, km: +(d * 0.12).toFixed(1) };
  }

  // build a ranked candidate list for a booking (hard-constraint: matching service + online)
  function candidatesFor(booking) {
    return KTV
      .filter((k) => k.status !== "offline" && k.svc.includes(booking.serviceKey))
      .map((k) => ({ ktv: k, ...scoreFor(k, booking) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }

  // ---- Bookings -------------------------------------------
  // matching bookings carry an offer index + ttl (seconds) + per-candidate response
  const now = Date.now();
  const mins = (m) => new Date(now - m * 60000);

  const BOOKINGS = [
    { id: "LB-4821", cust: "Trần Thị Hương",   trust: 88, serviceKey: "deep",    dur: 90, state: "MATCHING",
      region: "Quận 1",     x: 41, y: 26, addr: "Lý Tự Trọng, P. Bến Nghé",  base: 380, surge: 1.0, createdAt: mins(2),
      affinity: ["k1"], offerIdx: 0, ttl: 13, responses: {}, note: "Toà B2, gọi trước khi lên" },
    { id: "LB-4822", cust: "Lê Văn Khôi",      trust: 71, serviceKey: "thai",    dur: 60, state: "MATCHING",
      region: "Quận 3",     x: 55, y: 30, addr: "Võ Văn Tần, P.6",          base: 300, surge: 1.3, createdAt: mins(1),
      affinity: [], offerIdx: 0, ttl: 8, responses: { k8: "declined" }, note: "Có nuôi chó nhỏ" },
    { id: "LB-4815", cust: "Phạm Quỳnh Anh",   trust: 95, serviceKey: "swedish", dur: 120, state: "EN_ROUTE",
      region: "Phú Nhuận",  x: 70, y: 48, addr: "Phan Xích Long, P.2",      base: 520, surge: 1.0, createdAt: mins(18),
      affinity: ["k4"], assigned: "k4", etaLeft: 9 },
    { id: "LB-4810", cust: "Nguyễn Đức Long",  trust: 64, serviceKey: "sports",  dur: 60, state: "IN_PROGRESS",
      region: "Bình Thạnh", x: 44, y: 74, addr: "Điện Biên Phủ, P.25",      base: 340, surge: 1.0, createdAt: mins(42),
      affinity: [], assigned: "k7", sessionLeft: 28 },
  ];

  // a few more steady-state rows
  BOOKINGS.push(
    { id: "LB-4808", cust: "Hoàng Bảo Trâm",  trust: 82, serviceKey: "hot",     dur: 90, state: "ACCEPTED",
      region: "Quận 1",     x: 36, y: 34, addr: "Hai Bà Trưng, P. Đa Kao",  base: 450, surge: 1.0, createdAt: mins(6),
      affinity: [], assigned: "k2", etaLeft: 22 },
    { id: "LB-4802", cust: "Đinh Thế Vinh",   trust: 58, serviceKey: "deep",    dur: 60, state: "DISPUTED",
      region: "Quận 7",     x: 78, y: 70, addr: "Nguyễn Thị Thập, P. Tân Phú", base: 360, surge: 1.0, createdAt: mins(95),
      affinity: [], assigned: "k6", disputeReason: "Khách báo KTV đến trễ 20'",
      exception: { type: "DISPUTE", since: mins(40), detail: "Khách báo KTV đến trễ 20' — yêu cầu hoàn 50%. Payout đang giữ." } },
    { id: "LB-4799", cust: "Vương Khánh Chi",  trust: 90, serviceKey: "foot",    dur: 60, state: "COMPLETED",
      region: "Quận 3",     x: 60, y: 40, addr: "Cao Thắng, P.5",            base: 240, surge: 1.0, createdAt: mins(140),
      affinity: ["k4"], assigned: "k4" },
    { id: "LB-4795", cust: "Tạ Minh Quân",    trust: 35, serviceKey: "thai",    dur: 90, state: "CANCELLED",
      region: "Bình Thạnh", x: 50, y: 64, addr: "Xô Viết Nghệ Tĩnh, P.21",  base: 410, surge: 1.0, createdAt: mins(160),
      affinity: [], cancelReason: "Khách hủy sát giờ — phí 30%" },
  );

  // ---- Edge-case bookings (exceptions in flight) ----------
  BOOKINGS.push(
    // No KTV does this service nearby → empty candidate pool
    { id: "LB-4830", cust: "Lương Hải Đăng",  trust: 76, serviceKey: "sports",  dur: 90, state: "MATCHING",
      region: "Quận 7",     x: 86, y: 74, addr: "Phú Mỹ Hưng, P. Tân Phong", base: 460, surge: 1.0, createdAt: mins(4),
      affinity: [], offerIdx: 0, ttl: 15, responses: {},
      exception: { type: "NO_SUPPLY", since: mins(4), detail: "Không có KTV ‘Thể thao’ online trong 5km — KTV gần nhất 8.2km/26’." } },
    // Matching far too long
    { id: "LB-4831", cust: "Cao Thanh Trúc",  trust: 81, serviceKey: "deep",    dur: 60, state: "MATCHING",
      region: "Bình Thạnh", x: 47, y: 60, addr: "D2, P.25",                 base: 360, surge: 1.2, createdAt: mins(9),
      affinity: [], offerIdx: 2, ttl: 6, responses: { k3: "declined", k6: "declined" },
      exception: { type: "SLA_BREACH", since: mins(9), detail: "Đã 9’ chưa ghép được — vượt SLA 4’. Khách đã nhận 1 thông báo xin lỗi tự động." } },
    // KTV accepted then cancelled → needs urgent rematch
    { id: "LB-4833", cust: "Phùng Gia Bảo",   trust: 87, serviceKey: "swedish", dur: 90, state: "MATCHING",
      region: "Phú Nhuận",  x: 66, y: 50, addr: "Hoa Phượng, P.2",          base: 480, surge: 1.0, createdAt: mins(11),
      affinity: [], offerIdx: 0, ttl: 15, responses: {},
      exception: { type: "KTV_CANCELLED", since: mins(1), detail: "KTV Phạm Mỹ Linh hủy do hỏng xe sau khi đã nhận 6’ trước — cần ghép lại gấp." } },
    // En route but GPS lost
    { id: "LB-4834", cust: "Đặng Thuỳ Dương", trust: 79, serviceKey: "hot",     dur: 60, state: "EN_ROUTE",
      region: "Quận 3",     x: 58, y: 38, addr: "Bà Huyện Thanh Quan, P.7", base: 450, surge: 1.0, createdAt: mins(20),
      affinity: [], assigned: "k2", etaLeft: 7,
      exception: { type: "KTV_NOSHOW", since: mins(2), detail: "Mất tín hiệu GPS KTV Trần Minh Anh 2’ — vị trí đứng yên, chưa tới nơi." } },
    // Arrived but client not answering
    { id: "LB-4835", cust: "Hồ Tuấn Kiệt",    trust: 52, serviceKey: "foot",    dur: 60, state: "ARRIVED",
      region: "Quận 1",     x: 39, y: 30, addr: "Nguyễn Du, P. Bến Nghé",   base: 240, surge: 1.0, createdAt: mins(28),
      affinity: [], assigned: "k5", arrivedHold: 99,
      exception: { type: "CLIENT_NOSHOW", since: mins(6), detail: "KTV đã tới 6’, gọi 2 lần khách không bắt máy. Đang chờ chính sách no-show." } },
    // Payment hold failed at creation
    { id: "LB-4836", cust: "Vũ Khánh Hoà",    trust: 69, serviceKey: "swedish", dur: 120, state: "CREATED",
      region: "Quận 1",     x: 43, y: 38, addr: "Tôn Đức Thắng, P. Bến Nghé", base: 520, surge: 1.0, createdAt: mins(1),
      affinity: [], offerIdx: 0, ttl: 15, responses: {},
      exception: { type: "PAYMENT_FAILED", since: mins(1), detail: "Giữ tiền thẻ •••• 4417 bị từ chối (thiếu số dư). Chưa thể vào hàng ghép." } },
    // High-risk / low-trust customer
    { id: "LB-4837", cust: "Ngô Văn Phú",     trust: 24, serviceKey: "thai",    dur: 60, state: "CREATED",
      region: "Bình Thạnh", x: 52, y: 70, addr: "Ung Văn Khiêm, P.25",      base: 300, surge: 1.0, createdAt: mins(3),
      affinity: [], offerIdx: 0, ttl: 15, responses: {},
      exception: { type: "LOW_TRUST", since: mins(3), detail: "Trust 24/100 · 3 lần hủy sát giờ + 1 khiếu nại KTV tháng trước. Gắn cờ xác minh." } },
  );

  // attach computed candidate lists to matching bookings
  BOOKINGS.forEach((b) => { if (b.state === "MATCHING") b.candidates = candidatesFor(b); });
  // NO_SUPPLY: genuinely no KTV in range
  BOOKINGS.forEach((b) => { if (b.exception && b.exception.type === "NO_SUPPLY") b.candidates = []; });

  function priceOf(b) {
    const total = Math.round(b.base * b.surge);
    return { base: b.base, surge: b.surge, surgeAmt: total - b.base, total };
  }

  // ---- AI Copilot: recommendation + risk classification ----
  // risk.auto = true means AI may execute it itself in Auto-pilot.
  const RISK = {
    low:    { vi: "Rủi ro thấp", color: "var(--mint-500)",    soft: "var(--mint-100)",    text: "var(--mint-600)",    auto: true },
    medium: { vi: "Rủi ro vừa", color: "var(--amber-500)",   soft: "var(--amber-100)",   text: "var(--amber-600)",   auto: false },
    high:   { vi: "Rủi ro cao", color: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)", auto: false },
  };

  // base policy per edge case: what AI would do + how risky to automate
  const AI_POLICY = {
    NO_SUPPLY:      { action: "Mở rộng bán kính",        risk: "low",    base: 0.92, why: (b) => "Mở bán kính +2km là thao tác đảo ngược được; còn KTV ở vành đai 6–8km có thể nhận." },
    ALL_DECLINED:   { action: "Tăng thưởng nhận đơn",      risk: "medium", base: 0.74, why: (b) => "Thưởng +15k thường kéo KTV nhận trong 2′, nhưng phát sinh chi phí → cần duyệt." },
    SLA_BREACH:     { action: "Ưu tiên ghép gấp",         risk: "medium", base: 0.80, why: (b) => "Đẩy đơn lên đầu hàng đợi vùng; voucher xin lỗi tách riêng cần duyệt vì liên quan chi phí." },
    KTV_CANCELLED:  { action: "Ghép lại ưu tiên",         risk: "low",    base: 0.90, why: (b) => "Tự ghép lại với KTV điểm cao kế tiếp; khách chỉ chờ thêm, không phát sinh phí." },
    KTV_NOSHOW:     { action: "Ghép KTV thay thế",         risk: "high",   base: 0.55, why: (b) => "Liên quan an toàn KTV — cần người trực xác nhận trước khi hành động." },
    CLIENT_NOSHOW:  { action: "Gọi khách",               risk: "low",    base: 0.86, why: (b) => "Gọi tự động nhắc khách; chỉ tính phí no-show sau khi xác minh, không hủy vội." },
    PAYMENT_FAILED: { action: "Thử lại thanh toán",       risk: "low",    base: 0.88, why: (b) => "Thử lại cổng thanh toán 1 lần; nếu vẫn lỗi sẽ đề nghị đổi phương thức." },
    ADDRESS_OOZ:    { action: "Xác minh địa chỉ",          risk: "low",    base: 0.82, why: (b) => "Gửi yêu cầu xác minh toạ độ cho khách; không hủy đơn, an toàn." },
    LOW_TRUST:      { action: "Yêu cầu trả trước 100%",     risk: "high",   base: 0.60, why: (b) => "Ảnh hưởng trải nghiệm khách — chính sách chặn/trả trước cần người duyệt." },
    SURGE_CAP:      { action: "Điều KTV vùng lân cận",      risk: "low",    base: 0.85, why: (b) => "Điều KTV rảnh từ vùng kề để cân bằng cung–cầu; ít rủi ro, không đổi giá khách." },
    DISPUTE:        { action: "Mở ticket T&S",            risk: "high",   base: 0.50, why: (b) => "Tranh chấp hoàn tiền — bắt buộc người xử lý, AI chỉ chuẩn bị hồ sơ." },
  };

  // returns { action, risk, confidence, why, auto } or null
  function aiRecommend(b) {
    if (!b || !b.exception) return null;
    const pol = AI_POLICY[b.exception.type];
    if (!pol) return null;
    let action = pol.action, risk = pol.risk, conf = pol.base, why = pol.why(b);
    const cands = b.candidates || candidatesFor(b);
    // context tuning
    if (b.exception.type === "KTV_CANCELLED" || b.exception.type === "NO_SUPPLY") {
      if (cands.length >= 2) conf = Math.min(0.97, conf + 0.05);
      else if (cands.length === 0) { conf -= 0.18; why = "Chưa thấy KTV thay thế trong vùng — đề xuất mở rộng nhưng độ tin thấp hơn."; }
    }
    if (b.exception.type === "LOW_TRUST" && b.trust <= 25) {
      action = "Chặn & hủy"; conf = 0.78; why = "Trust " + b.trust + "/100 dưới ngưỡng an toàn + lịch sử xấu → đề xuất chặn, nhưng vẫn cần người duyệt.";
    }
    if (b.exception.type === "PAYMENT_FAILED" && b.trust < 50) { conf -= 0.1; }
    // SLA pressure raises urgency/confidence a touch on the priority action
    const m = EXCEPTIONS[b.exception.type];
    const over = m.sla > 0 && (Date.now() - b.exception.since.getTime()) / 60000 >= m.sla;
    if (over && risk !== "high") conf = Math.min(0.97, conf + 0.03);
    conf = Math.max(0.35, Math.min(0.98, conf));
    const auto = RISK[risk].auto;
    return { action, risk, confidence: conf, why, auto };
  }

  // shared resolution transform (used by manual Ops + AI Auto-pilot)
  function applyResolution(b, label) {
    const nb = { ...b }; delete nb.exception; delete nb.aiCountdown;
    const L = (label || "").toLowerCase();
    if (L.includes("hủy") || L.includes("chặn")) {
      nb.state = "CANCELLED"; nb.cancelReason = "Xử lý ngoại lệ — " + label;
    } else if (L.includes("ghép lại") || L.includes("ưu tiên ghép") || L.includes("gán ops") || L.includes("thay thế") || L.includes("mở rộng") || L.includes("đánh thức") || L.includes("tăng thưởng") || L.includes("điều ktv") || L.includes("hàng đợi") || L.includes("thử lại thanh toán") || L.includes("đổi phương thức") || L.includes("trả trước") || L.includes("xác minh")) {
      nb.state = "MATCHING"; nb.offerIdx = 0; nb.ttl = 15; nb.responses = {}; delete nb.assigned;
      nb.candidates = candidatesFor(nb);
    } else if (L.includes("no-show") || L.includes("phạt")) {
      nb.state = "CANCELLED"; nb.cancelReason = "Xử lý — " + label;
    }
    return nb;
  }

  // ============================================================
  //  Phân xử tranh chấp — hard he-said/she-said cases
  // ============================================================
  // Mỗi ca: lời khai 2 bên mâu thuẫn, lịch sử lặp lại của CẢ HAI,
  // bằng chứng từng mảnh (đứng về bên nào / trung lập), và độ khó.
  const DISPUTE_CAT = {
    SERVICE_QUALITY: { vi: "Chất lượng dịch vụ", icon: "thumbs-down" },
    NO_SHOW:         { vi: "Vắng mặt / sai giờ",  icon: "user-x" },
    PAYMENT:         { vi: "Tiền & phụ phí",       icon: "wallet" },
    CONDUCT:         { vi: "Ứng xử / quấy rối",    icon: "shield-alert" },
    PROPERTY:        { vi: "Hư hỏng / mất đồ",      icon: "package-x" },
    SAFETY:          { vi: "An toàn KTV",          icon: "siren" },
  };

  // evidence side: "client" | "ktv" | "neutral"
  const D = (n) => new Date(now - n * 60000);
  const DISPUTES = [
    {
      id: "DS-2041", cat: "CONDUCT", bookingId: "LB-4712", svc: "deep", region: "Quận 1",
      amount: 380, openedAt: D(55), difficulty: 92, status: "open",
      client: { id: "c1", name: "Phan Thị Bích", trust: 41,
        complaints: 6, complaintsWindow: "90 ngày", refundsWon: 4, claim: "KTV có lời lẽ khiếm nhã, đòi tip thêm 200k mới làm tiếp. Tôi yêu cầu hoàn 100%." },
      ktv: { id: "k3", name: "Lê Quốc Bảo", tier: "Silver", rating: 4.7,
        accusations: 5, accWindow: "90 ngày", claim: "Khách liên tục gạ chuyện riêng tư, tôi từ chối thì khách doạ đánh giá 1 sao. Tôi không hề đòi tip." },
      evidence: [
        { side: "neutral", icon: "mic", t: "Ghi âm trong app 8'12 — có tiếng to tiếng nhưng không rõ ai đòi tip" },
        { side: "ktv", icon: "message-square", t: "Chat trước buổi: khách nhắn 2 tin bị gắn cờ quấy rối" },
        { side: "client", icon: "star", t: "Khách gửi ảnh chụp tin nhắn KTV (chưa xác thực nguồn)" },
        { side: "neutral", icon: "map-pin", t: "KTV rời sớm 22' so với lịch — khớp lời cả hai" },
      ],
      conflict: "Cả hai đều có lịch sử lặp lại: khách 6 lần phàn nàn/đòi hoàn, KTV 5 lần bị (hoặc tự) tố. Bằng chứng âm thanh không phân định được bên nào khởi xướng.",
    },
    {
      id: "DS-2038", cat: "SERVICE_QUALITY", bookingId: "LB-4690", svc: "swedish", region: "Phú Nhuận",
      amount: 520, openedAt: D(140), difficulty: 78, status: "open",
      client: { id: "c2", name: "Đỗ Gia Hân", trust: 38,
        complaints: 9, complaintsWindow: "60 ngày", refundsWon: 7, claim: "KTV làm qua loa 40' rồi bảo xong, trong khi tôi đặt 120'. Đòi hoàn 2/3." },
      ktv: { id: "k4", name: "Phạm Mỹ Linh", tier: "Gold", rating: 4.85,
        accusations: 2, accWindow: "60 ngày", claim: "Tôi làm đủ 118' (app ghi nhận). Khách ngủ giữa buổi rồi dậy nói chưa làm gì. Đây là chiêu quen của khách này." },
      evidence: [
        { side: "ktv", icon: "timer", t: "App log: buổi kéo dài 118' liên tục, không gián đoạn" },
        { side: "ktv", icon: "history", t: "Khách có 7/9 lần đòi hoàn đều thắng — pattern đáng ngờ" },
        { side: "client", icon: "star", t: "Khách đánh giá 1★ kèm mô tả chi tiết các động tác thiếu" },
        { side: "neutral", icon: "activity", t: "Cảm biến chuyển động đệm: hoạt động rải rác, không liên tục" },
      ],
      conflict: "Khách là người đòi hoàn 'chuyên nghiệp' (thắng 7/9 ca) nhưng KTV uy tín cao. Log thời lượng ủng hộ KTV, cảm biến chuyển động lại mơ hồ.",
    },
    {
      id: "DS-2035", cat: "PAYMENT", bookingId: "LB-4671", svc: "hot", region: "Quận 3",
      amount: 450, openedAt: D(220), difficulty: 64, status: "open",
      client: { id: "c3", name: "Vũ Đình Khang", trust: 55,
        complaints: 3, complaintsWindow: "30 ngày", refundsWon: 1, claim: "KTV đòi phụ phí 'đá nóng cao cấp' 150k tiền mặt không có trong app. Tôi không trả thì bị doạ." },
      ktv: { id: "k6", name: "Vũ Thị Mai", tier: "Silver", rating: 4.75,
        accusations: 4, accWindow: "30 ngày", claim: "Khách tự yêu cầu nâng cấp gói giữa buổi, tôi báo phụ phí rõ ràng. Xong rồi khách quỵt rồi tố ngược." },
      evidence: [
        { side: "neutral", icon: "receipt", t: "Không có giao dịch phụ phí nào trong app cho đơn này" },
        { side: "ktv", icon: "message-square", t: "Chat: khách hỏi 'có gói nóng xịn hơn không' lúc 19:42" },
        { side: "client", icon: "phone", t: "Khách gọi hotline ngay sau buổi, giọng bức xúc (ghi âm)" },
        { side: "ktv", icon: "history", t: "Khách từng 2 lần bị KTV khác tố quỵt phụ phí" },
      ],
      conflict: "Phụ phí tiền mặt ngoài app là vùng xám — vi phạm chính sách dù ai đúng. Cần xử lý cả hành vi off-app lẫn tranh chấp tiền.",
    },
    {
      id: "DS-2031", cat: "PROPERTY", bookingId: "LB-4655", svc: "thai", region: "Bình Thạnh",
      amount: 300, openedAt: D(300), difficulty: 71, status: "open",
      client: { id: "c4", name: "Trịnh Mỹ Duyên", trust: 62,
        complaints: 4, complaintsWindow: "120 ngày", refundsWon: 2, claim: "Sau buổi tôi phát hiện mất một lắc tay vàng. Chỉ có KTV ở trong phòng." },
      ktv: { id: "k7", name: "Bùi Anh Tuấn", tier: "Gold", rating: 4.88,
        accusations: 1, accWindow: "120 ngày", claim: "Tôi không hề đụng vào đồ khách. Đây là vu khống để được bồi thường, khách từng làm với tiệm khác." },
      evidence: [
        { side: "neutral", icon: "camera-off", t: "Không có camera trong phòng — không thể xác nhận trực tiếp" },
        { side: "client", icon: "door-open", t: "Log cửa: chỉ KTV ra vào trong khung giờ khách nêu" },
        { side: "ktv", icon: "shield-check", t: "KTV 503 buổi, chỉ 1 lần bị tố — hồ sơ rất sạch" },
        { side: "ktv", icon: "history", t: "Khách từng kiện 1 spa khác về 'mất đồ' (nguồn ngoài, chưa kiểm chứng)" },
      ],
      conflict: "Cáo buộc trộm cắp nghiêm trọng nhưng không bằng chứng trực tiếp. KTV hồ sơ sạch vs khách có tiền sử nghi vấn — rủi ro oan sai cả hai chiều.",
    },
    {
      id: "DS-2028", cat: "SAFETY", bookingId: "LB-4640", svc: "deep", region: "Quận 7",
      amount: 360, openedAt: D(420), difficulty: 88, status: "open",
      client: { id: "c5", name: "Hoàng Anh Quân", trust: 47,
        complaints: 5, complaintsWindow: "90 ngày", refundsWon: 3, claim: "KTV tự ý bỏ về giữa chừng, để tôi nằm đó. Đòi hoàn tiền và phạt KTV." },
      ktv: { id: "k1", name: "Nguyễn Thu Hà", tier: "Gold", rating: 4.9,
        accusations: 3, accWindow: "90 ngày", claim: "Khách có hành vi đụng chạm không phù hợp, tôi kích hoạt SOS rời đi theo đúng quy trình an toàn.", sosTriggered: true },
      evidence: [
        { side: "ktv", icon: "siren", t: "SOS được kích hoạt lúc 20:18 — đúng quy trình, có log" },
        { side: "neutral", icon: "mic", t: "Ghi âm 30s trước SOS: có tiếng phản đối của KTV" },
        { side: "client", icon: "clock", t: "Buổi mới 25/60' — khách mất phần lớn dịch vụ" },
        { side: "ktv", icon: "history", t: "Khách 2 lần trước bị KTV nữ phản ánh tương tự" },
      ],
      conflict: "Chính sách: SOS của KTV được ưu tiên tuyệt đối & miễn phạt. Nhưng khách đòi hoàn và có lịch sử phàn nàn — phải cân giữa bảo vệ KTV và tránh lạm dụng SOS.",
      safetyLock: true,
    },
    {
      id: "DS-2024", cat: "NO_SHOW", bookingId: "LB-4622", svc: "foot", region: "Quận 1",
      amount: 240, openedAt: D(560), difficulty: 45, status: "open",
      client: { id: "c6", name: "Mai Tuấn Kiệt", trust: 58,
        complaints: 2, complaintsWindow: "30 ngày", refundsWon: 1, claim: "KTV không bao giờ đến, tôi chờ 40' rồi bị tính phí no-show của KHÁCH. Vô lý." },
      ktv: { id: "k8", name: "Hồ Ngọc Diệp", tier: "Bronze", rating: 4.55,
        accusations: 1, accWindow: "30 ngày", claim: "Tôi đến đúng địa chỉ nhưng khách không mở cửa, gọi không nghe. Tôi chờ 15' rồi báo no-show khách." },
      evidence: [
        { side: "neutral", icon: "map-pin", t: "GPS KTV: có tới trong bán kính 40m của địa chỉ" },
        { side: "client", icon: "phone-missed", t: "2 cuộc gọi nhỡ từ KTV — nhưng cách giờ hẹn 18'" },
        { side: "ktv", icon: "navigation", t: "KTV dừng tại điểm 16' rồi rời đi — khớp lời khai" },
        { side: "client", icon: "door-closed", t: "Khách nói địa chỉ có 2 cổng, KTV có thể đứng nhầm cổng" },
      ],
      conflict: "Cả hai có thể cùng đúng: KTV tới nhầm cổng toà nhà 2 lối. Ai chịu phí no-show? Lỗi địa chỉ mơ hồ chứ không hẳn lỗi người.",
    },
    {
      id: "DS-2019", cat: "SERVICE_QUALITY", bookingId: "LB-4601", svc: "sports", region: "Bình Thạnh",
      amount: 340, openedAt: D(800), difficulty: 83, status: "open",
      client: { id: "c7", name: "Lý Hồng Phúc", trust: 33,
        complaints: 11, complaintsWindow: "60 ngày", refundsWon: 9, claim: "KTV ấn quá mạnh làm tôi bầm tím, đau cả tuần. Yêu cầu hoàn tiền + bồi thường y tế." },
      ktv: { id: "k7", name: "Bùi Anh Tuấn", tier: "Gold", rating: 4.88,
        accusations: 3, accWindow: "60 ngày", claim: "Khách yêu cầu ấn mạnh tối đa, tôi đã cảnh báo. Massage thể thao có thể để lại vết. Khách này tháng nào cũng đòi hoàn.", repeatVictim: true },
      evidence: [
        { side: "client", icon: "image", t: "Ảnh vết bầm khách gửi (không có mốc thời gian xác thực)" },
        { side: "ktv", icon: "message-square", t: "Chat: khách yêu cầu 'mạnh nhất có thể, đừng ngại'" },
        { side: "ktv", icon: "history", t: "Khách thắng 9/11 ca hoàn tiền — pattern lạm dụng rõ rệt" },
        { side: "neutral", icon: "file-text", t: "Massage thể thao: vết bầm nhẹ là rủi ro y khoa đã biết" },
      ],
      conflict: "Khách lạm dụng hoàn tiền ở mức cực đoan (9/11) nhưng lần này có ảnh thương tích. Không thể bỏ qua rủi ro sức khoẻ thật chỉ vì lịch sử xấu.",
    },
  ];

  function disputeDifficulty(d) {
    if (d.difficulty >= 85) return { vi: "Rất khó", color: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)" };
    if (d.difficulty >= 65) return { vi: "Khó", color: "var(--amber-500)", soft: "var(--amber-100)", text: "var(--amber-600)" };
    return { vi: "Trung bình", color: "var(--teal-500)", soft: "var(--teal-100)", text: "var(--teal-800)" };
  }

  // AI advisory for a dispute — NON-BINDING, always needs a human ruling.
  function disputeAdvisory(d) {
    let lean = 0; // -1 = client favored, +1 = ktv favored
    const factors = [];
    d.evidence.forEach((e) => { if (e.side === "ktv") { lean += 0.18; } else if (e.side === "client") { lean -= 0.16; } });
    if (d.client.refundsWon / Math.max(1, d.client.complaints) > 0.7) { lean += 0.22; factors.push({ icon: "alert-triangle", t: `Khách thắng ${d.client.refundsWon}/${d.client.complaints} ca hoàn — dấu hiệu lạm dụng` }); }
    if (d.ktv.accusations >= 4) { lean -= 0.18; factors.push({ icon: "alert-triangle", t: `KTV bị tố ${d.ktv.accusations} lần gần đây — cần lưu ý` }); }
    if (d.ktv.rating >= 4.85 && d.ktv.accusations <= 1) { lean += 0.14; factors.push({ icon: "shield-check", t: "Hồ sơ KTV rất sạch, uy tín cao" }); }
    if (d.client.trust < 45) { lean += 0.1; factors.push({ icon: "shield-x", t: `Trust khách thấp (${d.client.trust}/100)` }); }
    if (d.safetyLock || (d.ktv && d.ktv.sosTriggered)) { factors.push({ icon: "siren", t: "Liên quan SOS/an toàn — chính sách bảo vệ KTV ưu tiên" }); lean += 0.25; }
    if (d.cat === "PROPERTY" || d.cat === "CONDUCT") { factors.push({ icon: "scale", t: "Cáo buộc nghiêm trọng — khuyến nghị con người phân xử kỹ" }); }
    const conf = Math.min(0.72, 0.4 + Math.abs(lean) * 0.5); // capped: never fully confident
    const leanLabel = lean > 0.15 ? "Nghiêng về KTV" : lean < -0.15 ? "Nghiêng về khách" : "Chưa ngả về bên nào";
    const leanSide = lean > 0.15 ? "ktv" : lean < -0.15 ? "client" : "neutral";
    let suggest;
    if (d.safetyLock) suggest = "Giữ payout cho KTV, miễn phạt; hoàn 50% thiện chí cho khách";
    else if (leanSide === "ktv") suggest = "Bác yêu cầu hoàn; nhắc nhở khách; ghi nhận pattern";
    else if (leanSide === "client") suggest = "Hoàn 100% cho khách; cảnh cáo KTV";
    else suggest = "Hoàn 50/50, theo dõi cả hai bên ở đơn kế tiếp";
    return { lean, leanLabel, leanSide, conf, factors, suggest };
  }

  const RULINGS = [
    { key: "refund_full", vi: "Hoàn 100% khách", icon: "rotate-ccw", tone: "client" },
    { key: "refund_half", vi: "Hoàn 50/50", icon: "split", tone: "neutral" },
    { key: "deny", vi: "Bác yêu cầu hoàn", icon: "circle-x", tone: "ktv" },
    { key: "warn_client", vi: "Cảnh cáo khách", icon: "user-x", tone: "client" },
    { key: "warn_ktv", vi: "Cảnh cáo KTV", icon: "user-minus", tone: "ktv" },
    { key: "escalate", vi: "Chuyển điều tra T&S", icon: "gavel", tone: "neutral" },
  ];

  // ============================================================
  //  Tái phân bổ KTV — đề xuất di chuyển tới vùng cầu cao
  // ============================================================
  // Mỗi zone: tâm trên bản đồ + cầu (demand 0..1) + surge + số đơn đang chờ.
  const ZONES = {
    "Quận 1":     { x: 40, y: 30, demand: 0.80, surge: 1.0, waiting: 5 },
    "Quận 3":     { x: 57, y: 33, demand: 0.93, surge: 1.3, waiting: 7 }, // nóng nhất
    "Bình Thạnh": { x: 48, y: 68, demand: 0.26, surge: 1.0, waiting: 1 },
    "Phú Nhuận":  { x: 68, y: 50, demand: 0.55, surge: 1.1, waiting: 3 },
    "Quận 7":     { x: 82, y: 72, demand: 0.18, surge: 1.0, waiting: 0 },
  };
  const AVG_FARE = 360; // k, dùng để ước tính thu nhập
  // Mỗi KTV online (không bận) mang theo idleMin = số phút chưa có đơn.
  const IDLE_MIN = { k1: 12, k2: 9, k3: 47, k5: 64, k6: 38, k8: 53 };
  function nearestZone(p) {
    let best = null, bd = 1e9;
    for (const [name, z] of Object.entries(ZONES)) {
      const d = Math.sqrt((p.x - z.x) ** 2 + (p.y - z.y) ** 2);
      if (d < bd) { bd = d; best = name; }
    }
    return best;
  }
  KTV.forEach((k) => { k.zone = nearestZone(k); if (k.status === "online") k.idleMin = IDLE_MIN[k.id] ?? 5; });

  // expected wait (phút) cho 1 KTV ở zone theo cầu: cầu cao → chờ ngắn
  const expectedWait = (demand) => Math.round(70 - 60 * demand); // d=0→70', d=1→10'
  const jobsPerHour = (z) => z.demand * 1.5;                      // ước đơn/giờ
  const hourlyEarn = (z) => Math.round(jobsPerHour(z) * AVG_FARE * z.surge); // k/giờ
  const travelMin = (a, b) => Math.max(5, Math.round(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) * 0.85 + 5));

  // === Ngưỡng thích ứng: "sau bao lâu thì hiện đề xuất?" ===
  // Hai yếu tố:
  //  1) Bất thường: chờ > 1.5× kỳ vọng của CHÍNH zone đó.
  //  2) Cơ hội: nếu có zone tốt hơn rõ rệt → hạ ngưỡng để nudge sớm.
  // Ngưỡng hiển thị = min(hai cái), kẹp trong [15, 50] phút.
  function repoThreshold(ktv) {
    const here = ZONES[ktv.zone];
    const ew = expectedWait(here.demand);
    const anomaly = Math.round(1.5 * ew);
    // tìm gap cầu lớn nhất tới zone khác có thể tới
    let bestGap = 0;
    for (const [name, z] of Object.entries(ZONES)) {
      if (name === ktv.zone) continue;
      const gap = (z.demand * z.surge) - (here.demand * here.surge);
      if (gap > bestGap) bestGap = gap;
    }
    const opportunity = Math.round(36 - 26 * Math.max(0, bestGap)); // gap lớn → sớm tới ~16'
    const raw = bestGap > 0.1 ? Math.min(anomaly, opportunity) : anomaly;
    return { value: Math.max(15, Math.min(50, raw)), anomaly, opportunity: Math.max(15, Math.min(50, opportunity)), ew, bestGap };
  }

  // gợi ý zone đích tốt nhất (net uplift sau trừ phí di chuyển)
  function repoSuggestion(ktv) {
    const here = ZONES[ktv.zone];
    let best = null;
    for (const [name, z] of Object.entries(ZONES)) {
      if (name === ktv.zone) continue;
      const tMin = travelMin(ktv, z);
      const grossUplift = hourlyEarn(z) - hourlyEarn(here);          // k/giờ
      const travelCost = Math.round((tMin / 60) * hourlyEarn(z));    // cơ hội mất khi di chuyển
      const net = grossUplift - travelCost;
      const waitCut = expectedWait(here.demand) - expectedWait(z.demand);
      if (!best || net > best.net) best = { zone: name, z, tMin, grossUplift, travelCost, net, waitCut };
    }
    return best;
  }

  // danh sách KTV nên được đề xuất di chuyển (đã vượt ngưỡng + có net dương)
  function repoCandidates() {
    return KTV.filter((k) => k.status === "online")
      .map((k) => {
        const thr = repoThreshold(k);
        const sug = repoSuggestion(k);
        return { ktv: k, thr, sug, over: k.idleMin - thr.value, eligible: k.idleMin >= thr.value && sug && sug.net > 0 };
      })
      .sort((a, b) => (b.eligible - a.eligible) || (b.over - a.over));
  }

  // ============================================================
  //  Phản hồi & Góp ý — tổng hợp tiếng nói khách + KTV, AI tự phân loại
  // ============================================================
  const FB_CAT = {
    bug:      { vi: "Lỗi ứng dụng",       icon: "bug",            color: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)" },
    booking:  { vi: "Trải nghiệm đặt lịch", icon: "calendar-clock", color: "var(--teal-600)",    soft: "var(--teal-50)",     text: "var(--teal-800)" },
    payment:  { vi: "Thanh toán & ví",     icon: "wallet",         color: "var(--amber-500)",   soft: "var(--amber-100)",   text: "var(--amber-600)" },
    matching: { vi: "Ghép nối KTV",        icon: "git-merge",      color: "var(--teal-700)",    soft: "var(--teal-50)",     text: "var(--teal-800)" },
    conduct:  { vi: "Ứng xử & an toàn",    icon: "shield-alert",   color: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)" },
    pricing:  { vi: "Giá & Surge",         icon: "trending-up",    color: "var(--coral-500)",   soft: "var(--coral-50)",    text: "var(--coral-700)" },
    feature:  { vi: "Đề xuất tính năng",   icon: "lightbulb",      color: "var(--teal-600)",    soft: "var(--teal-50)",     text: "var(--teal-800)" },
    praise:   { vi: "Khen ngợi",           icon: "heart",          color: "var(--mint-500)",    soft: "var(--mint-100)",    text: "var(--mint-600)" },
    other:    { vi: "Chưa rõ / Khác",      icon: "message-circle", color: "var(--gray-500)",    soft: "var(--gray-100)",    text: "var(--text-secondary)" },
  };
  const FB_TYPE = {
    complaint:  { vi: "Phàn nàn", icon: "frown",        color: "var(--coral-500)" },
    conflict:   { vi: "Xung đột", icon: "swords",       color: "var(--crimson-500)" },
    suggestion: { vi: "Góp ý",    icon: "lightbulb",    color: "var(--teal-600)" },
    praise:     { vi: "Khen",     icon: "thumbs-up",    color: "var(--mint-500)" },
  };

  // keyword rules cho bộ phân loại
  const FB_CAT_RULES = {
    bug:      ["lỗi", "crash", "văng", "treo", "đứng", "không tải", "không load", "bấm không", "tắt mở", "đơ"],
    payment:  ["thanh toán", "trừ tiền", "hoàn tiền", "ví", "thẻ", "momo", "payout", "phụ phí", "2 lần", "hai lần"],
    booking:  ["đặt lịch", "đặt đơn", "xác nhận", "lịch hẹn", "địa chỉ", "map", "đặt lại", "huỷ đơn"],
    matching: ["ghép", "chờ ktv", "tìm ktv", "nhận đơn", "không có ktv", "chờ gần"],
    conduct:  ["xúc phạm", "thái độ", "khó chịu", "trễ", "quấy rối", "hành vi", "báo cáo", "an toàn", "doạ"],
    pricing:  ["giá", "surge", "cao điểm", "đắt", "tăng giá", "ăn chia", "tỉ lệ", "hoa hồng"],
    feature:  ["nên thêm", "đề xuất", "mong app", "mong có", "tính năng", "cho phép", "giá như", "ước"],
    praise:   ["cảm ơn", "tuyệt", "chuyên nghiệp", "hài lòng", "rất tốt", "lịch sự", "tiện", "tốt"],
  };
  const FB_TYPE_RULES = {
    praise:     ["cảm ơn", "tuyệt", "hài lòng", "chuyên nghiệp", "rất tốt", "lịch sự", "tiện"],
    suggestion: ["nên", "đề xuất", "mong", "giá như", "ước", "cho phép", "thêm tính năng"],
    conflict:   ["xúc phạm", "quấy rối", "báo cáo", "doạ", "tố", "2 lần", "chưa xử lý"],
    complaint:  ["lỗi", "trễ", "khó chịu", "không", "sốc", "đắt", "lâu", "sai", "bực"],
  };

  function scoreRules(text, rules) {
    const t = text.toLowerCase();
    let best = null, bestN = 0, second = 0;
    for (const [k, kws] of Object.entries(rules)) {
      let n = 0; kws.forEach((w) => { if (t.includes(w)) n++; });
      if (n > bestN) { second = bestN; best = k; bestN = n; }
      else if (n > second) second = n;
    }
    return { key: best, hits: bestN, second };
  }

  // bộ phân loại tự động → {category, type, confidence, autoLow}
  function classifyFeedback(text) {
    const c = scoreRules(text, FB_CAT_RULES);
    const ty = scoreRules(text, FB_TYPE_RULES);
    const category = c.hits > 0 ? c.key : "other";
    const type = ty.hits > 0 ? ty.key : "complaint";
    // confidence: nhiều keyword + cách biệt với hạng nhì → tự tin hơn
    let conf = 0.5 + 0.16 * c.hits - 0.08 * c.second;
    if (c.hits === 0) conf = 0.42;
    conf = Math.max(0.38, Math.min(0.96, conf));
    const autoLow = conf < 0.6; // cần người xác nhận phân loại
    return { category, type, confidence: conf, autoLow };
  }

  const FB_RAW = [
    { id: "FB-7012", src: "client", who: "Trần Thị Hương", ch: "Đánh giá in-app", min: 14, similar: 9,
      text: "App cứ văng mỗi khi tôi mở phần lịch sử đơn, bị lỗi liên tục 3 hôm nay rồi." },
    { id: "FB-7011", src: "ktv", who: "Lê Quốc Bảo", ch: "KTV báo cáo", min: 22, similar: 2,
      text: "Tiền payout tuần này bị trừ phụ phí không rõ lý do, mong xem lại ví giúp.",
      ref: { kind: "payout", id: "PO-9034", amount: 240, label: "Payout tuần 22 · Lê Quốc Bảo" } },
    { id: "FB-7009", src: "client", who: "Phạm Quỳnh Anh", ch: "Chat hỗ trợ", min: 38, similar: 5,
      text: "Đặt lịch xong không thấy xác nhận, phải đặt lại 2 lần mới được." },
    { id: "FB-7008", src: "client", who: "Nguyễn Đức Long", ch: "CH Play", min: 51, similar: 12,
      text: "Nên thêm tính năng chọn KTV yêu thích để đặt lại cho nhanh, mong app cập nhật." },
    { id: "FB-7006", src: "ktv", who: "Nguyễn Thu Hà", ch: "KTV báo cáo", min: 63, similar: 3,
      text: "Khách có lời lẽ xúc phạm và doạ nạt, tôi muốn báo cáo hành vi này." },
    { id: "FB-7005", src: "client", who: "Hoàng Bảo Trâm", ch: "Khảo sát", min: 77, similar: 8,
      text: "Giá giờ cao điểm tăng gấp rưỡi mà không báo trước, hơi sốc và đắt.",
      ref: { kind: "booking", id: "LB-4808", amount: 450, label: "Đơn đá nóng · surge 1.0×" } },
    { id: "FB-7003", src: "client", who: "Vương Khánh Chi", ch: "App Store", min: 95, similar: 0,
      text: "KTV rất chuyên nghiệp, app đặt tiện, hài lòng lắm, cảm ơn đội ngũ!" },
    { id: "FB-7002", src: "ktv", who: "Trần Minh Anh", ch: "KTV báo cáo", min: 110, similar: 6,
      text: "Mong app cho phép xem trước quãng đường và thời gian di chuyển tới khách." },
    { id: "FB-7000", src: "client", who: "Lê Văn Khôi", ch: "Chat hỗ trợ", min: 130, similar: 11,
      text: "Ghép KTV quá lâu, chờ gần 15 phút mới có người nhận đơn." },
    { id: "FB-6998", src: "ktv", who: "Vũ Thị Mai", ch: "KTV báo cáo", min: 155, similar: 4,
      text: "Nút 'đã đến nơi' bấm không ăn, phải tắt mở app lại mới được." },
    { id: "FB-6995", src: "client", who: "Đinh Thế Vinh", ch: "Chat hỗ trợ", min: 180, similar: 7,
      text: "Bị trừ tiền 2 lần cho 1 đơn, tổng đài chưa xử lý xong.",
      ref: { kind: "booking", id: "LB-4802", amount: 360, label: "Đơn mô sâu · bị tính trùng" } },
    { id: "FB-6993", src: "ktv", who: "Bùi Anh Tuấn", ch: "Khảo sát", min: 210, similar: 14,
      text: "Đề xuất tăng tỉ lệ ăn chia cho KTV vào khung giờ đêm, hoa hồng hiện hơi thấp.",
      ref: { kind: "payout", id: "PO-9039", amount: 13100, label: "Chính sách ăn chia · Bùi Anh Tuấn" } },
    { id: "FB-6990", src: "client", who: "Tạ Minh Quân", ch: "Đánh giá in-app", min: 250, similar: 5,
      text: "KTV đến trễ 30 phút không báo, thái độ khó chịu." },
    { id: "FB-6988", src: "ktv", who: "Phạm Mỹ Linh", ch: "KTV báo cáo", min: 300, similar: 1,
      text: "Khách rất lịch sự và đúng hẹn, mong có thêm khách như vậy, cảm ơn." },
    { id: "FB-6985", src: "client", who: "Đỗ Gia Hân", ch: "CH Play", min: 360, similar: 2,
      text: "Không dùng được." },
    { id: "FB-6983", src: "ktv", who: "Hồ Ngọc Diệp", ch: "KTV báo cáo", min: 420, similar: 6,
      text: "Đơn hiện sai địa chỉ so với map, suýt đi nhầm chỗ." },
  ];
  // chạy bộ phân loại tự động lúc nạp
  const FB_CURATED = FB_RAW.map((f) => ({ ...f, ...classifyFeedback(f.text) }));

  // ---- Phát hiện nhà cung cấp thanh toán từ nội dung --------
  function detectProvider(text) {
    const t = text.toLowerCase();
    if (t.includes("momo")) return "momo";
    if (t.includes("vnpay")) return "vnpay";
    if (t.includes("zalopay")) return "zalopay";
    if (t.includes("ngân hàng") || t.includes("the ") || t.includes("thẻ") || t.includes("vietcombank") || t.includes("vcb") || t.includes("napas") || t.includes("internet banking")) return "bank";
    return null;
  }

  // ============================================================
  //  SỰ CỐ THANH TOÁN — sinh lượng lớn phản hồi đổ về dồn dập
  //  Giả định cổng MoMo + liên kết ngân hàng đang lỗi.
  // ============================================================
  const FIRST_NAMES = ["An","Bình","Châu","Dũng","Đạt","Giang","Hà","Hải","Hằng","Hiếu","Hoa","Hùng","Huy","Khoa","Lan","Linh","Long","Mai","Minh","Nam","Nga","Ngọc","Nhung","Phong","Phúc","Quân","Quỳnh","Sơn","Tâm","Thảo","Thành","Trang","Trung","Tú","Tuấn","Vy","Yến","Bảo","Khánh","Diệp"];
  const LAST_NAMES = ["Nguyễn","Trần","Lê","Phạm","Hoàng","Vũ","Đỗ","Bùi","Đặng","Hồ","Ngô","Dương","Lý","Phan","Võ","Đinh","Tạ","Lương","Mai","Trịnh"];
  const CHANNELS = ["Chat hỗ trợ", "Đánh giá in-app", "CH Play", "App Store", "Hotline", "Khảo sát"];
  const rnd = (() => { let s = 20260612; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; })();
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const nameGen = () => pick(LAST_NAMES) + " " + pick(FIRST_NAMES) + " " + pick(FIRST_NAMES);

  // mẫu câu phàn nàn thanh toán theo nhà cung cấp
  const MOMO_TXT = [
    "Thanh toán qua MoMo báo lỗi liên tục, không đặt được đơn nào.",
    "MoMo đã trừ tiền nhưng đơn không được xác nhận, mất gần 400k rồi.",
    "Liên kết ví MoMo cứ báo 'giao dịch thất bại' dù số dư còn đủ.",
    "Trả bằng MoMo bị treo ở màn hình chờ rồi văng ra, thử 5 lần đều lỗi.",
    "MoMo trừ tiền 2 lần cho 1 đơn, app báo chưa thanh toán.",
    "Không thanh toán MoMo được từ chiều giờ, app cứ quay vòng.",
    "Quét QR MoMo xong báo lỗi cổng, đặt lịch không xong.",
  ];
  const BANK_TXT = [
    "Thẻ ngân hàng bị từ chối dù còn tiền, thử Vietcombank lẫn ACB đều lỗi.",
    "Liên kết ngân hàng thất bại, OTP không về dù chờ mấy phút.",
    "Thanh toán thẻ báo 'cổng đang bận', không đặt được dịch vụ.",
    "Trừ tiền qua ngân hàng nhưng đơn báo chưa thanh toán, lo mất tiền.",
    "Cổng thẻ nội địa Napas lỗi, mình thử 3 thẻ đều không qua.",
    "Internet banking báo giao dịch thành công mà app vẫn bắt trả lại.",
  ];
  const KTV_PAY_TXT = [
    "Payout về ví MoMo của tôi bị treo, tiền chưa nhận được.",
    "Tiền buổi hôm nay chưa thấy chuyển khoản ngân hàng, mọi khi tự động.",
    "Rút tiền về ngân hàng báo lỗi cổng, không rút được.",
  ];

  // sinh spike: ~84 phản hồi thanh toán trong ~50 phút gần đây
  const SPIKE = [];
  let sid = 7100;
  const total = 84;
  for (let i = 0; i < total; i++) {
    // càng gần hiện tại càng dày (sự cố mới bùng)
    const min = Math.floor(Math.pow(rnd(), 1.7) * 52) + 1;
    const r = rnd();
    let text, provider, src = "client";
    if (r < 0.58) { text = pick(MOMO_TXT); provider = "momo"; }
    else if (r < 0.9) { text = pick(BANK_TXT); provider = "bank"; }
    else { text = pick(KTV_PAY_TXT); provider = rnd() < 0.6 ? "momo" : "bank"; src = "ktv"; }
    SPIKE.push({
      id: "FB-" + (sid++), src, who: nameGen(), ch: pick(CHANNELS), min, similar: 0,
      text, provider, incident: true,
    });
  }
  // vài phản hồi nền (không phải thanh toán) rải rác để pha loãng
  const NOISE = [
    { text: "App load hơi chậm lúc mở bản đồ.", cat: "bug" },
    { text: "Mong có thêm khung giờ đặt buổi sáng sớm.", cat: "feature" },
    { text: "KTV làm rất tốt, cảm ơn nhiều!", cat: "praise" },
    { text: "Ghép KTV hơi lâu giờ cao điểm.", cat: "matching" },
    { text: "Địa chỉ gợi ý chưa chính xác lắm.", cat: "booking" },
    { text: "Nên cho phép hẹn lại đơn dễ hơn.", cat: "feature" },
  ];
  for (let i = 0; i < 14; i++) {
    const n = pick(NOISE);
    SPIKE.push({ id: "FB-" + (sid++), src: rnd() < 0.7 ? "client" : "ktv", who: nameGen(), ch: pick(CHANNELS), min: Math.floor(rnd() * 120) + 4, similar: 0, text: n.text });
  }

  const FB_GEN = SPIKE.map((f) => {
    const cl = classifyFeedback(f.text);
    // các case thanh toán đảm bảo gắn nhóm payment + provider
    const category = f.incident ? "payment" : cl.category;
    const provider = f.provider || detectProvider(f.text);
    return { ...f, ...cl, category, provider, confidence: f.incident ? Math.max(cl.confidence, 0.9) : cl.confidence, autoLow: f.incident ? false : cl.autoLow };
  });

  const FEEDBACK = [...FB_GEN, ...FB_CURATED.map((f) => ({ ...f, provider: detectProvider(f.text) }))]
    .sort((a, b) => a.min - b.min);

  // ---- Bộ phát hiện sự cố thanh toán -----------------------
  // Quét cửa sổ gần đây, nếu volume payment-fail vượt ngưỡng → incident.
  function detectPaymentIncident(items) {
    const win = 60; // phút
    const pays = items.filter((f) => f.category === "payment" && f.min <= win);
    const recent = items.filter((f) => f.category === "payment" && f.min <= 15);
    const baseline = 3; // mức nền bình thường / 15'
    if (recent.length < 10) return { active: false };
    const byProv = {};
    pays.forEach((f) => { const p = f.provider || "khác"; byProv[p] = (byProv[p] || 0) + 1; });
    const providers = Object.entries(byProv).map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n);
    const top = providers[0];
    const rate15 = recent.length;
    const mult = Math.round((rate15 / baseline) * 10) / 10;
    // thời điểm bắt đầu ~ phút lớn nhất trong cụm dày
    const started = Math.max(...pays.map((f) => f.min));
    return {
      active: true,
      window: win, total: pays.length, recent: recent.length,
      providers, top, mult, baseline, startedMin: Math.min(started, 52),
      momo: byProv.momo || 0, bank: byProv.bank || 0,
    };
  }

  const PROVIDER_META = {
    momo: { vi: "Ví MoMo", icon: "wallet", color: "var(--teal-700)" },
    bank: { vi: "Thẻ / Ngân hàng", icon: "credit-card", color: "var(--teal-700)" },
    vnpay: { vi: "VNPay", icon: "wallet", color: "var(--teal-600)" },
    zalopay: { vi: "ZaloPay", icon: "wallet", color: "var(--teal-600)" },
    "khác": { vi: "Khác", icon: "circle-help", color: "var(--gray-500)" },
  };

  // ============================================================
  //  Tài chính / Đối soát — số liệu quan trọng + mở rộng chi tiết
  // ============================================================
  // Money đơn vị: nghìn đồng (k). fmtVnd cho số lớn → triệu/tỷ.
  const TAKE_RATE = 0.22; // hoa hồng nền tảng
  // KPI hôm nay
  const FIN_KPIS = {
    gmv:       { vi: "GMV tháng này",        value: 128400000, unit: "k", delta: +12.4, sub: "Tổng giá trị giao dịch tháng 6" },
    netRev:    { vi: "Doanh thu nền tảng",  value: 28248000,  unit: "k", delta: +9.1,  sub: "Sau hoàn & khuyến mãi" },
    payoutDue: { vi: "Payout chờ chi",      value: 23640000,  unit: "k", delta: +6.7,  sub: "KTV chưa nhận · chu kỳ tuần" },
    escrow:    { vi: "Đang giữ (escrow)",   value: 8420000,   unit: "k", delta: -3.2,  sub: "Đơn chưa hoàn tất" },
  };
  // dòng tiền 14 ngày: thu (capture) vs chi (payout) — đơn vị tỷ đồng
  const FIN_CASHFLOW = [
    { d: "29/05", in: 3.78, out: 2.91 }, { d: "30/05", in: 4.05, out: 3.08 },
    { d: "31/05", in: 4.21, out: 3.22 }, { d: "01/06", in: 3.96, out: 3.04 },
    { d: "02/06", in: 4.42, out: 3.36 }, { d: "03/06", in: 4.18, out: 3.19 },
    { d: "04/06", in: 4.55, out: 3.47 }, { d: "05/06", in: 4.78, out: 3.62 },
    { d: "06/06", in: 4.31, out: 3.28 }, { d: "07/06", in: 5.02, out: 3.79 },
    { d: "08/06", in: 5.24, out: 3.95 }, { d: "09/06", in: 4.87, out: 3.68 },
    { d: "10/06", in: 5.41, out: 4.08 }, { d: "11/06", in: 4.12, out: 3.14 },
  ]; // đơn vị: tỷ đồng
  // cơ cấu doanh thu nền tảng (k) — tổng ≈ 28.25 tỷ
  const FIN_REVMIX = [
    { vi: "Hoa hồng dịch vụ", value: 21400000, color: "var(--teal-800)" },
    { vi: "Phụ phí surge",     value: 4080000,  color: "var(--teal-600)" },
    { vi: "Phí huỷ / no-show", value: 1720000,  color: "var(--teal-300)" },
    { vi: "Hội viên lull+",    value: 1048000,  color: "var(--gray-400)" },
  ];
  // phương thức thanh toán
  const FIN_METHODS = [
    { vi: "Ví MoMo", pct: 38, icon: "wallet" },
    { vi: "Thẻ nội địa", pct: 29, icon: "credit-card" },
    { vi: "Thẻ quốc tế", pct: 18, icon: "credit-card" },
    { vi: "Tiền mặt", pct: 9, icon: "banknote" },
    { vi: "Ví lull", pct: 6, icon: "wallet" },
  ];
  // hàng đợi đối soát payout cho KTV — có chi tiết mở rộng
  const FIN_PAYOUTS = [
    { id: "PO-9041", ktvId: "k2", period: "Tuần 23 · 03–09/06", sessions: 28, gross: 14820, status: "pending",
      lines: [{ vi: "Doanh thu buổi", v: 14820 }, { vi: "Hoa hồng nền tảng (22%)", v: -3260 }, { vi: "Thưởng đúng giờ", v: 220 }, { vi: "Phụ phí surge chia lại", v: 410 }, { vi: "Khấu trừ huỷ đơn", v: -180 }] },
    { id: "PO-9040", ktvId: "k1", period: "Tuần 23 · 03–09/06", sessions: 22, gross: 11640, status: "pending",
      lines: [{ vi: "Doanh thu buổi", v: 11640 }, { vi: "Hoa hồng nền tảng (22%)", v: -2561 }, { vi: "Thưởng khách quay lại", v: 300 }, { vi: "Phụ phí surge chia lại", v: 280 }] },
    { id: "PO-9039", ktvId: "k7", period: "Tuần 23 · 03–09/06", sessions: 25, gross: 13100, status: "hold",
      hold: "Giữ do tranh chấp DS-2031 chưa xử lý xong",
      lines: [{ vi: "Doanh thu buổi", v: 13100 }, { vi: "Hoa hồng nền tảng (22%)", v: -2882 }, { vi: "Giữ tạm cho tranh chấp", v: -3600 }, { vi: "Thưởng chứng chỉ", v: 150 }] },
    { id: "PO-9038", ktvId: "k4", period: "Tuần 23 · 03–09/06", sessions: 19, gross: 9880, status: "pending",
      lines: [{ vi: "Doanh thu buổi", v: 9880 }, { vi: "Hoa hồng nền tảng (22%)", v: -2174 }, { vi: "Thưởng đánh giá 5★", v: 180 }] },
    { id: "PO-9035", ktvId: "k6", period: "Tuần 22 · 27/05–02/06", sessions: 23, gross: 11960, status: "paid", paidAt: "10/06 09:12",
      lines: [{ vi: "Doanh thu buổi", v: 11960 }, { vi: "Hoa hồng nền tảng (22%)", v: -2631 }, { vi: "Phụ phí surge chia lại", v: 340 }] },
    { id: "PO-9034", ktvId: "k3", period: "Tuần 22 · 27/05–02/06", sessions: 16, gross: 7640, status: "paid", paidAt: "10/06 09:12",
      lines: [{ vi: "Doanh thu buổi", v: 7640 }, { vi: "Hoa hồng nền tảng (22%)", v: -1681 }, { vi: "Khấu trừ huỷ đơn", v: -240 }] },
  ];
  function payoutNet(p) { return p.lines.reduce((s, l) => s + l.v, 0); }
  // tổng hàng đợi payout toàn mạng lưới (bảng chỉ hiển thị mẫu ưu tiên)
  const FIN_PAYOUT_QUEUE = { total: 23640000, count: 1284, held: 37, heldValue: 1860000 };

  // ---- Đọc số tiền thành chữ (quy ước tài chính VN) --------
  const _ONES = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  function _read3(n, full) {
    const tr = Math.floor(n / 100), ch = Math.floor((n % 100) / 10), dv = n % 10;
    let s = "";
    if (full || tr > 0) s += _ONES[tr] + " trăm";
    if (ch === 0) {
      if (dv > 0) s += (full || tr > 0 ? " lẻ " : " ") + _ONES[dv];
    } else if (ch === 1) {
      s += " mười";
      if (dv === 5) s += " lăm"; else if (dv > 0) s += " " + _ONES[dv];
    } else {
      s += " " + _ONES[ch] + " mươi";
      if (dv === 1) s += " mốt"; else if (dv === 5) s += " lăm"; else if (dv > 0) s += " " + _ONES[dv];
    }
    return s.trim();
  }
  function readVndWords(dong) {
    let num = Math.round(dong);
    if (num === 0) return "Không đồng";
    const units = ["", "nghìn", "triệu", "tỷ"];
    let groups = [], s = String(num);
    while (s.length > 0) { groups.unshift(s.slice(-3)); s = s.slice(0, -3); }
    const ng = groups.length, parts = [];
    for (let i = 0; i < ng; i++) {
      const g = parseInt(groups[i], 10);
      if (g === 0) continue;
      const pos = ng - 1 - i;
      const unitIdx = pos % 3, tyCount = Math.floor(pos / 3);
      let txt = _read3(g, i !== 0);
      if (units[unitIdx]) txt += " " + units[unitIdx];
      for (let t = 0; t < tyCount; t++) txt += " tỷ";
      parts.push(txt);
    }
    let r = (parts.join(" ").replace(/\s+/g, " ").trim() + " đồng");
    return r.charAt(0).toUpperCase() + r.slice(1);
  }

  const FIN_STATUS = {
    pending: { vi: "Chờ chi", color: "var(--amber-500)", soft: "var(--amber-100)", text: "var(--amber-600)" },
    hold:    { vi: "Đang giữ", color: "var(--crimson-500)", soft: "var(--crimson-100)", text: "var(--crimson-600)" },
    paid:    { vi: "Đã chi", color: "var(--mint-500)", soft: "var(--mint-100)", text: "var(--mint-600)" },
  };

  window.OPS = {
    STATES, FLOW, FLOW_LABEL, SERVICES, REGIONS, KTV, BOOKINGS,
    EXCEPTIONS, SEV, exMeta, RISK, AI_POLICY, aiRecommend, applyResolution,
    EX_OBJECTS, EX_OBJ_OF,
    DISPUTES, DISPUTE_CAT, RULINGS, disputeDifficulty, disputeAdvisory,
    ZONES, expectedWait, hourlyEarn, jobsPerHour, travelMin, AVG_FARE,
    repoThreshold, repoSuggestion, repoCandidates,
    FB_CAT, FB_TYPE, FEEDBACK, classifyFeedback, detectPaymentIncident, PROVIDER_META, detectProvider,
    TAKE_RATE, FIN_KPIS, FIN_CASHFLOW, FIN_REVMIX, FIN_METHODS, FIN_PAYOUTS, FIN_PAYOUT_QUEUE, FIN_STATUS, payoutNet, readVndWords,
    ktvById, scoreFor, candidatesFor, priceOf, W,
    KTV_GROUP, ktvGroupOf, ktvHistory, ktvHistoryStats, HX_OUTCOME,
    CUST_SEG, custSegOf, CUSTOMERS, custById, custHistory, custHistoryStats, CB_OUTCOME,
    fmtMoney: (n) => n.toLocaleString("vi-VN") + "k",
    // số tiền đầy đủ bằng chữ số (k → đồng): "128.400.000.000 ₫"
    fmtDong: (k) => (k * 1000).toLocaleString("vi-VN") + " ₫",
    readWords: (k) => readVndWords(k * 1000),
    fmtVnd: (k) => {
      // k = nghìn đồng → hiển thị gọn
      if (k >= 1e6) return (k / 1e6).toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + " tỷ";
      if (k >= 1e3) return (k / 1e3).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " tr";
      return k.toLocaleString("vi-VN") + "k";
    },
    ago: (d) => {
      const m = Math.round((Date.now() - d.getTime()) / 60000);
      if (m < 1) return "vừa xong";
      if (m < 60) return m + " phút trước";
      return Math.floor(m / 60) + " giờ trước";
    },
  };
})();
