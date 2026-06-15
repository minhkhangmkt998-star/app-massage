// Phản hồi & Góp ý — aggregate khách + KTV voice, AI auto-classified.
const { useState: useFbState } = React;

function fbAgo(min) {
  if (min < 60) return min + " phút trước";
  const h = Math.floor(min / 60);
  if (h < 24) return h + " giờ trước";
  return Math.floor(h / 24) + " ngày trước";
}

// Recommended resolution playbook per category/type.
// money cases carry a `money` object that triggers the Đối soát link.
function fbPlaybook(f) {
  const cat = f.category;
  const isPraise = f.type === "praise";
  const isSuggestion = f.type === "suggestion";
  if (cat === "payment") {
    return {
      color: "var(--amber-500)", tone: "money",
      primary: { vi: "Đối chiếu giao dịch & hoàn/điều chỉnh", icon: "wallet", note: "Mở sổ đối soát của đơn/payout liên quan" },
      steps: ["Mở Đối soát, tra giao dịch theo mã đính kèm", "Xác minh khoản trừ trùng / phụ phí sai", "Hoàn tiền hoặc điều chỉnh payout, ghi log", "Phản hồi người gửi kèm kết quả"],
      money: { hint: "Khoản tiền cần đối chiếu & xử lý ở module Đối soát." },
    };
  }
  if (cat === "pricing") {
    return {
      color: "var(--coral-500)", tone: "money",
      primary: { vi: "Rà soát surge & minh bạch giá", icon: "trending-up", note: "Kiểm tra cấu hình surge khu vực/khung giờ" },
      steps: ["Mở Đối soát/Surge xem mức giá áp cho đơn", "Đối chiếu surge_max & thông báo giá", "Nếu sai chính sách → hoàn chênh lệch", "Cập nhật người gửi"],
      money: { hint: "Cần kiểm tra giá đơn & chính sách surge ở Đối soát." },
    };
  }
  if (cat === "bug") {
    return {
      color: "var(--crimson-500)", tone: "bug",
      primary: { vi: "Tạo ticket kỹ thuật (ưu tiên cao)", icon: "bug", note: "Gắn log + bước tái hiện cho team Eng" },
      steps: ["Xác nhận tái hiện & mức ảnh hưởng", "Tạo ticket Eng kèm thiết bị/phiên bản", "Gắn cụm phản hồi tương tự để định mức độ", "Phản hồi tạm thời cho người gửi"],
      money: null,
    };
  }
  if (cat === "conduct") {
    return {
      color: "var(--crimson-500)", tone: "safety",
      primary: { vi: "Chuyển đội Trust & Safety", icon: "shield-alert", note: "Ưu tiên an toàn, mở hồ sơ điều tra" },
      steps: ["Ghi nhận & bảo toàn bằng chứng (chat, ghi âm)", "Mở ticket T&S, liên hệ hai bên", "Áp biện pháp tạm thời nếu cần", "Theo dõi tới khi đóng hồ sơ"],
      money: null,
    };
  }
  if (isPraise) {
    return {
      color: "var(--mint-500)", tone: "praise",
      primary: { vi: "Ghi nhận & khuếch đại", icon: "heart", note: "Cảm ơn người gửi, lưu làm testimonial" },
      steps: ["Gửi lời cảm ơn tới người gửi", "Cân nhắc thưởng/ghi nhận KTV được khen", "Lưu trích dẫn cho marketing (nếu đồng ý)"],
      money: null,
    };
  }
  if (isSuggestion) {
    return {
      color: "var(--teal-600)", tone: "feature",
      primary: { vi: "Đưa vào backlog sản phẩm", icon: "lightbulb", note: "Gắn vào nhóm tính năng & đo nhu cầu" },
      steps: ["Tạo/đính kèm thẻ tính năng trong backlog", "Gộp các phản hồi cùng đề xuất để định ưu tiên", "Phản hồi người gửi đã ghi nhận"],
      money: null,
    };
  }
  // default — booking/matching/other complaint
  return {
    color: "var(--teal-600)", tone: "ops",
    primary: { vi: "Phản hồi & xử lý vận hành", icon: "reply", note: "Trả lời người gửi, chuyển bộ phận phù hợp" },
    steps: ["Xác minh chi tiết với người gửi", "Chuyển đội vận hành/điều phối nếu cần", "Đánh dấu đã xử lý & lưu ghi chú"],
    money: null,
  };
}

