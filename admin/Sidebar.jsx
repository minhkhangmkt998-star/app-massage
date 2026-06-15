// Sidebar — Lull Ops navigation
function Sidebar({ active, onNav, counts, collapsed, onToggle }) {
  const tr = window.tr;
  const groups = [
    {
      label: "Vận hành",
      items: [
        { key: "dispatch", vi: "Điều phối", icon: "radio", count: counts.bookings },
        { key: "exceptions", vi: "Ngoại lệ", icon: "triangle-alert", count: counts.exceptions, alert: true },
        { key: "matching", vi: "Logic ghép nối", icon: "git-merge" },
      ],
    },
    {
      label: "Mạng lưới",
      items: [
        { key: "ktv", vi: "KTV", icon: "users" },
        { key: "reposition", vi: "Tái phân bổ", icon: "navigation", count: counts.idle },
        { key: "feedback", vi: "Phản hồi & Góp ý", icon: "messages-square", count: counts.feedback, alert: counts.feedbackAlert },
        { key: "kyc", vi: "Duyệt KYC", icon: "badge-check", count: counts.kyc },
        { key: "customers", vi: "Khách hàng", icon: "user-round" },
      ],
    },
    {
      label: "An toàn & Giá",
      items: [
        { key: "sos", vi: "An toàn / SOS", icon: "shield-alert", count: counts.sos, alert: true },
        { key: "disputes", vi: "Phân xử tranh chấp", icon: "gavel", count: counts.disputes, alert: true },
        { key: "surge", vi: "Surge & Giá", icon: "trending-up" },
        { key: "finance", vi: "Đối soát", icon: "wallet" },
      ],
    },
  ];

  return (
    <aside className={"side" + (collapsed ? " side--collapsed" : "")}>
      <div className="side__brand">
        <div className="side__mark"><I n="flower-2" s={19} /></div>
        <div className="side__wordmark">lull<span>OPS CONSOLE</span></div>
        <button className="side__collapse" onClick={onToggle} title={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"} aria-label="Thu gọn thanh bên">
          <span className="side__collapse-exp"><I n="chevrons-left" s={16} /></span>
          <span className="side__collapse-col"><I n="chevrons-right" s={16} /></span>
        </button>
      </div>

      <nav className="side__nav">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="side__group-label">{tr(g.label)}</div>
            {g.items.map((it) => (
              <button
                key={it.key}
                className={"nav-item" + (active === it.key ? " nav-item--active" : "")}
                onClick={() => onNav(it.key)}
                title={collapsed ? tr(it.vi) : undefined}
              >
                <span className="nav-item__ic">
                  <I n={it.icon} s={18} />
                  {it.count ? <span className={"nav-item__dot" + (it.alert ? " nav-item__dot--alert" : "")}></span> : null}
                </span>
                <span className="nav-item__label">{tr(it.vi)}</span>
                {it.count ? (
                  <span className={"nav-item__count" + (it.alert ? "" : " nav-item__count--mut")}>{it.count}</span>
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="side__user" title={collapsed ? "Mai Trí Dũng · Điều phối" : undefined}>
        <Av name="Mai Trí Dũng" status="online" size="sm" />
        <div className="side__user-meta" style={{ minWidth: 0 }}>
          <b>Mai Trí Dũng</b>
          <span>{tr("Điều phối · HCM")}</span>
        </div>
        <I n="chevron-up" s={16} style={{ marginLeft: "auto", color: "var(--text-tertiary)" }} />
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
