// ============================================================
// Lull Ops Console — main app + live dispatch simulation
// ============================================================
const { useState, useEffect, useRef, useCallback } = React;
const DS = window.NovaHostDesignSystem_d39808;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "simSpeed": 1,
  "mapSide": "right",
  "density": "comfortable",
  "showScores": true
}/*EDITMODE-END*/;

// pool of customers that can stream in as new bookings
const NEW_CUSTOMERS = [
  { cust: "Châu Khải Minh", region: "Quận 1", x: 38, y: 28, serviceKey: "swedish" },
  { cust: "Lâm Thuý Vy", region: "Quận 3", x: 56, y: 34, serviceKey: "deep" },
  { cust: "Đoàn Hữu Phúc", region: "Phú Nhuận", x: 68, y: 52, serviceKey: "thai" },
  { cust: "Mai Tuyết Nhi", region: "Bình Thạnh", x: 48, y: 70, serviceKey: "foot" },
  { cust: "Trịnh Bá Lộc", region: "Quận 7", x: 80, y: 66, serviceKey: "hot" },
];
const SVC_PRICE = { thai: 300, deep: 360, swedish: 420, foot: 240, hot: 450, sports: 340 };

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState("dispatch");
  const [bookings, setBookings] = useState(() => window.OPS.BOOKINGS.map((b) => ({ ...b })));
  const [selId, setSelId] = useState(null);
  const [dispId, setDispId] = useState(null);
  const [statFilter, setStatFilter] = useState("all");
  const [chipFilter, setChipFilter] = useState("all");
  const [clock, setClock] = useState(() => new Date());
  const [region, setRegion] = useState("Tất cả khu vực");
  const [toast, setToast] = useState(null);
  const [autopilot, setAutopilot] = useState(false);
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("lull_lang") === "en" ? "en" : "vi"; } catch (e) { return "vi"; } });
  window.I18N.lang = lang;
  const changeLang = (lng) => { setLang(lng); try { localStorage.setItem("lull_lang", lng); } catch (e) {} };
  const tr = window.tr;
  const [financeFocus, setFinanceFocus] = useState(null);
  const [confirmEl, askConfirm] = window.useConfirm();
  const [sideCollapsed, setSideCollapsed] = useState(() => { try { return localStorage.getItem("lull_side_collapsed") === "1"; } catch (e) { return false; } });
  const toggleSide = () => setSideCollapsed((c) => { const nv = !c; try { localStorage.setItem("lull_side_collapsed", nv ? "1" : "0"); } catch (e) {} return nv; });
  const [aiHandled, setAiHandled] = useState(0);
  const autopilotRef = useRef(false);
  useEffect(() => { autopilotRef.current = autopilot; }, [autopilot]);
  const AUTO_DELAY = 6;

  const { OPS } = window;

  // ---- clock ----
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- icon refresh ----
  useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const flash = useCallback((msg, tone = "ok") => {
    setToast({ msg, tone, id: Date.now() });
    setTimeout(() => setToast((x) => (x && Date.now() - x.id >= 2600 ? null : x)), 2700);
  }, []);

  // ---- simulation tick ----
  useEffect(() => {
    if (t.simSpeed === 0) return;
    const interval = 1000 / t.simSpeed;
    const id = setInterval(() => {
      setBookings((prev) => {
        const justAi = [];
        let next = prev.map((b) => {
          const nb = { ...b };
          if (nb.exception) {
            // AI Auto-pilot: count down + auto-resolve low-risk cases
            if (autopilotRef.current && !nb.aiHold) {
              const rec = OPS.aiRecommend(nb);
              if (rec && rec.auto) {
                nb.aiCountdown = (typeof nb.aiCountdown === "number" ? nb.aiCountdown : AUTO_DELAY) - 1;
                if (nb.aiCountdown <= 0) {
                  justAi.push({ id: nb.id, action: rec.action });
                  return OPS.applyResolution(nb, rec.action);
                }
                return nb;
              }
            }
            return nb; // frozen pending human resolution
          }
          if (nb.state === "MATCHING") {
            const cands = nb.candidates || [];
            const cur = cands[nb.offerIdx];
            if (cur) {
              // chance the current KTV accepts
              const pAccept = 0.10 * cur.ktv.accept;
              if (Math.random() < pAccept) {
                nb.state = "ACCEPTED";
                nb.assigned = cur.ktv.id;
                nb.etaLeft = Math.max(6, cur.eta - 4);
                nb.responses = { ...nb.responses, [cur.ktv.id]: "accepted" };
                return nb;
              }
              nb.ttl = (nb.ttl || 15) - 1;
              if (nb.ttl <= 0) {
                nb.responses = { ...nb.responses, [cur.ktv.id]: "declined" };
                nb.offerIdx = nb.offerIdx + 1;
                nb.ttl = 15;
              } else {
                nb.responses = { ...nb.responses };
              }
            }
          } else if (nb.state === "ACCEPTED") {
            nb.etaLeft = (nb.etaLeft ?? 20) - 1;
            if (nb.etaLeft <= 0) { nb.state = "EN_ROUTE"; nb.etaLeft = 9; }
          } else if (nb.state === "EN_ROUTE") {
            nb.etaLeft = (nb.etaLeft ?? 9) - 1;
            if (nb.etaLeft <= 0) { nb.state = "ARRIVED"; nb.arrivedHold = 3; }
          } else if (nb.state === "ARRIVED") {
            nb.arrivedHold = (nb.arrivedHold ?? 3) - 1;
            if (nb.arrivedHold <= 0) { nb.state = "IN_PROGRESS"; nb.sessionLeft = Math.round(nb.dur / 3); }
          } else if (nb.state === "IN_PROGRESS") {
            nb.sessionLeft = (nb.sessionLeft ?? 20) - 1;
            if (nb.sessionLeft <= 0) nb.state = "COMPLETED";
          }
          return nb;
        });
        if (justAi.length) {
          // defer side-effects out of the updater
          setTimeout(() => {
            setAiHandled((n) => n + justAi.length);
            flash("🤖 AI tự xử lý: " + justAi[0].action + (justAi.length > 1 ? ` +${justAi.length - 1}` : ""), "ok");
          }, 0);
        }
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [t.simSpeed]);

  // ---- occasionally spawn a new booking ----
  useEffect(() => {
    if (t.simSpeed === 0) return;
    const id = setInterval(() => {
      setBookings((prev) => {
        const matchingCount = prev.filter((b) => b.state === "MATCHING").length;
        if (matchingCount >= 4) return prev;
        const c = NEW_CUSTOMERS[Math.floor(Math.random() * NEW_CUSTOMERS.length)];
        const maxId = prev.reduce((m, b) => Math.max(m, parseInt(b.id.replace("LB-", ""), 10) || 0), 4880);
        const newId = "LB-" + (maxId + 1);
        const surge = Math.random() < 0.25 ? 1.3 : 1.0;
        const nb = {
          id: newId, cust: c.cust, trust: 60 + Math.floor(Math.random() * 38),
          serviceKey: c.serviceKey, dur: [60, 90, 120][Math.floor(Math.random() * 3)],
          state: "MATCHING", region: c.region, x: c.x, y: c.y,
          addr: "Địa chỉ khách · " + c.region, base: SVC_PRICE[c.serviceKey], surge,
          createdAt: new Date(), affinity: [], offerIdx: 0, ttl: 15, responses: {},
        };
        nb.candidates = OPS.candidatesFor(nb);
        if (!nb.candidates.length) return prev; // no eligible KTV → skip
        return [nb, ...prev];
      });
    }, 14000 / t.simSpeed);
    return () => clearInterval(id);
  }, [t.simSpeed]);

  const selected = bookings.find((b) => b.id === selId) || null;
  const selectedDispute = OPS.DISPUTES.find((d) => d.id === dispId) || null;
  const ruleDispute = (id, ruling) => {
    const toneMap = { client: "warn", ktv: "primary", neutral: "primary" };
    const moneyNote = {
      refund_full: "Hoàn 100% tiền cho khách, không thu của KTV.",
      refund_half: "Chia đôi: hoàn 50% cho khách, KTV nhận 50%.",
      deny: "Bác yêu cầu — không hoàn tiền, KTV nhận đủ payout.",
      warn_client: "Gửi cảnh cáo chính thức tới khách, lưu hồ sơ.",
      warn_ktv: "Gửi cảnh cáo chính thức tới KTV, ảnh hưởng hạng & điểm tin cậy.",
      escalate: "Chuyển hồ sơ sang đội Trust & Safety điều tra sâu.",
    };
    askConfirm({
      tone: ruling.tone === "ktv" ? "primary" : ruling.tone === "client" ? "warn" : "primary",
      icon: ruling.icon || "gavel", title: "Phán quyết: " + ruling.vi,
      message: "Bạn sắp ra phán quyết cuối cùng cho tranh chấp " + id + ". Đây là quyết định ràng buộc.",
      detail: [moneyNote[ruling.key] || ruling.vi],
      impact: "Phán quyết ràng buộc, ghi log kèm danh tính người xử lý; payout & tài khoản hai bên cập nhật theo.",
      confirmLabel: "Chốt phán quyết", confirmIcon: "gavel",
      onConfirm: () => {
        flash("⚖️ Đã phán quyết " + id + ": " + ruling.vi, ruling.tone === "client" ? "warn" : "ok");
        setDispId(null);
      },
    });
  };

  // ---- manual handlers ----
  const handlers = {
    assign: (bid, ktvId) => {
      setBookings((prev) => prev.map((b) => {
        if (b.id !== bid) return b;
        const cand = (b.candidates || []).find((c) => c.ktv.id === ktvId);
        return { ...b, state: "ACCEPTED", assigned: ktvId, etaLeft: cand ? Math.max(6, cand.eta - 3) : 18, responses: { ...b.responses, [ktvId]: "accepted" } };
      }));
      flash("Đã gán KTV thủ công — đơn chuyển sang Đã nhận");
    },
    skip: (bid) => {
      setBookings((prev) => prev.map((b) => {
        if (b.id !== bid || b.state !== "MATCHING") return b;
        const cur = (b.candidates || [])[b.offerIdx];
        return { ...b, offerIdx: b.offerIdx + 1, ttl: 15, responses: cur ? { ...b.responses, [cur.ktv.id]: "declined" } : b.responses };
      }));
      flash("Bỏ qua KTV hiện tại — chuyển ứng viên kế tiếp", "warn");
    },
    expand: (bid) => {
      setBookings((prev) => prev.map((b) => (b.id === bid ? { ...b, ttl: Math.min(20, (b.ttl || 15) + 8) } : b)));
      flash("Đã mở rộng bán kính tìm kiếm +2km");
    },
    manual: (bid) => {
      setBookings((prev) => prev.map((b) => {
        if (b.id !== bid) return b;
        const top = (b.candidates || [])[0];
        if (!top) return b;
        return { ...b, state: "ACCEPTED", assigned: top.ktv.id, etaLeft: Math.max(6, top.eta - 3), responses: { ...b.responses, [top.ktv.id]: "accepted" } };
      }));
      flash("Ops can thiệp — gán KTV điểm cao nhất");
    },
    cancel: (bid) => {
      askConfirm({
        tone: "danger", icon: "x-circle", title: "Huỷ đơn " + bid + "?",
        message: "Đơn sẽ chuyển sang trạng thái đã huỷ và hoàn lại tiền đang giữ cho khách. Không thể hoàn tác.",
        impact: "Khách sẽ nhận thông báo huỷ. Quyết định được ghi log.",
        confirmLabel: "Huỷ đơn", confirmIcon: "x",
        onConfirm: () => {
          setBookings((prev) => prev.map((b) => (b.id === bid ? { ...b, state: "CANCELLED", cancelReason: "Ops hủy đơn — hoàn tiền giữ" } : b)));
          flash("Đã hủy đơn", "warn");
        },
      });
    },
    reschedule: (bid) => {
      askConfirm({
        tone: "warn", icon: "calendar-clock", title: "Đề nghị khách hẹn lại?",
        message: "Đơn hiện tại sẽ được đóng và gửi đề nghị chọn khung giờ khác cho khách.",
        confirmLabel: "Gửi đề nghị", confirmIcon: "send",
        onConfirm: () => {
          setBookings((prev) => prev.map((b) => (b.id === bid ? { ...b, state: "CANCELLED", cancelReason: "Đề nghị khách hẹn lại khung giờ khác" } : b)));
          flash("Đã gửi đề nghị hẹn lại cho khách");
        },
      });
    },
    resolve: (bid, label, exType) => {
      const L = label.toLowerCase();
      const destructive = L.includes("hủy") || L.includes("chặn") || L.includes("no-show") || L.includes("phạt");
      const doResolve = () => {
        setBookings((prev) => prev.map((b) => {
          if (b.id !== bid) return b;
          const nb = { ...b }; delete nb.exception;
          if (L.includes("hủy") || L.includes("chặn")) {
            nb.state = "CANCELLED"; nb.cancelReason = "Ops xử lý ngoại lệ — " + label;
          } else if (L.includes("ghép lại") || L.includes("ưu tiên ghép") || L.includes("gán ops") || L.includes("thay thế") || L.includes("mở rộng") || L.includes("đánh thức") || L.includes("tăng thưởng") || L.includes("điều ktv") || L.includes("hàng đợi")) {
            nb.state = "MATCHING"; nb.offerIdx = 0; nb.ttl = 15; nb.responses = {}; delete nb.assigned;
            nb.candidates = OPS.candidatesFor(nb);
          } else if (L.includes("thử lại thanh toán") || L.includes("đổi phương thức")) {
            nb.state = "MATCHING"; nb.offerIdx = 0; nb.ttl = 15; nb.responses = {};
            nb.candidates = OPS.candidatesFor(nb);
          } else if (L.includes("trả trước") || L.includes("xác minh")) {
            nb.state = "MATCHING"; nb.offerIdx = 0; nb.ttl = 15; nb.responses = {};
            nb.candidates = OPS.candidatesFor(nb);
          } else if (L.includes("no-show") || L.includes("phạt")) {
            nb.state = "CANCELLED"; nb.cancelReason = "Ops xử lý — " + label;
          }
          return nb;
        }));
        flash("✓ " + label, "ok");
      };
      if (destructive) {
        askConfirm({
          tone: "danger", icon: "alert-triangle", title: "Xác nhận: " + label,
          message: "Thao tác này ảnh hưởng đến đơn " + bid + " và có thể phát sinh hoàn tiền / phí phạt / chặn tài khoản.",
          impact: "Quyết định được ghi log kèm danh tính người xử lý.",
          confirmLabel: label, onConfirm: doResolve,
        });
      } else { doResolve(); }
    },
    holdAi: (bid) => {
      setBookings((prev) => prev.map((b) => (b.id === bid ? (() => { const nb = { ...b, aiHold: true }; delete nb.aiCountdown; return nb; })() : b)));
      flash("Đã giữ lại — Ops sẽ tự xử lý", "warn");
    },
  };

  const toggleAuto = () => {
    setAutopilot((on) => {
      const nv = !on;
      if (!nv) setBookings((prev) => prev.map((b) => { if (typeof b.aiCountdown !== "number") return b; const nb = { ...b }; delete nb.aiCountdown; return nb; }));
      flash(nv ? "🤖 AI Auto-pilot BẬT — tự xử lý case rủi ro thấp" : "AI Auto-pilot TẮT", nv ? "ok" : "warn");
      return nv;
    });
  };

  const onlineKtv = OPS.KTV.filter((k) => k.status !== "offline").length;
  const counts = {
    bookings: bookings.filter((b) => !["COMPLETED", "CANCELLED"].includes(b.state)).length,
    exceptions: bookings.filter((b) => b.exception).length,
    disputes: OPS.DISPUTES.length, kyc: 4, sos: 1,
    idle: OPS.repoCandidates().filter((r) => r.eligible).length,
    feedback: OPS.FEEDBACK.filter((f) => f.category === "payment" && f.min <= 60).length || OPS.FEEDBACK.filter((f) => f.autoLow).length,
    feedbackAlert: OPS.detectPaymentIncident(OPS.FEEDBACK).active,
  };

  const TITLES = {
    dispatch: { t: "Trung tâm điều phối", s: "Theo dõi, can thiệp & quản lý vòng đời đơn theo thời gian thực" },
    bookings: { t: "Đơn hàng", s: "Toàn bộ vòng đời đơn theo state machine" },
    exceptions: { t: "Ngoại lệ", s: "Edge case & tình huống cần Ops can thiệp" },
    disputes: { t: "Phân xử tranh chấp", s: "Ca khó · lời khai mâu thuẫn · AI cố vấn, người quyết" },
    matching: { t: "Logic ghép nối", s: "Thuật toán & trọng số chấm điểm KTV" },
    ktv: { t: "Mạng lưới KTV", s: null },
    reposition: { t: "Tái phân bổ KTV", s: "Điều hướng KTV nhàn rỗi tới vùng cầu cao" },
    feedback: { t: "Phản hồi & Góp ý", s: "Tiếng nói khách & KTV · AI tự phân loại" },
    kyc: { t: "Duyệt KYC", s: null },
    sos: { t: "An toàn / SOS", s: null },
    surge: { t: "Surge & Giá", s: null },
    customers: { t: "Khách hàng", s: "Hồ sơ & lịch sử giao dịch khách hàng" },
    finance: { t: "Tài chính & Đối soát", s: "Dòng tiền · doanh thu · payout KTV" },
  };

  const isDispatch = route === "dispatch" || route === "bookings";

  const renderDispatch = () => (
    <div className={"dispatch" + (t.mapSide === "left" ? " dispatch--mapleft" : "")}>
      <div className="dispatch__inner">
        <window.ExceptionAlertBar bookings={bookings} onShow={() => setRoute("exceptions")} />
        <window.StatStrip bookings={bookings} filter={statFilter} onFilter={setStatFilter} />
        <window.QueueColumn
          bookings={bookings}
          statFilter={statFilter} onStatFilter={setStatFilter}
          chipFilter={chipFilter} onChipFilter={setChipFilter}
          selectedId={selId} onSelect={setSelId} autopilot={autopilot}
        />
        <window.LiveMap bookings={bookings} selectedId={selId} onSelectBooking={setSelId} />
      </div>
    </div>
  );

  const renderPage = () => {
    if (route === "matching") return <window.MatchingLogicPage />;
    if (route === "exceptions") return <window.ExceptionsPage bookings={bookings} onSelect={setSelId} onResolve={handlers.resolve} onHold={handlers.holdAi} autopilot={autopilot} onToggleAuto={toggleAuto} aiHandled={aiHandled} />;
    if (route === "ktv") return <window.KtvNetworkPage />;
    if (route === "reposition") return <window.RepositionPage onSend={(id, zone) => { const k = OPS.ktvById(id); flash("📤 Đã gửi đề xuất di chuyển cho " + (k ? k.name : id) + " → " + zone); }} />;
    if (route === "feedback") return <window.FeedbackPage onToast={(m) => flash(m)} onNavFinance={(ref) => { setFinanceFocus(ref ? { ...ref, at: Date.now() } : null); setRoute("finance"); flash(ref ? "→ Mở Đối soát cho " + ref.id : "→ Mở Đối soát"); }} />;
    if (route === "kyc") return <window.KycPage />;
    if (route === "sos") return <window.SosPage />;
    if (route === "disputes") return <window.DisputesPage onSelect={setDispId} />;
    if (route === "surge") return <window.SurgePage />;
    if (route === "customers") return <window.CustomersPage />;
    if (route === "finance") return <window.FinancePage askConfirm={askConfirm} onToast={(m, tone) => flash(m, tone)} focusRef={financeFocus} onClearFocus={() => setFinanceFocus(null)} />;
    return null;
  };

  const meta = TITLES[route] || { t: "Lull Ops", s: null };
  const localeTag = lang === "en" ? "en-GB" : "vi-VN";

  // Payout approval triggered from the bottom bar (Finance) — reuses step-up verify.
  const payoutApproveAll = () => {
    const q = OPS.FIN_PAYOUT_QUEUE;
    askConfirm({
      title: tr("Duyệt chi toàn bộ payout đang chờ?"),
      message: tr("Chi") + " " + OPS.fmtVnd(q.total) + " " + tr("cho") + " " + q.count.toLocaleString("vi-VN") + " " + tr("khoản"),
      tone: "primary", icon: "send",
      impact: tr("Đây là thao tác hàng loạt — tiền chuyển ngay vào ví tất cả KTV đủ điều kiện."),
      confirmLabel: tr("Duyệt chi"), confirmIcon: "check-check",
      verify: { reason: tr("Chi hàng loạt ") + OPS.fmtVnd(q.total) + tr(" — rủi ro rất cao nếu tài khoản bị chiếm quyền. Nhập mã 6 số từ ứng dụng xác thực để xác minh lại danh tính trước khi chi.") },
      onConfirm: () => flash("✓ " + tr("Đã duyệt chi") + " " + OPS.fmtVnd(q.total) + " " + tr("cho") + " " + q.count.toLocaleString("vi-VN") + " " + tr("khoản")),
    });
  };

  return (
    <div className={"ops" + (sideCollapsed ? " ops--side-collapsed" : "") + (t.density === "compact" ? "" : "")} data-density={t.density === "compact" ? "compact" : "comfortable"}>
      <window.Sidebar active={route} onNav={(k) => { setRoute(k); setSelId(null); setDispId(null); if (k !== "finance") setFinanceFocus(null); }} counts={counts} collapsed={sideCollapsed} onToggle={toggleSide} />
      <div className="main">
        <window.Topbar
          title={tr(meta.t)} sub={meta.s ? tr(meta.s) : null}
          region={region} onRegion={setRegion}
          onlineKtv={onlineKtv}
          autopilot={autopilot} onToggleAuto={toggleAuto}
          lang={lang} onLang={changeLang}
          clock={clock.toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        />
        {isDispatch
          ? renderDispatch()
          : <div key={route} className="route-view">{renderPage()}</div>
        }
        <window.StatusBar
          route={route} counts={counts} onlineKtv={onlineKtv}
          autopilot={autopilot} toggleAuto={toggleAuto}
          clock={clock.toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit" })}
          nav={(k) => { setRoute(k); setSelId(null); setDispId(null); if (k !== "finance") setFinanceFocus(null); }}
          onPayout={payoutApproveAll}
        />
      </div>

      {/* drawer */}
      <div className={"scrim" + (selected || selectedDispute ? " scrim--on" : "")} onClick={() => { setSelId(null); setDispId(null); }}></div>
      {selected ? <window.BookingDrawer b={selected} onClose={() => setSelId(null)} handlers={handlers} autopilot={autopilot} /> : null}
      {selectedDispute ? <window.DisputeDrawer d={selectedDispute} onClose={() => setDispId(null)} onRule={ruleDispute} /> : null}

      {/* confirm dialog — bước xác nhận thao tác quan trọng */}
      {confirmEl}

      {/* toast */}
      {toast ? (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 80,
          background: "var(--teal-900)", color: "#fff", padding: "12px 18px", borderRadius: 8, fontSize: 11.6, fontWeight: 700,
          boxShadow: "var(--elevation-2)", display: "flex", alignItems: "center", gap: 9 }}>
          <i data-lucide={toast.tone === "warn" ? "alert-triangle" : "check-circle-2"} style={{ width: 17, height: 17, color: toast.tone === "warn" ? "var(--amber-500)" : "var(--mint-500)" }}></i>
          {toast.msg}
        </div>
      ) : null}

      {/* Tweaks */}
      <window.TweaksPanel>
        <window.TweakSection label="Mô phỏng" />
        <window.TweakRadio label="Tốc độ" value={String(t.simSpeed)}
          options={["0", "1", "2", "3"]}
          onChange={(v) => setTweak("simSpeed", Number(v))} />
        <window.TweakSection label="Bố cục" />
        <window.TweakRadio label="Vị trí bản đồ" value={t.mapSide}
          options={["left", "right"]}
          onChange={(v) => setTweak("mapSide", v)} />
        <window.TweakRadio label={tr("Mật độ")} value={t.density}
          options={["comfortable", "compact"]}
          onChange={(v) => setTweak("density", v)} />
        <window.TweakSection label={tr("Ngôn ngữ")} />
        <window.TweakRadio label={tr("Ngôn ngữ")} value={lang}
          options={["vi", "en"]}
          onChange={changeLang} />
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