function SrcTag({ src, size }) {
  const c = src === "client" ? "var(--coral-500)" : "var(--teal-700)";
  const soft = src === "client" ? "var(--coral-50)" : "var(--teal-50)";
  return (
    <span className="srctag" style={{ color: c, background: soft, fontSize: size === "sm" ? 10.5 : 11.5 }}>
      <I n={src === "client" ? "user-round" : "hand-helping"} s={size === "sm" ? 11 : 12} />{src === "client" ? "Khách" : "KTV"}
    </span>
  );
}

function TypeTag({ type }) {
  const { FB_TYPE } = window.OPS;
  const m = FB_TYPE[type]; if (!m) return null;
  return <span className="typetag" style={{ color: m.color, background: `color-mix(in srgb, ${m.color} 13%, white)` }}><I n={m.icon} s={11} />{m.vi}</span>;
}

// one feedback row card
function FbCard({ f, onOpen }) {
  const { FB_CAT } = window.OPS;
  const cat = FB_CAT[f.category];
  const lowConf = f.autoLow;
  return (
    <div className="fbcard" onClick={() => onOpen(f.id)}>
      <Av name={f.who} size="sm" />
      <div className="fbcard__body">
        <div className="row gap6" style={{ flexWrap: "wrap" }}>
          <b style={{ fontSize: 11.6 }}>{f.who}</b>
          <SrcTag src={f.src} size="sm" />
          <TypeTag type={f.type} />
        </div>
        <p className="fbcard__text">{f.text}</p>
        <div className="fbcard__foot">
          <span><I n="radio-tower" s={12} /> {f.ch}</span>
          <span className="dot-sep"></span>
          <span>{fbAgo(f.min)}</span>
          {f.similar > 0 ? <><span className="dot-sep"></span><span className="fbcard__cluster"><I n="layers" s={12} /> +{f.similar} tương tự</span></> : null}
        </div>
      </div>
      <div className="fbcard__ai">
        <span className="fbcard__catchip" style={{ color: cat.text, background: cat.soft }}><I n={cat.icon} s={12} />{cat.vi}</span>
        <span className={"fbcard__conf" + (lowConf ? " fbcard__conf--low" : "")}>
          {lowConf ? <><I n="help-circle" s={12} /> cần xác nhận</> : <><I n="sparkles" s={11} /> {Math.round(f.confidence * 100)}%</>}
        </span>
      </div>
    </div>
  );
}

