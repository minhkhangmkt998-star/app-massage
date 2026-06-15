/* @ds-bundle: {"format":3,"namespace":"LullDesignSystem_488a52","components":[{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"}],"sourceHashes":{"components/display/Avatar.jsx":"e24df66b3862","components/display/Badge.jsx":"ddb8db3b0163","components/display/Card.jsx":"9156d26f5125","components/forms/Button.jsx":"8901f7cdb2b8","components/forms/Chip.jsx":"a8a687bf1b36","components/forms/IconButton.jsx":"4ad4d2f27867","components/forms/Input.jsx":"cf066e6f608e","components/forms/Switch.jsx":"f6c38a30e47e","components/navigation/BottomNav.jsx":"edccfec3b72c","ui_kits/client/HomeScreen.jsx":"fb7d76c8a219","ui_kits/client/ListScreen.jsx":"3d2047073f04","ui_kits/client/PhoneFrame.jsx":"bd4e59e51aa6","ui_kits/client/TherapistScreen.jsx":"b2e9f26ef098","ui_kits/client/TrackingScreen.jsx":"90c8e123289b","ui_kits/client/data.js":"c1de6abb42f9","ui_kits/provider/EarningsScreen.jsx":"3bbd66e1756c","ui_kits/provider/JobDetailScreen.jsx":"782b6d25772b","ui_kits/provider/JobsScreen.jsx":"510e25a4ab8f","ui_kits/provider/PhoneFrame.jsx":"bd4e59e51aa6","ui_kits/provider/ScheduleScreen.jsx":"3e5e2cd7efaa","ui_kits/provider/data.js":"c451881ad344"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LullDesignSystem_488a52 = window.LullDesignSystem_488a52 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Circular avatar with image or initials, optional status dot. */
function Avatar({
  src,
  name = "",
  size = "md",
  status,
  className = "",
  ...rest
}) {
  const initials = name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const classes = ["lull-avatar", `lull-avatar--${size}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", null, initials), status && /*#__PURE__*/React.createElement("span", {
    className: `lull-avatar__status lull-avatar__status--${status}`
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small status / category label. */
function Badge({
  variant = "neutral",
  dot = false,
  className = "",
  children,
  ...rest
}) {
  const classes = ["lull-badge", `lull-badge--${variant}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: classes
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "lull-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Surface container with soft elevation and 16px radius. */
function Card({
  interactive = false,
  flush = false,
  className = "",
  children,
  ...rest
}) {
  const classes = ["lull-card", interactive ? "lull-card--interactive" : "", flush ? "lull-card--flush" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classes
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lull primary action button. Thumb-friendly 48px default height.
 * Styling lives in components.css (ships via styles.css).
 */
function Button({
  variant = "primary",
  size = "md",
  block = false,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = ["lull-btn", `lull-btn--${variant}`, size === "sm" ? "lull-btn--sm" : size === "lg" ? "lull-btn--lg" : "", block ? "lull-btn--block" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: classes,
    disabled: disabled
  }, rest), iconLeft, children != null && /*#__PURE__*/React.createElement("span", null, children), iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pill-shaped filter chip / tag. Selectable (toggle) or static. */
function Chip({
  selected = false,
  iconLeft = null,
  onToggle,
  static: isStatic = false,
  className = "",
  children,
  ...rest
}) {
  const classes = ["lull-chip", selected ? "lull-chip--selected" : "", isStatic ? "lull-chip--static" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: classes,
    "aria-pressed": isStatic ? undefined : selected,
    onClick: onToggle
  }, rest), iconLeft, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square, icon-only button. 44px tap target. */
function IconButton({
  variant = "plain",
  round = false,
  label,
  className = "",
  children,
  ...rest
}) {
  const classes = ["lull-iconbtn", variant === "filled" ? "lull-iconbtn--filled" : "", round ? "lull-iconbtn--round" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: classes,
    "aria-label": label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input with label, optional leading/trailing icon, and error state. */
function Input({
  label,
  hint,
  error,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  id,
  className = "",
  ...rest
}) {
  const fieldId = id || `lull-input-${Math.random().toString(36).slice(2, 8)}`;
  const wrapClasses = ["lull-field", error ? "lull-field--error" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: wrapClasses
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "lull-field__label",
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "lull-field__control",
    "aria-disabled": disabled || undefined
  }, iconLeft, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    className: "lull-input",
    disabled: disabled,
    "aria-invalid": error ? true : undefined
  }, rest)), iconRight), (error || hint) && /*#__PURE__*/React.createElement("div", {
    className: "lull-field__hint"
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Accessible on/off toggle. */
function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  id,
  ...rest
}) {
  const sid = id || `lull-switch-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("label", {
    className: "lull-switch",
    htmlFor: sid
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: sid,
    type: "checkbox",
    role: "switch",
    checked: checked,
    onChange: e => onChange && onChange(e.target.checked),
    disabled: disabled,
    "aria-label": label
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "lull-switch__track"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lull-switch__thumb"
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
/**
 * Minimalist bottom tab bar. Active item colors Deep Teal.
 * `items`: [{ key, label, icon, badge }]. Pass an icon node per item.
 */
function BottomNav({
  items = [],
  value,
  onChange,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: ["lull-bottomnav", className].filter(Boolean).join(" "),
    role: "tablist"
  }, items.map(it => {
    const active = it.key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      type: "button",
      role: "tab",
      "aria-selected": active,
      className: ["lull-bottomnav__item", active ? "lull-bottomnav__item--active" : ""].filter(Boolean).join(" "),
      onClick: () => onChange && onChange(it.key)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        display: "inline-flex"
      }
    }, it.icon, it.badge ? /*#__PURE__*/React.createElement("span", {
      className: "lull-count",
      style: {
        position: "absolute",
        top: -6,
        right: -10
      }
    }, it.badge) : null), /*#__PURE__*/React.createElement("span", null, it.label));
  }));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client/HomeScreen.jsx
try { (() => {
// Home — greeting, search, service tiles, surge banner, nearby therapists.
function HomeScreen({
  go
}) {
  const {
    Card,
    Badge,
    Avatar,
    Chip,
    IconButton
  } = window.LullDesignSystem_488a52;
  const D = window.LULL_DATA;
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "scr scr--pad-b"
  }, /*#__PURE__*/React.createElement("div", {
    className: "greet"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "greet__hi"
  }, "Good evening"), /*#__PURE__*/React.createElement("div", {
    className: "greet__name"
  }, "Unwind, ", D.user.first, ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Notifications"
  }, /*#__PURE__*/React.createElement(I, {
    n: "bell"
  })), /*#__PURE__*/React.createElement("span", {
    className: "lull-count",
    style: {
      position: "absolute",
      top: 2,
      right: 2
    }
  }, "3"))), /*#__PURE__*/React.createElement("div", {
    className: "lull-field",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lull-field__control",
    style: {
      background: "var(--surface)",
      boxShadow: "var(--elevation-1)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "search",
    s: 20
  }), /*#__PURE__*/React.createElement("input", {
    className: "lull-input",
    placeholder: "Search therapist or service"
  }), /*#__PURE__*/React.createElement(I, {
    n: "sliders-horizontal",
    s: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "svc-grid"
  }, D.services.map(s => /*#__PURE__*/React.createElement("div", {
    className: "svc",
    key: s.key,
    onClick: () => go("list")
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc__ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: s.icon,
    s: 24
  })), /*#__PURE__*/React.createElement("div", {
    className: "svc__lbl"
  }, s.label)))), /*#__PURE__*/React.createElement("div", {
    className: "surge",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "surge__ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "zap",
    s: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15
    }
  }, "Evening calm, 20% off"), /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13
    }
  }, "Book before 8pm with code CALM20")), /*#__PURE__*/React.createElement(Badge, {
    variant: "solid-accent"
  }, "1.0\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "sec-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Therapists near you"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go("list")
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    className: "stack gap-md"
  }, D.therapists.slice(0, 3).map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    interactive: true,
    onClick: () => go("detail", t)
  }, /*#__PURE__*/React.createElement("div", {
    className: "tcard"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.name,
    size: "lg",
    status: t.status
  }), /*#__PURE__*/React.createElement("div", {
    className: "tcard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tcard__name"
  }, t.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "success"
  }, "\u2605 ", t.rating)), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta",
    style: {
      margin: "3px 0 10px"
    }
  }, t.tags.join(" · "), " \xB7 ", t.dist, " mi"), /*#__PURE__*/React.createElement("div", {
    className: "row between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tcard__meta row gap-sm",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "clock",
    s: 15
  }), " ", t.eta, " min away"), /*#__PURE__*/React.createElement("span", {
    className: "tcard__price"
  }, "$", t.price))))))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client/ListScreen.jsx
try { (() => {
// Browse list — filter chips + full therapist list.
function ListScreen({
  go
}) {
  const {
    Card,
    Badge,
    Avatar,
    Chip
  } = window.LullDesignSystem_488a52;
  const D = window.LULL_DATA;
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  const [filters, setFilters] = React.useState(["deep"]);
  const toggle = k => setFilters(f => f.includes(k) ? f.filter(x => x !== k) : [...f, k]);
  return /*#__PURE__*/React.createElement("div", {
    className: "scr scr--pad-b"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between",
    style: {
      padding: "4px 0 14px"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 22,
      fontWeight: 800
    }
  }, "Browse"), /*#__PURE__*/React.createElement("span", {
    className: "row gap-sm tcard__meta",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "map-pin",
    s: 16
  }), " Downtown")), /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm",
    style: {
      overflowX: "auto",
      paddingBottom: 4,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    selected: filters.includes("deep"),
    onToggle: () => toggle("deep")
  }, "Deep tissue"), /*#__PURE__*/React.createElement(Chip, {
    selected: filters.includes("thai"),
    onToggle: () => toggle("thai")
  }, "Thai"), /*#__PURE__*/React.createElement(Chip, {
    selected: filters.includes("swedish"),
    onToggle: () => toggle("swedish")
  }, "Swedish"), /*#__PURE__*/React.createElement(Chip, {
    selected: filters.includes("female"),
    onToggle: () => toggle("female"),
    iconLeft: /*#__PURE__*/React.createElement(I, {
      n: "venus",
      s: 16
    })
  }, "Female")), /*#__PURE__*/React.createElement("div", {
    className: "stack gap-md",
    style: {
      marginTop: 12
    }
  }, D.therapists.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    interactive: true,
    onClick: () => go("detail", t)
  }, /*#__PURE__*/React.createElement("div", {
    className: "tcard"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.name,
    size: "lg",
    status: t.status
  }), /*#__PURE__*/React.createElement("div", {
    className: "tcard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tcard__name"
  }, t.name), /*#__PURE__*/React.createElement("span", {
    className: "tcard__price"
  }, "$", t.price)), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta",
    style: {
      margin: "3px 0 10px"
    }
  }, t.tags.join(" · "), " \xB7 ", t.dist, " mi"), /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "success"
  }, "\u2605 ", t.rating), /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, t.eta, " min away"), t.status === "online" && /*#__PURE__*/React.createElement(Badge, {
    variant: "primary",
    dot: true
  }, "Available"))))))));
}
window.ListScreen = ListScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client/ListScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client/PhoneFrame.jsx
try { (() => {
// Shared phone shell: 390×844 frame with status bar + optional bottom nav slot.
function PhoneFrame({
  children,
  dark = false,
  bottomNav = null,
  scrollKey
}) {
  const ref = React.useRef(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "lull-phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__statusbar",
    "data-dark": dark || undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "lull-phone__time"
  }, "9:41"), /*#__PURE__*/React.createElement("span", {
    className: "lull-phone__notch"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lull-phone__icons"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "signal",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wifi",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "battery-full",
    style: {
      width: 20,
      height: 20
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__viewport",
    ref: ref,
    key: scrollKey
  }, children), bottomNav, /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__home"
  }));
}
window.PhoneFrame = PhoneFrame;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client/TherapistScreen.jsx
try { (() => {
// Therapist detail — hero, stats, bio, service + time selection, sticky Book CTA.
function TherapistScreen({
  go,
  therapist
}) {
  const {
    Button,
    Chip,
    Badge,
    IconButton,
    Avatar
  } = window.LullDesignSystem_488a52;
  const D = window.LULL_DATA;
  const t = therapist || D.therapists[0];
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  const [svc, setSvc] = React.useState("deep");
  const [slot, setSlot] = React.useState("18:30");
  const times = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];
  const disabled = ["17:00", "20:30"];
  const svcObj = D.services.find(s => s.key === svc) || D.services[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__viewport",
    style: {
      position: "absolute",
      inset: 0,
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-top"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Back",
    className: "glass-btn",
    round: true,
    onClick: () => go("home")
  }, /*#__PURE__*/React.createElement(I, {
    n: "chevron-left"
  })), /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Share",
    className: "glass-btn",
    round: true
  }, /*#__PURE__*/React.createElement(I, {
    n: "share-2"
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Favorite",
    className: "glass-btn",
    round: true
  }, /*#__PURE__*/React.createElement(I, {
    n: "heart"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "detail-id"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.name,
    size: "lg",
    status: t.status
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, t.name), /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm",
    style: {
      marginTop: 4,
      opacity: .92,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "row",
    style: {
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "star",
    s: 15
  }), " ", t.rating, " (", t.reviews, ")"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, t.years, " yrs")))), /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("b", null, t.dist, " mi"), /*#__PURE__*/React.createElement("span", null, "Distance")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("b", null, t.eta, " min"), /*#__PURE__*/React.createElement("span", null, "Arrives in")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("b", null, "$", t.price), /*#__PURE__*/React.createElement("span", null, "From / hr")))), /*#__PURE__*/React.createElement("div", {
    className: "scr"
  }, /*#__PURE__*/React.createElement("p", {
    className: "t-body-1",
    style: {
      marginTop: 4
    }
  }, t.bio), /*#__PURE__*/React.createElement("h2", {
    className: "t-h2",
    style: {
      margin: "20px 0 12px"
    }
  }, "Choose a service"), /*#__PURE__*/React.createElement("div", {
    className: "stack gap-sm"
  }, D.services.slice(0, 4).map(s => /*#__PURE__*/React.createElement("label", {
    key: s.key,
    className: "row between",
    style: {
      padding: "14px 16px",
      borderRadius: "var(--radius-md)",
      border: "1.5px solid " + (svc === s.key ? "var(--color-primary)" : "var(--color-border)"),
      background: svc === s.key ? "var(--color-primary-soft)" : "var(--surface)",
      cursor: "pointer"
    },
    onClick: () => setSvc(s.key)
  }, /*#__PURE__*/React.createElement("span", {
    className: "row gap-md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "svc__ic",
    style: {
      width: 38,
      height: 38
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: s.icon,
    s: 20
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 15
    }
  }, s.label), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "tcard__meta"
  }, s.dur, " min"))), /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--color-primary)"
    }
  }, "$", s.price)))), /*#__PURE__*/React.createElement("h2", {
    className: "t-h2",
    style: {
      margin: "22px 0 12px"
    }
  }, "Today \xB7 pick a time"), /*#__PURE__*/React.createElement("div", {
    className: "slot"
  }, times.map(tm => /*#__PURE__*/React.createElement("button", {
    key: tm,
    "data-on": slot === tm,
    disabled: disabled.includes(tm),
    onClick: () => setSlot(tm)
  }, tm))))), /*#__PURE__*/React.createElement("div", {
    className: "cta-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-bar__price"
  }, /*#__PURE__*/React.createElement("b", null, "$", svcObj.price), /*#__PURE__*/React.createElement("span", null, svcObj.label, " \xB7 ", slot)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    style: {
      flex: 1
    },
    onClick: () => go("tracking", {
      ...t,
      svc: svcObj,
      slot
    })
  }, "Book now")));
}
window.TherapistScreen = TherapistScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client/TherapistScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client/TrackingScreen.jsx
try { (() => {
// Tracking — booking confirmed, live map, ETA, therapist contact, SOS.
function TrackingScreen({
  go,
  therapist
}) {
  const {
    Button,
    Badge,
    Avatar,
    IconButton,
    Card
  } = window.LullDesignSystem_488a52;
  const D = window.LULL_DATA;
  const t = therapist || {
    ...D.therapists[0],
    svc: D.services[0],
    slot: "18:30"
  };
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "scr--pad-b",
    style: {
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between",
    style: {
      padding: "8px 20px 12px"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Back",
    onClick: () => go("home")
  }, /*#__PURE__*/React.createElement(I, {
    n: "chevron-left"
  })), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 16
    }
  }, "Your booking"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Help"
  }, /*#__PURE__*/React.createElement(I, {
    n: "circle-help"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 20px 14px",
      padding: "12px 16px",
      borderRadius: "var(--radius-md)",
      background: "var(--color-success-soft)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "var(--color-success)",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "check",
    s: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--mint-600)",
      fontSize: 14
    }
  }, "Booking confirmed"), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, t.svc?.label, " \xB7 Today ", t.slot))), /*#__PURE__*/React.createElement("div", {
    className: "map"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "map__roads",
    viewBox: "0 0 390 300",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-10 90 H400 M-10 210 H400 M90 -10 V310 M250 -10 V310",
    stroke: "#fff",
    "stroke-width": "14",
    opacity: ".7",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-10 90 H400 M-10 210 H400 M90 -10 V310 M250 -10 V310",
    stroke: "#cdddE0",
    "stroke-width": "2",
    fill: "none"
  })), /*#__PURE__*/React.createElement("svg", {
    className: "map__route",
    viewBox: "0 0 390 300",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M250 210 C250 150, 160 150, 130 90",
    stroke: "#0D5C75",
    "stroke-width": "5",
    "stroke-linecap": "round",
    "stroke-dasharray": "2 12",
    fill: "none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "map__pin",
    style: {
      left: 130,
      top: 90
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin"
  })), /*#__PURE__*/React.createElement("div", {
    className: "map__me",
    style: {
      left: 250,
      top: 210
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 250,
      top: 226,
      transform: "translateX(-50%)",
      fontSize: 11,
      fontWeight: 700,
      color: "var(--text-secondary)"
    }
  }, "You")), /*#__PURE__*/React.createElement(Card, {
    className: "eta-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, "Arriving in"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: "var(--color-primary)"
    }
  }, t.eta, " min")), /*#__PURE__*/React.createElement(Badge, {
    variant: "primary",
    dot: true
  }, "On the way")), /*#__PURE__*/React.createElement("div", {
    className: "steps",
    style: {
      margin: "16px 0 6px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-dot",
    "data-done": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "step-line",
    "data-done": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "step-dot",
    "data-done": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "step-line"
  }), /*#__PURE__*/React.createElement("span", {
    className: "step-dot"
  })), /*#__PURE__*/React.createElement("div", {
    className: "row between tcard__meta"
  }, /*#__PURE__*/React.createElement("span", null, "Confirmed"), /*#__PURE__*/React.createElement("span", null, "En route"), /*#__PURE__*/React.createElement("span", null, "Arrived")), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row gap-md"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.name,
    size: "md",
    status: "online"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 15
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, "\u2605 ", t.rating, " \xB7 Brings own table")), /*#__PURE__*/React.createElement(IconButton, {
    label: "Message",
    variant: "filled",
    round: true
  }, /*#__PURE__*/React.createElement(I, {
    n: "message-circle",
    s: 20
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Call",
    variant: "filled",
    round: true,
    style: {
      background: "var(--color-success)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "phone",
    s: 20
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px 0"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(I, {
      n: "x",
      s: 18
    }),
    style: {
      marginBottom: 12
    }
  }, "Cancel booking"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(I, {
      n: "shield-alert",
      s: 18
    })
  }, "SOS \xB7 Emergency help")));
}
window.TrackingScreen = TrackingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client/TrackingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client/data.js
try { (() => {
// Mock data for the Lull client app kit.
window.LULL_DATA = {
  user: {
    name: "Aria",
    first: "Aria"
  },
  services: [{
    key: "deep",
    label: "Deep Tissue",
    icon: "hand-helping",
    dur: 60,
    price: 95
  }, {
    key: "swedish",
    label: "Swedish",
    icon: "waves",
    dur: 60,
    price: 85
  }, {
    key: "thai",
    label: "Thai",
    icon: "person-standing",
    dur: 90,
    price: 110
  }, {
    key: "sports",
    label: "Sports",
    icon: "activity",
    dur: 60,
    price: 100
  }, {
    key: "prenatal",
    label: "Prenatal",
    icon: "heart",
    dur: 60,
    price: 105
  }, {
    key: "hot",
    label: "Hot Stone",
    icon: "flame",
    dur: 75,
    price: 120
  }],
  therapists: [{
    id: "maya",
    name: "Maya Rivera",
    rating: 4.9,
    reviews: 214,
    dist: 1.2,
    eta: 25,
    price: 95,
    tags: ["Deep tissue", "Swedish"],
    status: "online",
    years: 8,
    bio: "Licensed massage therapist focused on deep-tissue and recovery work. Brings her own heated table, oils, and calming playlist."
  }, {
    id: "sam",
    name: "Sam Park",
    rating: 4.8,
    reviews: 156,
    dist: 2.0,
    eta: 30,
    price: 90,
    tags: ["Sports", "Thai"],
    status: "online",
    years: 6,
    bio: "Sports-recovery specialist. Great for athletes and anyone with chronic tension."
  }, {
    id: "lena",
    name: "Lena Cho",
    rating: 5.0,
    reviews: 98,
    dist: 0.8,
    eta: 20,
    price: 105,
    tags: ["Prenatal", "Swedish"],
    status: "busy",
    years: 11,
    bio: "Prenatal-certified with over a decade of practice. Gentle, restorative sessions."
  }, {
    id: "ivan",
    name: "Ivan Petrov",
    rating: 4.7,
    reviews: 132,
    dist: 3.1,
    eta: 35,
    price: 100,
    tags: ["Hot stone", "Deep tissue"],
    status: "online",
    years: 9,
    bio: "Hot-stone and deep-tissue blends to melt away the week."
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client/data.js", error: String((e && e.message) || e) }); }

// ui_kits/provider/EarningsScreen.jsx
try { (() => {
// Earnings — weekly chart, payout card, target progress, breakdown.
function EarningsScreen() {
  const {
    Badge,
    Button
  } = window.LullDesignSystem_488a52;
  const P = window.LULL_PRO;
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  const max = Math.max(...P.week);
  const peak = P.week.indexOf(max);
  const pct = Math.round(P.earnings.week / P.earnings.target * 100);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pro-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cap"
  }, "This week"), /*#__PURE__*/React.createElement("div", {
    className: "pro-head__earn",
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, "$", P.earnings.week.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "row between",
    style: {
      marginTop: 8,
      fontSize: 13,
      opacity: .9
    }
  }, /*#__PURE__*/React.createElement("span", null, pct, "% of $", P.earnings.target.toLocaleString(), " goal"), /*#__PURE__*/React.createElement("span", null, P.earnings.trips, " sessions")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 999,
      background: "rgba(255,255,255,.18)",
      marginTop: 8,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: pct + "%",
      background: "var(--color-accent)",
      borderRadius: 999
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "scr"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title"
  }, "Daily breakdown"), /*#__PURE__*/React.createElement("div", {
    className: "lull-card",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bars"
  }, P.week.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar",
    "data-peak": i === peak,
    style: {
      height: v / max * 100 + "%"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "bar-lbl"
  }, P.weekLabels[i]))))), /*#__PURE__*/React.createElement("div", {
    className: "payout",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "payout__ic"
  }, /*#__PURE__*/React.createElement(I, {
    n: "wallet",
    s: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 16
    }
  }, "$", P.earnings.week.toLocaleString(), " ready"), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, "Auto-deposits ", P.earnings.payout)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Cash out")), /*#__PURE__*/React.createElement("h2", {
    className: "sec-title"
  }, "Recent sessions"), /*#__PURE__*/React.createElement("div", {
    className: "lull-card"
  }, [{
    c: "Aria M.",
    s: "Deep Tissue",
    t: "Today · 1:00 PM",
    v: 95,
    tip: 15
  }, {
    c: "Marcus T.",
    s: "Sports",
    t: "Today · 11:00 AM",
    v: 100,
    tip: 0
  }, {
    c: "Priya N.",
    s: "Prenatal",
    t: "Yesterday · 4:00 PM",
    v: 105,
    tip: 20
  }].map((r, k) => /*#__PURE__*/React.createElement("div", {
    className: "row between",
    key: k,
    style: {
      padding: "12px 0",
      borderBottom: k < 2 ? "1px solid var(--color-border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 15
    }
  }, r.s), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, r.c, " \xB7 ", r.t)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("b", null, "$", r.v + r.tip), r.tip > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--mint-600)",
      fontWeight: 700
    }
  }, "+$", r.tip, " tip")))))));
}
window.EarningsScreen = EarningsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider/EarningsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider/JobDetailScreen.jsx
try { (() => {
// Job detail — accepted job: client, address, service summary, navigate + start.
function JobDetailScreen({
  go,
  job
}) {
  const {
    Button,
    Badge,
    Avatar,
    IconButton,
    Card
  } = window.LullDesignSystem_488a52;
  const j = job || window.LULL_PRO.requests[0];
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  const pay = j.pay || j.v || 95;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__viewport",
    style: {
      position: "absolute",
      inset: 0,
      paddingBottom: 104
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pro-head",
    style: {
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pro-head__top"
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Back",
    className: "glass-btn",
    round: true,
    onClick: () => go("jobs"),
    style: {
      background: "rgba(255,255,255,.16)",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "chevron-left"
  })), /*#__PURE__*/React.createElement(Badge, {
    variant: "solid-accent"
  }, "Accepted")), /*#__PURE__*/React.createElement("div", {
    className: "row gap-md",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: j.client,
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800
    }
  }, j.client), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: .9,
      fontSize: 14
    }
  }, j.service, " \xB7 ", j.dur, " min")))), /*#__PURE__*/React.createElement("div", {
    className: "scr",
    style: {
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "payout__ic",
    style: {
      background: "var(--color-primary-soft)",
      color: "var(--color-primary)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "map-pin",
    s: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 15
    }
  }, j.area), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, j.dist || 1.2, " mi \xB7 ", j.eta || 25, " min drive"))), /*#__PURE__*/React.createElement(IconButton, {
    label: "Navigate",
    variant: "filled",
    round: true
  }, /*#__PURE__*/React.createElement(I, {
    n: "navigation",
    s: 20
  })))), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "t-h2",
    style: {
      margin: "0 0 12px",
      fontSize: 16
    }
  }, "Session"), [["Service", j.service], ["Duration", (j.dur || 60) + " min"], ["Scheduled", j.time || "Now"], ["Table", "Therapist provides"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    className: "row between",
    key: k,
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 14
    }
  }, k), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 14
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row between"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "You earn"), /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 22,
      color: "var(--color-primary)"
    }
  }, "$", pay))), /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(I, {
      n: "message-circle",
      s: 18
    }),
    style: {
      flex: 1
    }
  }, "Message"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(I, {
      n: "phone",
      s: 18
    }),
    style: {
      flex: 1
    }
  }, "Call")))), /*#__PURE__*/React.createElement("div", {
    className: "cta-bar",
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      gap: 12,
      padding: "16px 20px 28px",
      background: "var(--surface)",
      borderTop: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(I, {
      n: "play",
      s: 18
    }),
    onClick: () => go("jobs")
  }, "Start session")));
}
window.JobDetailScreen = JobDetailScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider/JobDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider/JobsScreen.jsx
try { (() => {
// Jobs — online status, today's earnings, incoming requests with accept/decline.
function JobsScreen({
  go
}) {
  const {
    Button,
    Badge,
    Switch,
    IconButton
  } = window.LullDesignSystem_488a52;
  const P = window.LULL_PRO;
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  const [online, setOnline] = React.useState(true);
  const [reqs, setReqs] = React.useState(P.requests);
  const decline = id => setReqs(r => r.filter(x => x.id !== id));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pro-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pro-head__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "online-pill"
  }, /*#__PURE__*/React.createElement("span", {
    className: "online-dot",
    style: {
      background: online ? "var(--color-success)" : "var(--gray-400)",
      boxShadow: online ? "0 0 0 4px rgba(43,190,131,.3)" : "none"
    }
  }), online ? "Online" : "Offline")), /*#__PURE__*/React.createElement(Switch, {
    checked: online,
    onChange: setOnline,
    label: "Toggle availability"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pro-head__earn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cap"
  }, "Today's earnings"), /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, "$", P.earnings.today)), /*#__PURE__*/React.createElement("div", {
    className: "pro-mini"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, P.earnings.trips), /*#__PURE__*/React.createElement("span", null, "Sessions")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, P.earnings.hours, "h"), /*#__PURE__*/React.createElement("span", null, "Online")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "\u2605 ", P.me.rating), /*#__PURE__*/React.createElement("span", null, "Rating")))), /*#__PURE__*/React.createElement("div", {
    className: "scr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title",
    style: {
      margin: 0
    }
  }, "New requests"), /*#__PURE__*/React.createElement(Badge, {
    variant: "solid-accent"
  }, reqs.length, " live")), reqs.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 0",
      color: "var(--text-secondary)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "inbox",
    s: 40
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 8
    }
  }, "No new requests right now.")), reqs.map(r => /*#__PURE__*/React.createElement("div", {
    className: "req",
    key: r.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "req__timer"
  }, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "req__top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm",
    style: {
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 17
    }
  }, r.service), r.surge > 1 && /*#__PURE__*/React.createElement(Badge, {
    variant: "solid-accent"
  }, r.surge, "\xD7 surge")), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, r.client, " \xB7 ", r.dur, " min \xB7 ", r.time)), /*#__PURE__*/React.createElement("div", {
    className: "req__pay"
  }, /*#__PURE__*/React.createElement("b", null, "$", r.pay), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, "you earn"))), /*#__PURE__*/React.createElement("div", {
    className: "req__meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(I, {
    n: "map-pin",
    s: 15
  }), " ", r.area), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(I, {
    n: "navigation",
    s: 15
  }), " ", r.dist, " mi"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(I, {
    n: "clock",
    s: 15
  }), " ", r.eta, " min away")), /*#__PURE__*/React.createElement("div", {
    className: "req__act"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      flex: 1
    },
    onClick: () => decline(r.id)
  }, "Decline"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      flex: 2
    },
    onClick: () => go("detail", r)
  }, "Accept job")))), /*#__PURE__*/React.createElement("div", {
    className: "row between",
    style: {
      margin: "8px 0 12px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title",
    style: {
      margin: 0
    }
  }, "Next up"), /*#__PURE__*/React.createElement("a", {
    onClick: () => go("schedule"),
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--color-primary)"
    }
  }, "Schedule")), P.schedule.slice(0, 2).map(s => /*#__PURE__*/React.createElement("div", {
    className: "srow",
    key: s.id,
    onClick: () => go("detail", s),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "srow__bar",
    "data-pending": s.status === "pending"
  }), /*#__PURE__*/React.createElement("div", {
    className: "srow__time"
  }, /*#__PURE__*/React.createElement("b", null, s.time.split(" ")[0]), /*#__PURE__*/React.createElement("span", null, s.time.split(" ")[1])), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 15
    }
  }, s.service), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, s.client, " \xB7 ", s.area)), /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--color-primary)"
    }
  }, "$", s.pay)))));
}
window.JobsScreen = JobsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider/JobsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider/PhoneFrame.jsx
try { (() => {
// Shared phone shell: 390×844 frame with status bar + optional bottom nav slot.
function PhoneFrame({
  children,
  dark = false,
  bottomNav = null,
  scrollKey
}) {
  const ref = React.useRef(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "lull-phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__statusbar",
    "data-dark": dark || undefined
  }, /*#__PURE__*/React.createElement("span", {
    className: "lull-phone__time"
  }, "9:41"), /*#__PURE__*/React.createElement("span", {
    className: "lull-phone__notch"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lull-phone__icons"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "signal",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wifi",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "battery-full",
    style: {
      width: 20,
      height: 20
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__viewport",
    ref: ref,
    key: scrollKey
  }, children), bottomNav, /*#__PURE__*/React.createElement("div", {
    className: "lull-phone__home"
  }));
}
window.PhoneFrame = PhoneFrame;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider/ScheduleScreen.jsx
try { (() => {
// Schedule — upcoming sessions grouped, with status.
function ScheduleScreen({
  go
}) {
  const {
    Badge
  } = window.LullDesignSystem_488a52;
  const P = window.LULL_PRO;
  const I = ({
    n,
    s = 22
  }) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: {
      width: s,
      height: s
    }
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pro-head",
    style: {
      paddingBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pro-head__top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cap"
  }, "Schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      marginTop: 2
    }
  }, "Today, Jun 10")), /*#__PURE__*/React.createElement("span", {
    className: "online-pill"
  }, /*#__PURE__*/React.createElement(I, {
    n: "calendar",
    s: 16
  }), " Week"))), /*#__PURE__*/React.createElement("div", {
    className: "scr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row between",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title",
    style: {
      margin: 0
    }
  }, "3 sessions \xB7 $325"), /*#__PURE__*/React.createElement(Badge, {
    variant: "primary"
  }, "6.5 hrs")), /*#__PURE__*/React.createElement("div", {
    className: "lull-card",
    style: {
      marginTop: 12
    }
  }, P.schedule.map(s => /*#__PURE__*/React.createElement("div", {
    className: "srow",
    key: s.id,
    onClick: () => go("detail", s),
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "srow__bar",
    "data-pending": s.status === "pending"
  }), /*#__PURE__*/React.createElement("div", {
    className: "srow__time"
  }, /*#__PURE__*/React.createElement("b", null, s.time.split(" ")[0]), /*#__PURE__*/React.createElement("span", null, s.time.split(" ")[1])), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row gap-sm"
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 15
    }
  }, s.service), s.status === "pending" && /*#__PURE__*/React.createElement(Badge, {
    variant: "warning"
  }, "Pending")), /*#__PURE__*/React.createElement("div", {
    className: "tcard__meta"
  }, s.client, " \xB7 ", s.area, " \xB7 ", s.dur, " min")), /*#__PURE__*/React.createElement(I, {
    n: "chevron-right",
    s: 18
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 28,
      color: "var(--text-tertiary)"
    }
  }, /*#__PURE__*/React.createElement(I, {
    n: "moon",
    s: 28
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 6,
      fontSize: 14
    }
  }, "You're free after 7:15 PM."))));
}
window.ScheduleScreen = ScheduleScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider/ScheduleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/provider/data.js
try { (() => {
// Mock data for the Lull provider app kit.
window.LULL_PRO = {
  me: {
    name: "Maya Rivera",
    first: "Maya",
    rating: 4.9,
    trips: 1284
  },
  online: true,
  earnings: {
    today: 240,
    week: 1240,
    target: 1500,
    trips: 14,
    hours: 11.5,
    payout: "Fri"
  },
  week: [120, 180, 90, 220, 160, 240, 230],
  weekLabels: ["M", "T", "W", "T", "F", "S", "S"],
  requests: [{
    id: "r1",
    client: "Aria M.",
    service: "Deep Tissue",
    dur: 60,
    pay: 95,
    surge: 1.2,
    dist: 1.2,
    eta: 25,
    area: "Downtown · Pine St",
    time: "Now"
  }, {
    id: "r2",
    client: "Jordan L.",
    service: "Swedish",
    dur: 90,
    pay: 130,
    surge: 1.0,
    dist: 2.6,
    eta: 32,
    area: "Riverside · 4th Ave",
    time: "7:30 PM"
  }],
  schedule: [{
    id: "s1",
    client: "Priya N.",
    service: "Prenatal",
    time: "2:00 PM",
    dur: 60,
    pay: 105,
    status: "confirmed",
    area: "Hill District"
  }, {
    id: "s2",
    client: "Marcus T.",
    service: "Sports",
    time: "4:30 PM",
    dur: 60,
    pay: 100,
    status: "confirmed",
    area: "Downtown"
  }, {
    id: "s3",
    client: "Elena V.",
    service: "Hot Stone",
    time: "6:00 PM",
    dur: 75,
    pay: 120,
    status: "pending",
    area: "Eastside"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/provider/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.BottomNav = __ds_scope.BottomNav;

})();
