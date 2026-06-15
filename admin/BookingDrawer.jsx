// StateMachine — vertical stepper showing where the booking is (PRD §1.2)
function StateMachine({ b }) {
  const { FLOW, FLOW_LABEL, STATES, ago } = window.OPS;
  const curIdx = FLOW.indexOf(b.state);
  // terminal off-path states
  const terminal = ["CANCELLED", "DISPUTED"].includes(b.state);
  const effIdx = terminal ? FLOW.indexOf("ACCEPTED") : curIdx;

  return (
    <div className="smachine">
      {FLOW.map((s, i) => {
        const done = i < effIdx || b.state === "COMPLETED" && i <= curIdx;
        const active = i === effIdx && !terminal && b.state !== "COMPLETED";
        const isLast = i === FLOW.length - 1;
        const reached = i <= curIdx;
        return (
          <div className="sm-step" key={s}>
            <div className="sm-rail">
              <div className={"sm-node" + (done ? " sm-node--done" : active ? " sm-node--active" : "")}>
                {done ? <I n="check" s={12} /> : active ? <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }}></span> : null}
              </div>
              {!isLast ? <div className={"sm-line" + (i < effIdx ? " sm-line--done" : "")}></div> : null}
            </div>
            <div className={"sm-body" + (isLast ? " sm-body--last" : "")}>
              <div className={"sm-label" + (!reached && !active ? " sm-label--idle" : "")}>{FLOW_LABEL[s]}</div>
              {active ? <div className="sm-now">● Đang ở bước này</div> : reached ? <div className="sm-time">đã qua</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AssignedCard({ b }) {
  const { ktvById } = window.OPS;
  const k = ktvById(b.assigned);
  if (!k) return null;
  let timer = null;
  if (b.state === "EN_ROUTE") timer = { label: "ETA tới nơi", val: b.etaLeft + " phút", icon: "navigation", c: "var(--teal-600)" };
  else if (b.state === "ACCEPTED") timer = { label: "Dự kiến khởi hành", val: b.etaLeft + " phút", icon: "clock", c: "var(--teal-500)" };
  else if (b.state === "IN_PROGRESS") timer = { label: "Còn lại buổi", val: b.sessionLeft + " phút", icon: "timer", c: "var(--mint-500)" };

  return (
    <div className="dsec">
      <div className="dsec__t"><I n="user-check" s={14} /> KTV được ghép</div>
      <div className="row gap14" style={{ marginBottom: 12 }}>
        <Av name={k.name} status={k.status} size="lg" />
        <div style={{ flex: 1 }}>
          <div className="row gap6" style={{ marginBottom: 3 }}><b style={{ fontSize: 13.8 }}>{k.name}</b> <TierTag tier={k.tier} /></div>
          <div className="muted" style={{ fontSize: 10.8 }}>
            <I n="star" s={13} style={{ color: "var(--amber-500)", verticalAlign: -2 }} /> {k.rating} · {k.sessions} buổi · nhận {Math.round(k.accept * 100)}%
          </div>
        </div>
        <button className="icon-pill" title="Gọi KTV"><I n="phone" s={17} /></button>
        <button className="icon-pill" title="Nhắn tin"><I n="message-square" s={17} /></button>
      </div>
      {timer ? (
        <div className="row between" style={{ background: "var(--off-white)", borderRadius: 8, padding: "11px 14px" }}>
          <span className="row gap6 muted" style={{ fontSize: 10.8, fontWeight: 700 }}><I n={timer.icon} s={15} style={{ color: timer.c }} />{timer.label}</span>
          <b className="mono" style={{ fontSize: 15.5, color: timer.c }}>{timer.val}</b>
        </div>
      ) : null}
      {["EN_ROUTE", "ARRIVED", "IN_PROGRESS"].includes(b.state) ? (
        <div className="row gap6" style={{ marginTop: 11, fontSize: 10.3, fontWeight: 700, color: "var(--mint-600)" }}>
          <I n="shield-check" s={14} /> Giám sát an toàn đang bật · chia sẻ vị trí real-time
        </div>
      ) : null}
    </div>
  );
}

function BookingDrawer({ b, onClose, handlers, autopilot }) {
  const { STATES, SERVICES, priceOf, fmtMoney, ago } = window.OPS;
  const { Button } = window.NovaHostDesignSystem_d39808;
  if (!b) return null;
  const svc = SERVICES[b.serviceKey];
  const p = priceOf(b);

  return (
    <div className="drawer drawer--on">
      <div className="drawer__head">
        <div className="row between" style={{ marginBottom: 10 }}>
          <span className="drawer__id">{b.id} · {ago(b.createdAt)}</span>
          <button className="icon-pill" style={{ width: 34, height: 34, border: "none" }} onClick={onClose}><I n="x" s={18} /></button>
        </div>
        <div className="row between">
          <div className="row gap10">
            <Av name={b.cust} size="md" />
            <div>
              <div style={{ fontSize: 14.6, fontWeight: 800, letterSpacing: "-.01em" }}>{b.cust}</div>
              <div className="muted" style={{ fontSize: 10.8 }}>{svc.vi} · {b.dur} phút · {b.region}</div>
            </div>
          </div>
          <StatePill state={b.state} />
        </div>
      </div>

      <div className="drawer__body">
        {/* exception — tailored edge-case resolution, shown first */}
        {b.exception ? <ExceptionPanel b={b} onResolve={handlers.resolve} onHold={handlers.holdAi} autopilot={autopilot} /> : null}

        {/* state machine */}
        <div className="dsec">
          <div className="dsec__t"><I n="git-commit-horizontal" s={14} /> Trạng thái đơn</div>
          <StateMachine b={b} />
        </div>

        {/* matching OR assigned OR terminal */}
        {b.state === "MATCHING" ? (
          <MatchingPanel b={b} onAssign={handlers.assign} onSkip={handlers.skip} onExpand={handlers.expand} actions={{ manual: handlers.manual }} />
        ) : null}

        {["ACCEPTED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(b.state) ? <AssignedCard b={b} /> : null}

        {b.state === "CANCELLED" ? (
          <div className="dsec">
            <div className="dsec__t" style={{ color: "var(--text-secondary)" }}><I n="x-circle" s={14} /> Đơn đã hủy</div>
            <p style={{ margin: 0, fontSize: 11.6, fontWeight: 600, color: "var(--text-secondary)" }}>{b.cancelReason}</p>
          </div>
        ) : null}

        {/* customer trust */}
        <div className="dsec">
          <div className="dsec__t"><I n="user-round" s={14} /> Khách hàng</div>
          <div className="kv"><span className="kv__k"><I n="shield" /> Trust score</span>
            <span className="kv__v"><span className="trust" style={{ color: trustColor(b.trust) }}>
              <span className="trust__bar"><span className="trust__fill" style={{ width: b.trust + "%", background: trustColor(b.trust) }}></span></span>{b.trust}
            </span></span>
          </div>
          <div className="kv"><span className="kv__k"><I n="map-pin" /> Địa chỉ</span><span className="kv__v">{b.addr}</span></div>
          {b.note ? <div className="kv"><span className="kv__k"><I n="sticky-note" /> Ghi chú</span><span className="kv__v" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{b.note}</span></div> : null}
        </div>

        {/* price */}
        <div className="dsec">
          <div className="dsec__t"><I n="receipt" s={14} /> Thanh toán</div>
          <div className="pricebox">
            <div className="priceln"><span>Giá gốc · {svc.vi} {b.dur}'</span><span>{fmtMoney(p.base)}</span></div>
            {p.surge > 1 ? <div className="priceln"><span className="surge-tag">Phụ phí surge {p.surge}×</span><span className="surge-tag">+{fmtMoney(p.surgeAmt)}</span></div> : null}
            <div className="priceln priceln--total"><span>Tổng (auth)</span><span>{fmtMoney(p.total)}</span></div>
          </div>
          <div className="row gap6" style={{ marginTop: 9, fontSize: 9.9, fontWeight: 600, color: "var(--text-tertiary)" }}>
            <I n="lock" s={13} /> Đã giữ tiền lúc CREATED · capture khi COMPLETED
          </div>
        </div>
      </div>

      {b.state === "MATCHING" ? (
        <div className="drawer__actions">
          <button className="lull-btn lull-btn--ghost" style={{ flex: 1, color: "var(--crimson-600)" }} onClick={() => handlers.cancel(b.id)}><I n="x" s={16} /> Hủy đơn</button>
          <button className="lull-btn lull-btn--primary" style={{ flex: 1.6 }} onClick={() => handlers.reschedule(b.id)}><I n="calendar-clock" s={16} /> Đề nghị hẹn lại</button>
        </div>
      ) : null}
    </div>
  );
}

window.BookingDrawer = BookingDrawer;