function FeedbackDrawer({ f, onClose, onReclassify, onResolve, onNavFinance }) {
  const { FB_CAT, FB_TYPE, fmtMoney } = window.OPS;
  if (!f) return null;
  const cat = FB_CAT[f.category];
  const pb = fbPlaybook(f);
  const isMoney = pb.money;
  const actions = [
    { k: "ticket", vi: "Tạo ticket sản phẩm", icon: "ticket" },
    { k: "reply", vi: "Phản hồi người gửi", icon: "reply" },
    { k: "merge", vi: "Gộp vào nhóm tương tự", icon: "layers" },
    { k: "done", vi: "Đánh dấu đã xử lý", icon: "check" },
  ];
  return (
    <div className="drawer drawer--on">
      <div className="drawer__head">
        <div className="row between" style={{ marginBottom: 10 }}>
          <span className="drawer__id">{f.id} · {f.ch} · {fbAgo(f.min)}</span>
          <button className="icon-pill" style={{ width: 34, height: 34, border: "none", boxShadow: "none" }} onClick={onClose}><I n="x" s={18} /></button>
        </div>
        <div className="row gap10">
          <Av name={f.who} size="md" />
          <div>
            <div className="row gap6"><b style={{ fontSize: 13.8 }}>{f.who}</b><SrcTag src={f.src} /></div>
            <div className="muted" style={{ fontSize: 10.8 }}><TypeTag type={f.type} /></div>
          </div>
        </div>
      </div>

      <div className="drawer__body">
        <div className="dsec">
          <div className="dsec__t"><I n="message-square-quote" s={14} /> Nội dung phản hồi</div>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, fontStyle: "italic", color: "var(--text-primary)" }}>“{f.text}”</p>
        </div>

        {/* AI classification */}
        <div className="dsec" style={{ borderColor: "var(--teal-200, var(--teal-100))" }}>
          <div className="dsec__t" style={{ color: "var(--teal-800)" }}>
            <span className="aicard__spark" style={{ width: 20, height: 20 }}><I n="sparkles" s={12} /></span> AI tự phân loại
            {f.autoLow ? <span className="airisk" style={{ marginLeft: "auto", color: "var(--amber-600)", background: "var(--amber-100)" }}><I n="alert-triangle" s={11} /> Độ tin thấp · cần xác nhận</span> : null}
          </div>
          <div className="row between" style={{ marginBottom: 10 }}>
            <span className="fbcard__catchip" style={{ color: cat.text, background: cat.soft, fontSize: 11.2, padding: "4px 11px" }}><I n={cat.icon} s={14} />{cat.vi}</span>
            <span className="muted" style={{ fontSize: 10.3, fontWeight: 700 }}>Độ tin {Math.round(f.confidence * 100)}%</span>
          </div>
          <div className="confmeter" style={{ marginBottom: 4 }}>
            <div className="confmeter__track" style={{ flex: 1, width: "auto" }}><div className="confmeter__fill" style={{ width: Math.round(f.confidence * 100) + "%", background: f.confidence >= 0.6 ? "var(--mint-500)" : "var(--amber-500)" }}></div></div>
          </div>
        </div>

        {/* reclassify */}
        <div className="dsec">
          <div className="dsec__t"><I n="folder-tree" s={14} /> Đổi nhóm phân loại</div>
          <div className="fbreclass">
            {Object.entries(FB_CAT).map(([k, m]) => (
              <button key={k} className={"fbcatbtn" + (k === f.category ? " fbcatbtn--on" : "")} onClick={() => onReclassify(f.id, k)}
                style={k === f.category ? { borderColor: m.color, background: m.soft, color: m.text } : {}}>
                <I n={m.icon} s={14} />{m.vi}
              </button>
            ))}
          </div>
        </div>

        {/* recommended resolution playbook */}
        <div className="dsec" style={{ borderColor: pb.tone === "money" ? "var(--amber-200, var(--amber-100))" : "var(--teal-100)" }}>
          <div className="dsec__t" style={{ color: "var(--teal-800)" }}><I n="route" s={14} /> Hướng xử lý đề xuất</div>
          <div className="fbplay">
            <div className="fbplay__primary" style={{ background: pb.color + "14", borderColor: pb.color }}>
              <span className="fbplay__pic" style={{ background: pb.color }}><I n={pb.primary.icon} s={15} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 11.6 }}>{pb.primary.vi}</b>
                <div className="muted" style={{ fontSize: 10.3, marginTop: 1 }}>{pb.primary.note}</div>
              </div>
            </div>
            <ol className="fbplay__steps">
              {pb.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>

        {/* money case → quick link to đối soát */}
        {isMoney ? (
          <div className="fbmoney">
            <div className="fbmoney__head">
              <span className="fbmoney__ic"><I n="wallet" s={18} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 11.6 }}>Liên quan dòng tiền — xử lý tại Đối soát</b>
                <div className="muted" style={{ fontSize: 10.3, marginTop: 1 }}>{pb.money.hint}</div>
              </div>
            </div>
            {f.ref ? (
              <div className="fbmoney__ref">
                <span className="fbmoney__refic"><I n={f.ref.kind === "payout" ? "hand-coins" : "receipt"} s={14} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 10.8 }}>{f.ref.id}</b>
                  <span className="muted" style={{ fontSize: 9.9, display: "block" }}>{f.ref.label}</span>
                </div>
                <b className="mono" style={{ fontSize: 12 }}>{fmtMoney(f.ref.amount)}</b>
              </div>
            ) : null}
            <button className="lull-btn cf-btn--go fbmoney__btn" style={{ background: "var(--amber-500)", borderColor: "var(--amber-500)", color: "#fff", width: "100%", height: 42, borderRadius: 8 }}
              onClick={() => onNavFinance && onNavFinance(f.ref)}>
              <I n="arrow-up-right" s={16} /> Mở Đối soát xử lý ngay
            </button>
          </div>
        ) : null}

        {/* actions */}
        <div className="dsec">
          <div className="dsec__t"><I n="list-checks" s={14} /> Hành động khác</div>
          <div className="rulegrid">
            {actions.map((a) => (
              <button key={a.k} className="rulebtn" onClick={() => onResolve(f.id, a.vi)}>
                <span className="rulebtn__ic" style={{ color: "var(--teal-700)" }}><I n={a.icon} s={16} /></span>{a.vi}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment incident detection banner — provider breakdown + volume + actions
function PaymentIncidentBanner({ inc, items, onNavFinance, onToast, acked, onAck }) {
  const { PROVIDER_META } = window.OPS;
  const buckets = Array.from({ length: 12 }, () => 0);
  items.filter((f) => f.category === "payment" && f.min <= 60).forEach((f) => {
    const b = Math.min(11, Math.floor(f.min / 5));
    buckets[b]++;
  });
  const maxB = Math.max(1, ...buckets);
  const topProv = inc.top ? PROVIDER_META[inc.top.k] || PROVIDER_META["khác"] : null;

  return (
    <div className={"incident" + (acked ? " incident--ack" : "")}>
      <div className="incident__bar"></div>
      <div className="incident__main">
        <div className="incident__head">
          <span className="incident__siren"><I n="siren" s={20} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row gap6" style={{ flexWrap: "wrap" }}>
              <b style={{ fontSize: 13.3 }}>Nghi vấn sự cố thanh toán</b>
              <span className="incident__livechip"><span className="incident__dot"></span>ĐANG DIỄN RA</span>
              {acked ? <span className="airisk" style={{ color: "var(--text-secondary)", background: "var(--gray-100)" }}><I n="check" s={11} /> Đã ghi nhận</span> : null}
            </div>
            <div style={{ fontSize: 11.2, color: "var(--crimson-600)", fontWeight: 600, marginTop: 3 }}>
              AI phát hiện <b>{inc.recent}</b> phản hồi lỗi thanh toán trong 15′ — gấp <b>{inc.mult}×</b> mức nền. Nghi cổng <b>{topProv ? topProv.vi : "thanh toán"}</b> gặp sự cố. Bắt đầu ~{inc.startedMin}′ trước.
            </div>
          </div>
        </div>

        <div className="incident__grid">
          <div className="incident__box">
            <div className="incident__bt">Theo nhà cung cấp · 60′</div>
            {inc.providers.map((p) => {
              const pm = PROVIDER_META[p.k] || PROVIDER_META["khác"];
              const pct = Math.round(p.n / inc.total * 100);
              return (
                <div className="provrow" key={p.k}>
                  <span className="provrow__ic" style={{ background: pm.color }}><I n={pm.icon} s={12} /></span>
                  <span className="provrow__l">{pm.vi}</span>
                  <span className="provrow__bar"><span className="provrow__fill" style={{ width: pct + "%", background: pm.color }}></span></span>
                  <b className="provrow__n">{p.n}</b>
                </div>
              );
            })}
          </div>

          <div className="incident__box">
            <div className="incident__bt">Lưu lượng lỗi · 60′ → bây giờ</div>
            <div className="spark">
              {buckets.slice().reverse().map((v, i) => (
                <span key={i} className="spark__bar" style={{ height: Math.max(4, v / maxB * 100) + "%", background: i >= 9 ? "var(--crimson-500)" : "var(--amber-500)" }} title={v + " lỗi"}></span>
              ))}
            </div>
            <div className="spark__x"><span>60′ trước</span><span>bây giờ</span></div>
          </div>
        </div>

        <div className="incident__actions">
          <button className="exbtn exbtn--sm exbtn--primary" style={{ background: "var(--crimson-500)", borderColor: "var(--crimson-500)" }} onClick={() => onToast && onToast("🚨 Đã mở incident — báo đội Payments & Eng")}><I n="flag" s={14} /> Mở incident Payments</button>
          <button className="exbtn exbtn--sm" onClick={() => onNavFinance && onNavFinance(null)}><I n="wallet" s={14} /> Mở Đối soát</button>
          <button className="exbtn exbtn--sm" onClick={() => onToast && onToast("⏸ Đã tạm ẩn " + (topProv ? topProv.vi : "cổng lỗi") + " ở bước thanh toán")}><I n="pause" s={14} /> Tạm ẩn {topProv ? topProv.vi : "cổng"}</button>
          <button className="exbtn exbtn--sm" onClick={() => onToast && onToast("📣 Đã lên lịch thông báo cho khách bị ảnh hưởng")}><I n="megaphone" s={14} /> Thông báo khách</button>
          {!acked ? <button className="exbtn exbtn--sm" style={{ marginLeft: "auto", color: "var(--text-secondary)" }} onClick={onAck}>Ghi nhận</button> : null}
        </div>
      </div>
    </div>
  );
}

function FeedbackPage({ onToast, onNavFinance }) {
  const { FB_CAT, FB_TYPE, FEEDBACK, detectPaymentIncident, PROVIDER_META } = window.OPS;
  const [items, setItems] = useFbState(() => FEEDBACK.map((f) => ({ ...f })));
  const [src, setSrc] = useFbState("all");
  const [type, setType] = useFbState("all");
  const [openId, setOpenId] = useFbState(null);
  const [expanded, setExpanded] = useFbState({});
  const [incidentAck, setIncidentAck] = useFbState(false);

  const incident = detectPaymentIncident(items);

  const visible = items.filter((f) => (src === "all" || f.src === src) && (type === "all" || f.type === type));

  // group by category, sorted by volume
  const groups = Object.keys(FB_CAT)
    .map((k) => ({ key: k, cat: FB_CAT[k], items: visible.filter((f) => f.category === k) }))
    .filter((g) => g.items.length)
    .sort((a, b) => b.items.length - a.items.length);

  const lowCount = items.filter((f) => f.autoLow).length;
  const groupCount = new Set(items.map((f) => f.category)).size;

  const reclassify = (id, cat) => {
    setItems((xs) => xs.map((f) => (f.id === id ? { ...f, category: cat, autoLow: false, confidence: Math.max(f.confidence, 0.99) } : f)));
    onToast && onToast("✓ Đã chuyển sang nhóm " + FB_CAT[cat].vi);
  };
  const resolve = (id, label) => {
    setItems((xs) => xs.filter((f) => f.id !== id));
    setOpenId(null);
    onToast && onToast("✓ " + label);
  };

  const open = items.find((f) => f.id === openId) || null;

  const srcFilters = [
    { k: "all", vi: "Tất cả", icon: "inbox" },
    { k: "client", vi: "Khách", icon: "user-round" },
    { k: "ktv", vi: "KTV", icon: "hand-helping" },
  ];

  return (
    <div className="page">
      <div>
        <h1 className="topbar__title" style={{ marginBottom: 2 }}>{window.tr("Phản hồi & Góp ý")}</h1>
        <p className="page__lead">{window.tr("Tổng hợp phàn nàn, xung đột và góp ý từ cả khách hàng lẫn KTV qua mọi kênh. AI tự phân loại vào từng nhóm chủ đề; mục độ tin thấp cần người xác nhận.")}</p>
      </div>

      {/* PAYMENT INCIDENT ALERT */}
      {incident.active ? (
        <PaymentIncidentBanner inc={incident} items={items} onNavFinance={onNavFinance} onToast={onToast} acked={incidentAck} onAck={() => setIncidentAck(true)} />
      ) : null}

      {/* AI classify banner */}
      <div className="aibar aibar--on" style={{ maxWidth: 880 }}>
        <span className="aibar__spark"><I n="sparkles" s={18} /></span>
        <div style={{ flex: 1 }}>
          <div className="row gap6"><b style={{ fontSize: 12.5 }}>AI đã tự phân loại {items.length} phản hồi</b></div>
          <div className="muted" style={{ fontSize: 10.8, marginTop: 2 }}>
            Chia vào <b style={{ color: "var(--teal-700)" }}>{groupCount}</b> nhóm chủ đề · <b style={{ color: "var(--amber-600)" }}>{lowCount}</b> mục độ tin thấp cần xác nhận
          </div>
        </div>
      </div>

      {/* category summary tiles */}
      <div className="fbsummary">
        {groups.slice(0, 6).map((g) => (
          <button key={g.key} className="fbsum" onClick={() => { document.getElementById("fbg-" + g.key)?.scrollIntoView({ block: "start" }); }}>
            <span className="fbsum__ic" style={{ background: g.cat.soft, color: g.cat.text }}><I n={g.cat.icon} s={18} /></span>
            <span className="fbsum__n">{g.items.length}</span>
            <span className="fbsum__l">{g.cat.vi}</span>
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="fbfilters">
        <div className="fbfilters__seg">
          {srcFilters.map((s) => (
            <button key={s.k} className={"segbtn" + (src === s.k ? " segbtn--on" : "")} onClick={() => setSrc(s.k)}><I n={s.icon} s={14} />{s.vi}</button>
          ))}
        </div>
        <div className="fbfilters__chips">
          <button className={"fchip" + (type === "all" ? " fchip--on" : "")} onClick={() => setType("all")}>Mọi loại</button>
          {Object.entries(FB_TYPE).map(([k, m]) => (
            <button key={k} className={"fchip" + (type === k ? " fchip--on" : "")} onClick={() => setType(k)}><I n={m.icon} s={12} />{m.vi}</button>
          ))}
        </div>
      </div>

      {/* grouped sections */}
      {groups.map((g) => {
        const isOpen = expanded[g.key];
        const CAP = 6;
        const shown = isOpen ? g.items : g.items.slice(0, CAP);
        const surge = g.key === "payment" && incident.active;
        return (
          <div key={g.key} id={"fbg-" + g.key} style={{ marginBottom: 22 }}>
            <div className="exgroup-h">
              <span className="fbsum__ic" style={{ width: 26, height: 26, borderRadius: 8, background: g.cat.soft, color: g.cat.text }}><I n={g.cat.icon} s={14} /></span>
              {g.cat.vi} <span className="muted" style={{ fontWeight: 600 }}>· {g.items.length}</span>
              {surge ? <span className="fbsurge"><I n="trending-up" s={11} /> đang tăng đột biến</span> : null}
            </div>
            <div className="card-grid">
              {shown.map((f) => <FbCard key={f.id} f={f} onOpen={setOpenId} />)}
            </div>
            {g.items.length > CAP ? (
              <button className="fbmore" onClick={() => setExpanded((e) => ({ ...e, [g.key]: !e[g.key] }))}>
                {isOpen ? <><I n="chevron-up" s={14} /> Thu gọn</> : <><I n="chevron-down" s={14} /> Xem tất cả {g.items.length} mục</>}
              </button>
            ) : null}
          </div>
        );
      })}
      {groups.length === 0 ? <div className="empty-hint" style={{ height: 120 }}><I n="inbox" s={18} /> Không có phản hồi khớp bộ lọc</div> : null}

      {/* drawer */}
      <div className={"scrim" + (open ? " scrim--on" : "")} onClick={() => setOpenId(null)}></div>
      {open ? <FeedbackDrawer f={open} onClose={() => setOpenId(null)} onReclassify={reclassify} onResolve={resolve} onNavFinance={(ref) => { onNavFinance && onNavFinance(ref); }} /> : null}
    </div>
  );
}

Object.assign(window, { FeedbackPage });
