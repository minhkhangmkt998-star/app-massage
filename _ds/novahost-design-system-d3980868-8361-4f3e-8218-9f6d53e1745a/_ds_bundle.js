/* @ds-bundle: {"format":3,"namespace":"NovaHostDesignSystem_d39808","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"Tag","sourcePath":"components/data-display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"},{"name":"SidebarNav","sourcePath":"components/navigation/SidebarNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"PricingCard","sourcePath":"components/pricing/PricingCard.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"e6c34fe3918f","components/buttons/IconButton.jsx":"d674efbe527c","components/data-display/Avatar.jsx":"689f5856ae4d","components/data-display/Badge.jsx":"25e188fa4871","components/data-display/Card.jsx":"42121ba8000d","components/data-display/Tag.jsx":"0d4f790032c1","components/feedback/Alert.jsx":"4094efcaf3ff","components/feedback/Dialog.jsx":"fe63ed949068","components/feedback/Toast.jsx":"30a515021542","components/feedback/Tooltip.jsx":"3142638dc7f5","components/forms/Checkbox.jsx":"fdf13169716b","components/forms/Input.jsx":"0f5056b991a2","components/forms/Radio.jsx":"0113d5f6de8b","components/forms/Select.jsx":"36621a54f3b5","components/forms/Switch.jsx":"b05478a05df8","components/forms/Textarea.jsx":"a564060fc058","components/navigation/Navbar.jsx":"4fca1878bb61","components/navigation/SidebarNav.jsx":"d306a29cf5cf","components/navigation/Tabs.jsx":"1576b54de6b7","components/pricing/PricingCard.jsx":"fed9f31bc475","ui_kits/_shared/icons.js":"b7d20192a3b6","ui_kits/auth/AuthApp.jsx":"0615e6eb62f6","ui_kits/dashboard/DashboardApp.jsx":"cfcf30aa7019","ui_kits/marketing/MarketingHome.jsx":"9f31d61257d8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NovaHostDesignSystem_d39808 = window.NovaHostDesignSystem_d39808 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Inject component styles once. References design tokens via CSS vars. */
const STYLE_ID = 'nh-button-styles';
function useButtonStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-btn {
    --_bg: var(--brand); --_fg: var(--brand-on); --_bd: transparent; --_sh: var(--shadow-brand-sm);
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: var(--font-sans); font-weight: var(--weight-bold); white-space: nowrap;
    border: var(--border-width-2) solid var(--_bd); border-radius: var(--radius-sm);
    background: var(--_bg); color: var(--_fg); box-shadow: var(--_sh);
    cursor: pointer; text-decoration: none; line-height: 1; user-select: none;
    transition: transform var(--dur-fast) var(--ease-out), background var(--dur-base) var(--ease-out),
                box-shadow var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out);
  }
  .nh-btn:hover { background: var(--_bgh, var(--_bg)); }
  .nh-btn:active { transform: translateY(1px) scale(0.99); }
  .nh-btn:focus-visible { outline: none; box-shadow: var(--ring); }
  .nh-btn[disabled], .nh-btn[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; box-shadow: none; transform: none; }

  .nh-btn--sm { font-size: var(--text-sm); padding: 8px 14px; border-radius: var(--radius-xs); }
  .nh-btn--md { font-size: var(--text-md); padding: 12px 20px; }
  .nh-btn--lg { font-size: var(--text-lg); padding: 15px 28px; border-radius: var(--radius-md); }

  .nh-btn--primary   { --_bg: var(--brand); --_bgh: var(--brand-hover); --_fg: #fff; }
  .nh-btn--secondary { --_bg: var(--surface-card); --_bgh: var(--purple-50); --_fg: var(--brand); --_bd: var(--border-strong); --_sh: var(--shadow-xs); }
  .nh-btn--ghost     { --_bg: transparent; --_bgh: var(--purple-50); --_fg: var(--brand); --_sh: none; }
  .nh-btn--danger    { --_bg: var(--danger); --_bgh: var(--danger-ink); --_fg: #fff; --_sh: var(--shadow-sm); }
  .nh-btn--inverse   { --_bg: #fff; --_bgh: var(--purple-50); --_fg: var(--purple-800); --_sh: var(--shadow-md); }

  .nh-btn--block { display: flex; width: 100%; }
  .nh-btn__spin { width: 1em; height: 1em; border-radius: 50%; border: 2px solid currentColor;
    border-top-color: transparent; animation: nh-btn-spin 0.6s linear infinite; }
  @keyframes nh-btn-spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(el);
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  as = 'button',
  className = '',
  ...rest
}) {
  useButtonStyles();
  const Tag = as;
  const cls = ['nh-btn', `nh-btn--${variant}`, `nh-btn--${size}`, fullWidth ? 'nh-btn--block' : '', className].filter(Boolean).join(' ');
  const isDisabled = disabled || loading;
  const extra = Tag === 'button' ? {
    disabled: isDisabled,
    type: rest.type || 'button'
  } : {
    'aria-disabled': isDisabled || undefined
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, extra, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "nh-btn__spin",
    "aria-hidden": "true"
  }), !loading && leftIcon, children, !loading && rightIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-iconbutton-styles';
function useIconButtonStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-iconbtn {
    --_bg: transparent; --_bgh: var(--purple-50); --_fg: var(--text-body);
    display: inline-flex; align-items: center; justify-content: center;
    border: var(--border-width) solid transparent; border-radius: var(--radius-sm);
    background: var(--_bg); color: var(--_fg); cursor: pointer; padding: 0;
    transition: background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out),
                transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
  }
  .nh-iconbtn:hover { background: var(--_bgh); color: var(--brand); }
  .nh-iconbtn:active { transform: scale(0.94); }
  .nh-iconbtn:focus-visible { outline: none; box-shadow: var(--ring); }
  .nh-iconbtn[disabled] { opacity: 0.45; cursor: not-allowed; }
  .nh-iconbtn--sm { width: 32px; height: 32px; }
  .nh-iconbtn--md { width: 40px; height: 40px; }
  .nh-iconbtn--lg { width: 48px; height: 48px; border-radius: var(--radius-md); }
  .nh-iconbtn--solid   { --_bg: var(--brand); --_bgh: var(--brand-hover); --_fg: #fff; box-shadow: var(--shadow-brand-sm); }
  .nh-iconbtn--solid:hover { color: #fff; }
  .nh-iconbtn--outline { --_bg: var(--surface-card); --_bgh: var(--purple-50); border-color: var(--border-strong); }
  .nh-iconbtn--ghost   { --_bg: transparent; }
  .nh-iconbtn svg { width: 1.25em; height: 1.25em; display: block; }
  `;
  document.head.appendChild(el);
}
function IconButton({
  icon,
  children,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...rest
}) {
  useIconButtonStyles();
  const cls = ['nh-iconbtn', `nh-iconbtn--${variant}`, `nh-iconbtn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label,
    title: label,
    type: "button"
  }, rest), icon || children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-avatar-styles';
function useAvatarStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-avatar {
    position: relative; display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%; overflow: visible; flex: none; font-family: var(--font-sans);
    font-weight: var(--weight-bold); color: #fff; background: var(--gradient-brand); user-select: none;
  }
  .nh-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .nh-avatar--xs { width: 24px; height: 24px; font-size: 10px; }
  .nh-avatar--sm { width: 32px; height: 32px; font-size: 13px; }
  .nh-avatar--md { width: 40px; height: 40px; font-size: 15px; }
  .nh-avatar--lg { width: 56px; height: 56px; font-size: 20px; }
  .nh-avatar--square { border-radius: var(--radius-md); }
  .nh-avatar--square img { border-radius: var(--radius-md); }
  .nh-avatar__status {
    position: absolute; bottom: 0; right: 0; width: 28%; height: 28%; min-width: 8px; min-height: 8px;
    border-radius: 50%; border: 2px solid var(--surface-card); background: var(--gray-400);
  }
  .nh-avatar__status--online { background: var(--success); }
  .nh-avatar__status--busy { background: var(--danger); }
  `;
  document.head.appendChild(el);
}
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function Avatar({
  src,
  name = '',
  size = 'md',
  square = false,
  status,
  className = '',
  style,
  ...rest
}) {
  useAvatarStyles();
  const cls = ['nh-avatar', `nh-avatar--${size}`, square ? 'nh-avatar--square' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: style
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", null, initials(name) || '?'), status && /*#__PURE__*/React.createElement("span", {
    className: `nh-avatar__status nh-avatar__status--${status}`
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-badge-styles';
function useBadgeStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-badge {
    display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-sans);
    font-weight: var(--weight-semibold); font-size: var(--text-xs); line-height: 1;
    padding: 5px 10px; border-radius: var(--radius-pill); white-space: nowrap;
  }
  .nh-badge--lg { font-size: var(--text-sm); padding: 7px 13px; }
  .nh-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .nh-badge--brand   { background: var(--purple-100); color: var(--purple-700); }
  .nh-badge--neutral { background: var(--gray-100); color: var(--gray-600); }
  .nh-badge--success { background: var(--success-subtle); color: var(--success-ink); }
  .nh-badge--danger  { background: var(--danger-subtle); color: var(--danger-ink); }
  .nh-badge--warning { background: var(--warning-subtle); color: var(--warning-ink); }
  .nh-badge--info    { background: var(--info-subtle); color: var(--info-ink); }
  .nh-badge--solid   { background: var(--brand); color: #fff; }
  `;
  document.head.appendChild(el);
}
function Badge({
  children,
  variant = 'brand',
  size = 'md',
  dot = false,
  className = '',
  ...rest
}) {
  useBadgeStyles();
  const cls = ['nh-badge', `nh-badge--${variant}`, size === 'lg' ? 'nh-badge--lg' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "nh-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-card-styles';
function useCardStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-card {
    background: var(--surface-card); border: var(--border-width) solid var(--border);
    border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
    transition: box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
  }
  .nh-card--pad-sm { padding: 16px; }
  .nh-card--pad-md { padding: 24px; }
  .nh-card--pad-lg { padding: 32px; }
  .nh-card--pad-none { padding: 0; }
  .nh-card--flat { box-shadow: none; }
  .nh-card--raised { box-shadow: var(--shadow-md); border-color: transparent; }
  .nh-card--hover:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: var(--border-brand); }
  .nh-card--accent { border-top: 3px solid var(--brand); }
  `;
  document.head.appendChild(el);
}
function Card({
  children,
  padding = 'md',
  elevation = 'sm',
  hover = false,
  accent = false,
  as = 'div',
  className = '',
  ...rest
}) {
  useCardStyles();
  const Tag = as;
  const elev = elevation === 'md' ? 'nh-card--raised' : elevation === 'none' ? 'nh-card--flat' : '';
  const cls = ['nh-card', `nh-card--pad-${padding}`, elev, hover ? 'nh-card--hover' : '', accent ? 'nh-card--accent' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-tag-styles';
function useTagStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-tag {
    display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-sans);
    font-weight: var(--weight-medium); font-size: var(--text-sm); line-height: 1;
    padding: 6px 10px; border-radius: var(--radius-sm);
    background: var(--surface-card); color: var(--text-body);
    border: var(--border-width) solid var(--border-strong);
  }
  .nh-tag--brand { background: var(--purple-50); color: var(--purple-700); border-color: var(--purple-200); }
  .nh-tag__remove {
    display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
    width: 16px; height: 16px; border-radius: 50%; border: 0; background: transparent;
    color: var(--text-muted); padding: 0; transition: background var(--dur-fast), color var(--dur-fast);
  }
  .nh-tag__remove:hover { background: var(--gray-200); color: var(--text-strong); }
  .nh-tag--brand .nh-tag__remove:hover { background: var(--purple-200); color: var(--purple-800); }
  .nh-tag__remove svg { width: 11px; height: 11px; }
  `;
  document.head.appendChild(el);
}
function Tag({
  children,
  variant = 'neutral',
  onRemove,
  className = '',
  ...rest
}) {
  useTagStyles();
  const cls = ['nh-tag', variant === 'brand' ? 'nh-tag--brand' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nh-tag__remove",
    "aria-label": "X\xF3a",
    onClick: onRemove
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-alert-styles';
function useAlertStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-alert {
    display: flex; gap: 12px; align-items: flex-start; font-family: var(--font-sans);
    padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid transparent;
  }
  .nh-alert__icon { flex: none; display: flex; margin-top: 1px; }
  .nh-alert__icon svg { width: 20px; height: 20px; }
  .nh-alert__body { flex: 1; }
  .nh-alert__title { font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-heading); }
  .nh-alert__desc { font-size: var(--text-sm); color: var(--text-body); margin-top: 2px; }
  .nh-alert__close { flex: none; border: 0; background: transparent; cursor: pointer; color: var(--text-muted);
    padding: 2px; border-radius: var(--radius-xs); display: flex; }
  .nh-alert__close:hover { background: rgba(0,0,0,0.06); color: var(--text-strong); }
  .nh-alert__close svg { width: 15px; height: 15px; }
  .nh-alert--info    { background: var(--info-subtle); border-color: var(--blue-100); }
  .nh-alert--info    .nh-alert__icon { color: var(--info); }
  .nh-alert--success { background: var(--success-subtle); border-color: var(--green-100); }
  .nh-alert--success .nh-alert__icon { color: var(--success); }
  .nh-alert--warning { background: var(--warning-subtle); border-color: var(--amber-100); }
  .nh-alert--warning .nh-alert__icon { color: var(--warning-ink); }
  .nh-alert--danger  { background: var(--danger-subtle); border-color: var(--red-100); }
  .nh-alert--danger  .nh-alert__icon { color: var(--danger); }
  `;
  document.head.appendChild(el);
}
const ICONS = {
  info: /*#__PURE__*/React.createElement("path", {
    d: "M12 16v-4M12 8h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
  }),
  success: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m8 12 3 3 5-6"
  })),
  warning: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10.3 4 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4M12 17h.01"
  })),
  danger: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4M12 16h.01"
  }))
};
function Alert({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
  ...rest
}) {
  useAlertStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['nh-alert', `nh-alert--${variant}`, className].filter(Boolean).join(' '),
    role: "status"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "nh-alert__icon"
  }, icon || /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, ICONS[variant])), /*#__PURE__*/React.createElement("div", {
    className: "nh-alert__body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "nh-alert__title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "nh-alert__desc"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nh-alert__close",
    "aria-label": "\u0110\xF3ng",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-dialog-styles';
function useDialogStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-dialog__overlay {
    position: fixed; inset: 0; background: rgba(30,17,71,0.45); backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 1000;
    animation: nh-dialog-fade var(--dur-base) var(--ease-out);
  }
  .nh-dialog {
    background: var(--surface-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);
    width: 460px; max-width: 100%; font-family: var(--font-sans); overflow: hidden;
    animation: nh-dialog-pop var(--dur-slow) var(--ease-spring);
  }
  .nh-dialog__head { display: flex; align-items: flex-start; gap: 12px; padding: 24px 24px 0; }
  .nh-dialog__title { font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--text-heading); flex: 1; }
  .nh-dialog__close { border: 0; background: transparent; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: var(--radius-sm); display: flex; }
  .nh-dialog__close:hover { background: var(--surface-hover); color: var(--text-strong); }
  .nh-dialog__close svg { width: 18px; height: 18px; }
  .nh-dialog__body { padding: 10px 24px 0; font-size: var(--text-md); color: var(--text-body); line-height: 1.55; }
  .nh-dialog__footer { display: flex; justify-content: flex-end; gap: 10px; padding: 24px; }
  @keyframes nh-dialog-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes nh-dialog-pop { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: none; } }
  `;
  document.head.appendChild(el);
}
function Dialog({
  open,
  onClose,
  title,
  children,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  onConfirm,
  confirmVariant = 'primary',
  footer,
  className = '',
  ...rest
}) {
  useDialogStyles();
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "nh-dialog__overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({
    className: ['nh-dialog', className].filter(Boolean).join(' '),
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "nh-dialog__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nh-dialog__title"
  }, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nh-dialog__close",
    "aria-label": "\u0110\xF3ng",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "nh-dialog__body"
  }, children), footer !== undefined ? footer : /*#__PURE__*/React.createElement("div", {
    className: "nh-dialog__footer"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    onClick: onClose
  }, cancelLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: confirmVariant,
    onClick: onConfirm
  }, confirmLabel))));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-toast-styles';
function useToastStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-toast {
    display: flex; gap: 12px; align-items: flex-start; font-family: var(--font-sans);
    background: var(--surface-card); border: 1px solid var(--border); border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg); padding: 14px 16px; width: 360px; max-width: 90vw;
    border-left: 4px solid var(--brand);
  }
  .nh-toast--success { border-left-color: var(--success); }
  .nh-toast--danger  { border-left-color: var(--danger); }
  .nh-toast--warning { border-left-color: var(--warning); }
  .nh-toast__icon { flex: none; display: flex; margin-top: 1px; }
  .nh-toast__icon svg { width: 20px; height: 20px; }
  .nh-toast--brand   .nh-toast__icon { color: var(--brand); }
  .nh-toast--success .nh-toast__icon { color: var(--success); }
  .nh-toast--danger  .nh-toast__icon { color: var(--danger); }
  .nh-toast--warning .nh-toast__icon { color: var(--warning-ink); }
  .nh-toast__body { flex: 1; }
  .nh-toast__title { font-size: var(--text-sm); font-weight: var(--weight-bold); color: var(--text-heading); }
  .nh-toast__desc { font-size: var(--text-sm); color: var(--text-muted); margin-top: 1px; }
  .nh-toast__close { flex: none; border: 0; background: transparent; cursor: pointer; color: var(--text-muted); padding: 2px; display: flex; border-radius: var(--radius-xs); }
  .nh-toast__close:hover { background: var(--surface-hover); color: var(--text-strong); }
  .nh-toast__close svg { width: 15px; height: 15px; }
  `;
  document.head.appendChild(el);
}
const TICONS = {
  brand: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4M12 16h.01"
  })),
  success: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m8 12 3 3 5-6"
  })),
  danger: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4M12 16h.01"
  })),
  warning: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10.3 4 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4M12 17h.01"
  }))
};
function Toast({
  variant = 'brand',
  title,
  children,
  onClose,
  className = '',
  ...rest
}) {
  useToastStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['nh-toast', `nh-toast--${variant}`, className].filter(Boolean).join(' '),
    role: "alert"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "nh-toast__icon"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, TICONS[variant])), /*#__PURE__*/React.createElement("div", {
    className: "nh-toast__body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "nh-toast__title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "nh-toast__desc"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "nh-toast__close",
    "aria-label": "\u0110\xF3ng",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-tooltip-styles';
function useTooltipStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-tooltip { position: relative; display: inline-flex; }
  .nh-tooltip__pop {
    position: absolute; z-index: 50; left: 50%; transform: translateX(-50%) translateY(4px);
    background: var(--purple-900); color: #fff; font-family: var(--font-sans); font-size: var(--text-xs);
    font-weight: var(--weight-medium); line-height: 1.4; padding: 7px 10px; border-radius: var(--radius-sm);
    white-space: nowrap; box-shadow: var(--shadow-md); pointer-events: none; opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
  }
  .nh-tooltip__pop::after { content: ''; position: absolute; left: 50%; width: 8px; height: 8px;
    background: var(--purple-900); transform: translateX(-50%) rotate(45deg); }
  .nh-tooltip__pop--top { bottom: calc(100% + 8px); }
  .nh-tooltip__pop--top::after { top: 100%; margin-top: -4px; }
  .nh-tooltip__pop--bottom { top: calc(100% + 8px); }
  .nh-tooltip__pop--bottom::after { bottom: 100%; margin-bottom: -4px; }
  .nh-tooltip:hover .nh-tooltip__pop, .nh-tooltip:focus-within .nh-tooltip__pop {
    opacity: 1; transform: translateX(-50%) translateY(0);
  }
  `;
  document.head.appendChild(el);
}
function Tooltip({
  content,
  placement = 'top',
  children,
  className = '',
  ...rest
}) {
  useTooltipStyles();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['nh-tooltip', className].filter(Boolean).join(' ')
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    className: `nh-tooltip__pop nh-tooltip__pop--${placement}`,
    role: "tooltip"
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-checkbox-styles';
function useCheckboxStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-check { display: inline-flex; align-items: flex-start; gap: 10px; font-family: var(--font-sans); cursor: pointer; }
  .nh-check input { position: absolute; opacity: 0; width: 0; height: 0; }
  .nh-check__box {
    width: 20px; height: 20px; flex: none; margin-top: 1px; border-radius: var(--radius-xs);
    border: var(--border-width-2) solid var(--border-strong); background: var(--surface-card);
    display: flex; align-items: center; justify-content: center; color: #fff;
    transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
  }
  .nh-check__box svg { width: 14px; height: 14px; opacity: 0; transform: scale(0.6); transition: all var(--dur-fast) var(--ease-spring); }
  .nh-check:hover .nh-check__box { border-color: var(--brand); }
  .nh-check input:checked + .nh-check__box { background: var(--brand); border-color: var(--brand); }
  .nh-check input:checked + .nh-check__box svg { opacity: 1; transform: scale(1); }
  .nh-check input:focus-visible + .nh-check__box { box-shadow: var(--ring); }
  .nh-check input:disabled + .nh-check__box { background: var(--surface-sunken); border-color: var(--border); }
  .nh-check--disabled { cursor: not-allowed; opacity: 0.6; }
  .nh-check__text { display: flex; flex-direction: column; gap: 2px; }
  .nh-check__label { font-size: var(--text-md); color: var(--text-heading); font-weight: 500; line-height: 1.3; }
  .nh-check__desc { font-size: var(--text-sm); color: var(--text-muted); }
  `;
  document.head.appendChild(el);
}
function Checkbox({
  label,
  description,
  disabled,
  className = '',
  ...rest
}) {
  useCheckboxStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['nh-check', disabled ? 'nh-check--disabled' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "nh-check__box"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "nh-check__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "nh-check__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "nh-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-field-styles';
function useFieldStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-field { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-sans); }
  .nh-field__label { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-heading); }
  .nh-field__req { color: var(--danger); margin-left: 2px; }
  .nh-field__hint { font-size: var(--text-xs); color: var(--text-muted); }
  .nh-field__error { font-size: var(--text-xs); color: var(--danger-ink); font-weight: 600; }
  .nh-input-wrap { position: relative; display: flex; align-items: center; }
  .nh-input {
    width: 100%; font-family: inherit; font-size: var(--text-md); color: var(--text-strong);
    background: var(--surface-card); border: var(--border-width-2) solid var(--border-strong);
    border-radius: var(--radius-sm); padding: 11px 14px; line-height: 1.4;
    transition: border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
  }
  .nh-input::placeholder { color: var(--text-disabled); }
  .nh-input:hover { border-color: var(--gray-400); }
  .nh-input:focus { outline: none; border-color: var(--border-focus); box-shadow: var(--ring); }
  .nh-input:disabled { background: var(--surface-sunken); color: var(--text-disabled); cursor: not-allowed; }
  .nh-input--has-left { padding-left: 42px; }
  .nh-input--has-right { padding-right: 42px; }
  .nh-input--error { border-color: var(--danger); }
  .nh-input--error:focus { box-shadow: 0 0 0 4px rgba(229,64,44,0.22); }
  .nh-input__icon { position: absolute; display: flex; color: var(--text-muted); pointer-events: none; }
  .nh-input__icon--left { left: 14px; }
  .nh-input__icon--right { right: 14px; }
  .nh-input__icon svg { width: 18px; height: 18px; }
  `;
  document.head.appendChild(el);
}
function Input({
  label,
  hint,
  error,
  required,
  leftIcon,
  rightIcon,
  id,
  className = '',
  ...rest
}) {
  useFieldStyles();
  const fid = id || (label ? 'nh-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const inputCls = ['nh-input', leftIcon ? 'nh-input--has-left' : '', rightIcon ? 'nh-input--has-right' : '', error ? 'nh-input--error' : ''].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: ['nh-field', className].filter(Boolean).join(' ')
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "nh-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "nh-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "nh-input-wrap"
  }, leftIcon && /*#__PURE__*/React.createElement("span", {
    className: "nh-input__icon nh-input__icon--left"
  }, leftIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: inputCls,
    "aria-invalid": !!error
  }, rest)), rightIcon && /*#__PURE__*/React.createElement("span", {
    className: "nh-input__icon nh-input__icon--right"
  }, rightIcon)), error ? /*#__PURE__*/React.createElement("span", {
    className: "nh-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "nh-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-radio-styles';
function useRadioStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-radio { display: inline-flex; align-items: flex-start; gap: 10px; font-family: var(--font-sans); cursor: pointer; }
  .nh-radio input { position: absolute; opacity: 0; width: 0; height: 0; }
  .nh-radio__dot {
    width: 20px; height: 20px; flex: none; margin-top: 1px; border-radius: 50%;
    border: var(--border-width-2) solid var(--border-strong); background: var(--surface-card);
    display: flex; align-items: center; justify-content: center;
    transition: border-color var(--dur-fast) var(--ease-out);
  }
  .nh-radio__dot::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--brand);
    transform: scale(0); transition: transform var(--dur-fast) var(--ease-spring); }
  .nh-radio:hover .nh-radio__dot { border-color: var(--brand); }
  .nh-radio input:checked + .nh-radio__dot { border-color: var(--brand); }
  .nh-radio input:checked + .nh-radio__dot::after { transform: scale(1); }
  .nh-radio input:focus-visible + .nh-radio__dot { box-shadow: var(--ring); }
  .nh-radio--disabled { cursor: not-allowed; opacity: 0.6; }
  .nh-radio__text { display: flex; flex-direction: column; gap: 2px; }
  .nh-radio__label { font-size: var(--text-md); color: var(--text-heading); font-weight: 500; line-height: 1.3; }
  .nh-radio__desc { font-size: var(--text-sm); color: var(--text-muted); }
  `;
  document.head.appendChild(el);
}
function Radio({
  label,
  description,
  disabled,
  className = '',
  ...rest
}) {
  useRadioStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['nh-radio', disabled ? 'nh-radio--disabled' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "nh-radio__dot"
  }), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "nh-radio__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "nh-radio__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "nh-radio__desc"
  }, description)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-select-styles';
function useSelectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-select-wrap { position: relative; display: flex; align-items: center; }
  .nh-select {
    width: 100%; font-family: var(--font-sans); font-size: var(--text-md); color: var(--text-strong);
    background: var(--surface-card); border: var(--border-width-2) solid var(--border-strong);
    border-radius: var(--radius-sm); padding: 11px 40px 11px 14px; line-height: 1.4;
    appearance: none; -webkit-appearance: none; cursor: pointer;
    transition: border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
  }
  .nh-select:hover { border-color: var(--gray-400); }
  .nh-select:focus { outline: none; border-color: var(--border-focus); box-shadow: var(--ring); }
  .nh-select:disabled { background: var(--surface-sunken); color: var(--text-disabled); cursor: not-allowed; }
  .nh-select--error { border-color: var(--danger); }
  .nh-select__chev { position: absolute; right: 14px; pointer-events: none; color: var(--text-muted); display: flex; }
  `;
  document.head.appendChild(el);
}
function Select({
  label,
  hint,
  error,
  required,
  options = [],
  placeholder,
  id,
  className = '',
  children,
  ...rest
}) {
  useSelectStyles();
  const fid = id || (label ? 'nh-sel-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: ['nh-field', className].filter(Boolean).join(' ')
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "nh-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "nh-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "nh-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: ['nh-select', error ? 'nh-select--error' : ''].filter(Boolean).join(' ')
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  }), children), /*#__PURE__*/React.createElement("span", {
    className: "nh-select__chev"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))), error ? /*#__PURE__*/React.createElement("span", {
    className: "nh-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "nh-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-switch-styles';
function useSwitchStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-switch { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-sans); cursor: pointer; }
  .nh-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
  .nh-switch__track {
    width: 42px; height: 24px; flex: none; border-radius: var(--radius-pill);
    background: var(--gray-300); position: relative; transition: background var(--dur-base) var(--ease-out);
  }
  .nh-switch__thumb {
    position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
    background: #fff; box-shadow: var(--shadow-sm);
    transition: transform var(--dur-base) var(--ease-spring);
  }
  .nh-switch input:checked + .nh-switch__track { background: var(--brand); }
  .nh-switch input:checked + .nh-switch__track .nh-switch__thumb { transform: translateX(18px); }
  .nh-switch input:focus-visible + .nh-switch__track { box-shadow: var(--ring); }
  .nh-switch--disabled { cursor: not-allowed; opacity: 0.55; }
  .nh-switch__label { font-size: var(--text-md); color: var(--text-heading); font-weight: 500; }
  `;
  document.head.appendChild(el);
}
function Switch({
  label,
  disabled,
  className = '',
  ...rest
}) {
  useSwitchStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['nh-switch', disabled ? 'nh-switch--disabled' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "nh-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nh-switch__thumb"
  })), label && /*#__PURE__*/React.createElement("span", {
    className: "nh-switch__label"
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-textarea-styles';
function useTextareaStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-textarea {
    width: 100%; font-family: var(--font-sans); font-size: var(--text-md); color: var(--text-strong);
    background: var(--surface-card); border: var(--border-width-2) solid var(--border-strong);
    border-radius: var(--radius-sm); padding: 11px 14px; line-height: 1.5; resize: vertical; min-height: 96px;
    transition: border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
  }
  .nh-textarea::placeholder { color: var(--text-disabled); }
  .nh-textarea:hover { border-color: var(--gray-400); }
  .nh-textarea:focus { outline: none; border-color: var(--border-focus); box-shadow: var(--ring); }
  .nh-textarea:disabled { background: var(--surface-sunken); color: var(--text-disabled); cursor: not-allowed; }
  .nh-textarea--error { border-color: var(--danger); }
  `;
  document.head.appendChild(el);
}
function Textarea({
  label,
  hint,
  error,
  required,
  id,
  className = '',
  ...rest
}) {
  useTextareaStyles();
  const fid = id || (label ? 'nh-ta-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: ['nh-field', className].filter(Boolean).join(' ')
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "nh-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "nh-field__req"
  }, "*")), /*#__PURE__*/React.createElement("textarea", _extends({
    id: fid,
    className: ['nh-textarea', error ? 'nh-textarea--error' : ''].filter(Boolean).join(' '),
    "aria-invalid": !!error
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    className: "nh-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "nh-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-navbar-styles';
function useNavbarStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-navbar {
    display: flex; align-items: center; gap: 28px; font-family: var(--font-sans);
    height: 72px; padding: 0 28px; background: rgba(255,255,255,0.85); backdrop-filter: saturate(180%) blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nh-navbar--dark { background: rgba(30,17,71,0.72); border-bottom-color: rgba(255,255,255,0.10); }
  .nh-navbar__brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px;
    letter-spacing: -0.02em; color: var(--purple-900); text-decoration: none; }
  .nh-navbar--dark .nh-navbar__brand { color: #fff; }
  .nh-navbar__brand img { width: 30px; height: 30px; }
  .nh-navbar__links { display: flex; align-items: center; gap: 4px; }
  .nh-navbar__link {
    font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-body);
    padding: 9px 14px; border-radius: var(--radius-sm); text-decoration: none; cursor: pointer;
    transition: background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out);
  }
  .nh-navbar__link:hover { background: var(--purple-50); color: var(--brand); }
  .nh-navbar--dark .nh-navbar__link { color: var(--text-on-dark-muted); }
  .nh-navbar--dark .nh-navbar__link:hover { background: rgba(255,255,255,0.10); color: #fff; }
  .nh-navbar__spacer { flex: 1; }
  .nh-navbar__actions { display: flex; align-items: center; gap: 10px; }
  `;
  document.head.appendChild(el);
}
function Navbar({
  brand = 'NovaHost',
  logoSrc,
  links = [],
  actions,
  dark = false,
  onLinkClick,
  className = '',
  ...rest
}) {
  useNavbarStyles();
  return /*#__PURE__*/React.createElement("header", _extends({
    className: ['nh-navbar', dark ? 'nh-navbar--dark' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("a", {
    className: "nh-navbar__brand",
    href: "#"
  }, logoSrc && /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: ""
  }), brand), /*#__PURE__*/React.createElement("nav", {
    className: "nh-navbar__links"
  }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    className: "nh-navbar__link",
    href: l.href || '#',
    onClick: e => {
      if (onLinkClick) {
        e.preventDefault();
        onLinkClick(l);
      }
    }
  }, l.label))), /*#__PURE__*/React.createElement("span", {
    className: "nh-navbar__spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "nh-navbar__actions"
  }, actions));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-sidebar-styles';
function useSidebarStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-sidebar {
    display: flex; flex-direction: column; gap: 2px; font-family: var(--font-sans);
    width: 248px; padding: 16px 12px; background: var(--surface-card);
    border-right: 1px solid var(--border);
  }
  .nh-sidebar__section { font-size: var(--text-2xs); font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: var(--text-muted); padding: 16px 12px 6px; }
  .nh-navitem {
    display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: var(--radius-sm);
    color: var(--text-body); font-size: var(--text-sm); font-weight: var(--weight-medium);
    cursor: pointer; border: 0; background: transparent; width: 100%; text-align: left; font-family: inherit;
    transition: background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out);
  }
  .nh-navitem:hover { background: var(--surface-hover); color: var(--text-heading); }
  .nh-navitem[aria-current="true"] { background: var(--purple-50); color: var(--brand); font-weight: var(--weight-semibold); }
  .nh-navitem__icon { display: flex; flex: none; color: currentColor; }
  .nh-navitem__icon svg { width: 19px; height: 19px; }
  .nh-navitem[aria-current="true"] .nh-navitem__icon { color: var(--brand); }
  .nh-navitem__label { flex: 1; }
  .nh-navitem__badge { font-size: var(--text-2xs); font-weight: 700; background: var(--brand); color: #fff;
    border-radius: var(--radius-pill); padding: 2px 7px; }
  `;
  document.head.appendChild(el);
}
function SidebarNav({
  items = [],
  value,
  onChange,
  className = '',
  style,
  header,
  footer,
  ...rest
}) {
  useSidebarStyles();
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: ['nh-sidebar', className].filter(Boolean).join(' '),
    style: style
  }, rest), header, items.map((it, i) => it.section ? /*#__PURE__*/React.createElement("div", {
    key: 's' + i,
    className: "nh-sidebar__section"
  }, it.section) : /*#__PURE__*/React.createElement("button", {
    key: it.id,
    type: "button",
    className: "nh-navitem",
    "aria-current": value === it.id,
    onClick: () => onChange && onChange(it.id)
  }, it.icon && /*#__PURE__*/React.createElement("span", {
    className: "nh-navitem__icon"
  }, it.icon), /*#__PURE__*/React.createElement("span", {
    className: "nh-navitem__label"
  }, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
    className: "nh-navitem__badge"
  }, it.badge))), footer);
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-tabs-styles';
function useTabsStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-tabs { display: flex; gap: 4px; font-family: var(--font-sans); }
  .nh-tabs--underline { border-bottom: 1.5px solid var(--border); gap: 22px; }
  .nh-tabs--pill { background: var(--surface-sunken); padding: 4px; border-radius: var(--radius-md); gap: 4px; }
  .nh-tab {
    appearance: none; border: 0; background: transparent; cursor: pointer; font-family: inherit;
    font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--text-muted);
    display: inline-flex; align-items: center; gap: 7px; transition: color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out);
  }
  .nh-tab__count { font-size: var(--text-xs); background: var(--gray-200); color: var(--text-muted); border-radius: var(--radius-pill); padding: 1px 7px; font-weight: 700; }
  .nh-tabs--underline .nh-tab { padding: 12px 2px; position: relative; }
  .nh-tabs--underline .nh-tab::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1.5px; height: 2.5px;
    background: var(--brand); border-radius: 2px; transform: scaleX(0); transition: transform var(--dur-base) var(--ease-out); }
  .nh-tabs--underline .nh-tab:hover { color: var(--text-heading); }
  .nh-tabs--underline .nh-tab[aria-selected="true"] { color: var(--brand); }
  .nh-tabs--underline .nh-tab[aria-selected="true"]::after { transform: scaleX(1); }
  .nh-tabs--pill .nh-tab { padding: 8px 16px; border-radius: var(--radius-sm); }
  .nh-tabs--pill .nh-tab:hover { color: var(--text-heading); }
  .nh-tabs--pill .nh-tab[aria-selected="true"] { background: var(--surface-card); color: var(--brand); box-shadow: var(--shadow-xs); }
  .nh-tabs--pill .nh-tab[aria-selected="true"] .nh-tab__count { background: var(--purple-100); color: var(--purple-700); }
  `;
  document.head.appendChild(el);
}
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  className = '',
  ...rest
}) {
  useTabsStyles();
  const [internal, setInternal] = React.useState(defaultValue ?? (items[0] && items[0].id));
  const active = value !== undefined ? value : internal;
  const select = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: ['nh-tabs', `nh-tabs--${variant}`, className].filter(Boolean).join(' ')
  }, rest), items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    role: "tab",
    type: "button",
    className: "nh-tab",
    "aria-selected": active === it.id,
    onClick: () => select(it.id)
  }, it.icon, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
    className: "nh-tab__count"
  }, it.count))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/pricing/PricingCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'nh-pricing-styles';
function usePricingStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .nh-price {
    position: relative; display: flex; flex-direction: column; background: var(--surface-card);
    border: var(--border-width-2) solid var(--border); border-radius: var(--radius-xl);
    padding: 28px 26px; transition: box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
  }
  .nh-price:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); }
  .nh-price--popular { border-color: var(--brand); box-shadow: var(--shadow-lg); }
  .nh-price__flag {
    position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
    background: var(--gradient-brand); color: #fff; font-size: var(--text-xs); font-weight: 700;
    letter-spacing: .04em; text-transform: uppercase; padding: 6px 14px; border-radius: var(--radius-pill);
    box-shadow: var(--shadow-brand-sm); white-space: nowrap;
  }
  .nh-price__name { font-size: var(--text-lg); font-weight: 700; color: var(--text-heading); }
  .nh-price__desc { font-size: var(--text-sm); color: var(--text-muted); margin-top: 4px; min-height: 38px; }
  .nh-price__amount { display: flex; align-items: baseline; gap: 4px; margin: 18px 0 4px; }
  .nh-price__cur { font-size: var(--text-lg); font-weight: 700; color: var(--text-heading); }
  .nh-price__num { font-size: 40px; font-weight: 800; color: var(--text-strong); letter-spacing: -0.02em; line-height: 1; }
  .nh-price__per { font-size: var(--text-sm); color: var(--text-muted); }
  .nh-price__save { font-size: var(--text-xs); color: var(--success-ink); font-weight: 600; margin-bottom: 18px; }
  .nh-price__cta { margin-bottom: 22px; }
  .nh-price__feat { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
  .nh-price__feat li { display: flex; align-items: flex-start; gap: 9px; font-size: var(--text-sm); color: var(--text-body); }
  .nh-price__feat svg { width: 17px; height: 17px; flex: none; margin-top: 1px; }
  .nh-price__feat .ok { color: var(--success); }
  .nh-price__feat .no { color: var(--gray-400); }
  .nh-price__feat .off { color: var(--text-disabled); }
  `;
  document.head.appendChild(el);
}
const Check = () => /*#__PURE__*/React.createElement("svg", {
  className: "ok",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M20 6 9 17l-5-5"
}));
const Cross = () => /*#__PURE__*/React.createElement("svg", {
  className: "no",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "3",
  strokeLinecap: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M18 6 6 18M6 6l12 12"
}));
function PricingCard({
  name,
  description,
  currency = '₫',
  price,
  period = '/tháng',
  save,
  features = [],
  ctaLabel = 'Chọn gói',
  onSelect,
  popular = false,
  flagText = 'Phổ biến nhất',
  className = '',
  ...rest
}) {
  usePricingStyles();
  const cls = ['nh-price', popular ? 'nh-price--popular' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), popular && /*#__PURE__*/React.createElement("span", {
    className: "nh-price__flag"
  }, flagText), /*#__PURE__*/React.createElement("div", {
    className: "nh-price__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "nh-price__desc"
  }, description), /*#__PURE__*/React.createElement("div", {
    className: "nh-price__amount"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nh-price__cur"
  }, currency), /*#__PURE__*/React.createElement("span", {
    className: "nh-price__num"
  }, price), /*#__PURE__*/React.createElement("span", {
    className: "nh-price__per"
  }, period)), /*#__PURE__*/React.createElement("div", {
    className: "nh-price__save"
  }, save || '\u00A0'), /*#__PURE__*/React.createElement("div", {
    className: "nh-price__cta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: popular ? 'primary' : 'secondary',
    fullWidth: true,
    onClick: onSelect
  }, ctaLabel)), /*#__PURE__*/React.createElement("ul", {
    className: "nh-price__feat"
  }, features.map((f, i) => {
    const item = typeof f === 'string' ? {
      text: f,
      included: true
    } : f;
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      className: item.included ? '' : 'off'
    }, item.included ? /*#__PURE__*/React.createElement(Check, null) : /*#__PURE__*/React.createElement(Cross, null), /*#__PURE__*/React.createElement("span", null, item.text));
  })));
}
Object.assign(__ds_scope, { PricingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/pricing/PricingCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/_shared/icons.js
try { (() => {
/* NovaHost — shared lucide-style icon set for UI kits.
 * Documented substitute icon system (Lucide, 2px stroke). Registers on window. */
(function () {
  const React = window.React;
  const S = (paths, props = {}) => React.createElement('svg', Object.assign({
    viewBox: '0 0 24 24',
    width: 20,
    height: 20,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, props), ...(Array.isArray(paths) ? paths : [paths]).map((d, i) => typeof d === 'string' ? React.createElement('path', {
    key: i,
    d
  }) : d));
  const P = d => props => S(d, props);
  const E = el => props => S(el, props);
  const NHIcons = {
    rocket: P(['M5 13c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.9-.9.9-2.3 0-3.2a2.3 2.3 0 0 0-3 .2z', 'M15 7a6 6 0 0 1 5 5l-3 3-7-7 3-3a6 6 0 0 1 2-1z', 'M9 15l-3-3']),
    globe: E([React.createElement('circle', {
      key: 'c',
      cx: 12,
      cy: 12,
      r: 9
    }), React.createElement('path', {
      key: 'p',
      d: 'M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18'
    })]),
    shield: P(['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'm9 12 2 2 4-4']),
    bolt: P('M13 2 4 14h7l-1 8 9-12h-7z'),
    gauge: E([React.createElement('path', {
      key: 'a',
      d: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
    }), React.createElement('path', {
      key: 'b',
      d: 'M12 14 8 9M21 12a9 9 0 1 0-18 0'
    })]),
    headset: P(['M4 14v-2a8 8 0 0 1 16 0v2', 'M4 14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z', 'M20 14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z', 'M20 19a4 4 0 0 1-4 3h-2']),
    server: E([React.createElement('rect', {
      key: 'a',
      x: 3,
      y: 4,
      width: 18,
      height: 7,
      rx: 2
    }), React.createElement('rect', {
      key: 'b',
      x: 3,
      y: 13,
      width: 18,
      height: 7,
      rx: 2
    }), React.createElement('path', {
      key: 'c',
      d: 'M7 7.5h.01M7 16.5h.01'
    })]),
    wp: E([React.createElement('circle', {
      key: 'c',
      cx: 12,
      cy: 12,
      r: 9
    }), React.createElement('path', {
      key: 'p',
      d: 'M3.5 9.5 9 21M20 8l-3.5 11M2.8 12h18.4'
    })]),
    mail: E([React.createElement('rect', {
      key: 'r',
      x: 3,
      y: 5,
      width: 18,
      height: 14,
      rx: 2
    }), React.createElement('path', {
      key: 'p',
      d: 'm3 7 9 6 9-6'
    })]),
    check: P('M20 6 9 17l-5-5'),
    search: E([React.createElement('circle', {
      key: 'c',
      cx: 11,
      cy: 11,
      r: 7
    }), React.createElement('path', {
      key: 'p',
      d: 'm21 21-4.3-4.3'
    })]),
    arrow: P('M5 12h14M13 6l6 6-6 6'),
    star: P('M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'),
    home: P(['M3 11l9-8 9 8', 'M5 10v10h14V10']),
    chart: E([React.createElement('path', {
      key: 'a',
      d: 'M3 3v18h18'
    }), React.createElement('rect', {
      key: 'b',
      x: 7,
      y: 11,
      width: 3,
      height: 6
    }), React.createElement('rect', {
      key: 'c',
      x: 13,
      y: 7,
      width: 3,
      height: 10
    })]),
    folder: P('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'),
    database: E([React.createElement('ellipse', {
      key: 'a',
      cx: 12,
      cy: 5,
      rx: 8,
      ry: 3
    }), React.createElement('path', {
      key: 'b',
      d: 'M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'
    })]),
    settings: E([React.createElement('circle', {
      key: 'c',
      cx: 12,
      cy: 12,
      r: 3
    }), React.createElement('path', {
      key: 'p',
      d: 'M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z'
    })]),
    bell: P(['M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0']),
    lock: E([React.createElement('rect', {
      key: 'r',
      x: 4,
      y: 11,
      width: 16,
      height: 10,
      rx: 2
    }), React.createElement('path', {
      key: 'p',
      d: 'M8 11V7a4 4 0 0 1 8 0v4'
    })]),
    plus: P('M12 5v14M5 12h14'),
    logout: P(['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9']),
    code: P('M16 18l6-6-6-6M8 6l-6 6 6 6'),
    cloud: P('M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 18 18z'),
    clock: E([React.createElement('circle', {
      key: 'c',
      cx: 12,
      cy: 12,
      r: 9
    }), React.createElement('path', {
      key: 'p',
      d: 'M12 7v5l3 2'
    })])
  };
  window.NHIcons = NHIcons;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/_shared/icons.js", error: String((e && e.message) || e) }); }

// ui_kits/auth/AuthApp.jsx
try { (() => {
/* NovaHost — Auth & onboarding (Vietnamese). Composes DS primitives. */
(function () {
  const React = window.React;
  const NS = window.NovaHostDesignSystem_d39808;
  const I = window.NHIcons;
  const {
    Input,
    Button,
    Checkbox,
    Alert,
    Badge
  } = NS;
  const Ic = (name, props) => React.createElement(I[name], props || {});
  const h = React.createElement;
  const css = `
  .auth { display:flex; min-height:100vh; font-family: var(--font-sans); background: var(--surface-card); }
  .auth__form { flex:1; display:flex; flex-direction:column; padding:34px 48px; min-width:0; }
  .auth__brand { display:flex; align-items:center; gap:10px; font-weight:800; font-size:20px; color: var(--purple-900); letter-spacing:-0.02em; text-decoration:none; }
  .auth__brand img { width:30px; height:30px; }
  .auth__center { flex:1; display:flex; flex-direction:column; justify-content:center; max-width:400px; margin:0 auto; width:100%; }
  .auth__center h1 { font-size:32px; letter-spacing:-0.02em; }
  .auth__center > p { color: var(--text-muted); margin-top:8px; font-size:16px; }
  .auth__fields { display:flex; flex-direction:column; gap:16px; margin-top:28px; }
  .auth__row { display:flex; align-items:center; justify-content:space-between; }
  .auth__link { color: var(--text-link); font-size:14px; font-weight:600; cursor:pointer; }
  .auth__or { display:flex; align-items:center; gap:14px; color: var(--text-muted); font-size:13px; margin:22px 0; }
  .auth__or::before, .auth__or::after { content:''; flex:1; height:1px; background: var(--border); }
  .auth__social { display:flex; gap:12px; }
  .auth__soc { flex:1; display:flex; align-items:center; justify-content:center; gap:9px; padding:11px; border:1.5px solid var(--border-strong);
    border-radius: var(--radius-sm); background:#fff; font-weight:600; font-size:14px; color: var(--text-heading); cursor:pointer; }
  .auth__soc:hover { background: var(--surface-page); border-color: var(--gray-400); }
  .auth__foot { text-align:center; color: var(--text-muted); font-size:14px; margin-top:26px; }
  .auth__foot b { color: var(--text-link); cursor:pointer; }

  .auth__aside { width:46%; max-width:620px; background: var(--gradient-hero); position:relative; overflow:hidden; padding:48px; display:flex; flex-direction:column; color:#fff; }
  .auth__aside::after { content:''; position:absolute; inset:0; background-image: radial-gradient(rgba(255,255,255,.06) 1.3px, transparent 1.3px); background-size: 22px 22px; }
  .auth__aside-in { position:relative; z-index:1; margin:auto 0; }
  .auth__aside h2 { color:#fff; font-size:36px; line-height:1.15; letter-spacing:-0.02em; max-width:440px; }
  .auth__aside p { color: var(--text-on-dark-muted); font-size:17px; margin-top:16px; max-width:420px; line-height:1.6; }
  .auth__points { display:flex; flex-direction:column; gap:14px; margin-top:32px; }
  .auth__point { display:flex; align-items:center; gap:12px; color:#EBE5FC; font-size:16px; }
  .auth__point-ic { width:30px; height:30px; border-radius:50%; background: rgba(255,255,255,.14); display:flex; align-items:center; justify-content:center; flex:none; color:#B9A3F2; }
  .auth__point-ic svg { width:17px; height:17px; }
  .auth__card { position:relative; z-index:1; background: rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.16); border-radius: var(--radius-lg); padding:22px; margin-top:auto; backdrop-filter: blur(6px); }
  .auth__card p { color:#fff; font-size:15px; font-style:italic; line-height:1.5; }
  .auth__card .who { color: var(--text-on-dark-muted); font-size:13px; margin-top:10px; }

  /* Onboarding */
  .onb { max-width:560px; margin:0 auto; width:100%; }
  .onb__opts { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:26px; }
  .onb__opt { display:flex; flex-direction:column; gap:8px; padding:20px; border:1.5px solid var(--border-strong); border-radius: var(--radius-lg);
    background:#fff; cursor:pointer; transition: all var(--dur-base) var(--ease-out); text-align:left; font-family:inherit; }
  .onb__opt:hover { border-color: var(--border-brand); transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .onb__opt[aria-pressed="true"] { border-color: var(--brand); background: var(--purple-50); box-shadow: var(--ring); }
  .onb__opt-ic { width:42px; height:42px; border-radius: var(--radius-md); background: var(--purple-50); color: var(--brand); display:flex; align-items:center; justify-content:center; }
  .onb__opt-ic svg { width:22px; height:22px; }
  .onb__opt[aria-pressed="true"] .onb__opt-ic { background:#fff; }
  .onb__opt b { font-size:15px; color: var(--text-heading); }
  .onb__opt span { font-size:13px; color: var(--text-muted); }
  .onb__steps { display:flex; gap:6px; margin-bottom:22px; }
  .onb__dot { height:5px; border-radius:3px; background: var(--gray-200); flex:1; }
  .onb__dot--on { background: var(--brand); }
  `;
  const GoogleG = () => h('svg', {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24'
  }, h('path', {
    fill: '#4285F4',
    d: 'M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-7.8z'
  }), h('path', {
    fill: '#34A853',
    d: 'M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23z'
  }), h('path', {
    fill: '#FBBC05',
    d: 'M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8z'
  }), h('path', {
    fill: '#EA4335',
    d: 'M12 5.4c1.6 0 3 .6 4.2 1.7l3.1-3.1A11 11 0 0 0 2 7.1l3.7 2.8C6.6 7.3 9.1 5.4 12 5.4z'
  }));
  function Aside() {
    return h('aside', {
      className: 'auth__aside'
    }, h('div', {
      className: 'auth__aside-in'
    }, h(Badge, {
      variant: 'solid',
      style: {
        background: 'rgba(255,255,255,.16)',
        color: '#fff'
      }
    }, 'NovaHost Cloud'), h('h2', {
      style: {
        marginTop: 18
      }
    }, 'Khởi chạy nhanh hơn. Phát triển xa hơn.'), h('p', null, 'Tham gia cùng hơn 120.000 doanh nghiệp Việt đang tin dùng NovaHost cho website của họ.'), h('div', {
      className: 'auth__points'
    }, point('rocket', 'Cài đặt WordPress chỉ trong 1 phút'), point('shield', 'SSL miễn phí & sao lưu tự động'), point('headset', 'Hỗ trợ tiếng Việt 24/7'))), h('div', {
      className: 'auth__card'
    }, h('p', null, '“Mình tạo xong cửa hàng online trong một buổi chiều. Quá đơn giản!”'), h('div', {
      className: 'who'
    }, 'Trần Bình · Chủ shop thời trang')));
  }
  const point = (ic, t) => h('div', {
    className: 'auth__point'
  }, h('span', {
    className: 'auth__point-ic'
  }, Ic(ic)), t);
  function LoginForm({
    onSwitch,
    onDone
  }) {
    return h('div', {
      className: 'auth__center'
    }, h('h1', null, 'Đăng nhập'), h('p', null, 'Chào mừng trở lại! Vui lòng nhập thông tin của bạn.'), h('div', {
      className: 'auth__fields'
    }, h(Input, {
      label: 'Email',
      type: 'email',
      placeholder: 'ban@email.com',
      leftIcon: Ic('mail', {
        width: 18,
        height: 18
      })
    }), h(Input, {
      label: 'Mật khẩu',
      type: 'password',
      placeholder: '••••••••',
      leftIcon: Ic('lock', {
        width: 18,
        height: 18
      })
    }), h('div', {
      className: 'auth__row'
    }, h(Checkbox, {
      label: 'Ghi nhớ tôi',
      defaultChecked: true
    }), h('span', {
      className: 'auth__link'
    }, 'Quên mật khẩu?')), h(Button, {
      fullWidth: true,
      size: 'lg',
      onClick: onDone
    }, 'Đăng nhập')), h('div', {
      className: 'auth__or'
    }, 'hoặc'), h('div', {
      className: 'auth__social'
    }, h('button', {
      className: 'auth__soc'
    }, h(GoogleG), 'Google'), h('button', {
      className: 'auth__soc'
    }, Ic('globe', {
      width: 18,
      height: 18
    }), 'SSO')), h('div', {
      className: 'auth__foot'
    }, 'Chưa có tài khoản? ', h('b', {
      onClick: onSwitch
    }, 'Đăng ký miễn phí')));
  }
  function RegisterForm({
    onSwitch,
    onDone
  }) {
    const [agree, setAgree] = React.useState(true);
    return h('div', {
      className: 'auth__center'
    }, h('h1', null, 'Tạo tài khoản'), h('p', null, 'Bắt đầu miễn phí — không cần thẻ tín dụng.'), h('div', {
      className: 'auth__fields'
    }, h(Input, {
      label: 'Họ và tên',
      placeholder: 'Nguyễn Văn A'
    }), h(Input, {
      label: 'Email',
      type: 'email',
      placeholder: 'ban@email.com',
      leftIcon: Ic('mail', {
        width: 18,
        height: 18
      })
    }), h(Input, {
      label: 'Mật khẩu',
      type: 'password',
      placeholder: 'Tối thiểu 8 ký tự',
      leftIcon: Ic('lock', {
        width: 18,
        height: 18
      }),
      hint: 'Dùng chữ hoa, số và ký tự đặc biệt.'
    }), h(Checkbox, {
      checked: agree,
      onChange: e => setAgree(e.target.checked),
      label: 'Tôi đồng ý với Điều khoản và Chính sách bảo mật'
    }), h(Button, {
      fullWidth: true,
      size: 'lg',
      disabled: !agree,
      onClick: onDone
    }, 'Tạo tài khoản')), h('div', {
      className: 'auth__foot'
    }, 'Đã có tài khoản? ', h('b', {
      onClick: onSwitch
    }, 'Đăng nhập')));
  }
  function Onboarding({
    onDone
  }) {
    const [pick, setPick] = React.useState('wp');
    const opts = [['wp', 'wp', 'Website WordPress', 'Blog, doanh nghiệp, portfolio'], ['shop', 'globe', 'Cửa hàng online', 'Bán hàng với WooCommerce'], ['code', 'code', 'Dự án lập trình', 'PHP, Node, tĩnh'], ['domain', 'server', 'Chỉ cần tên miền', 'Đăng ký & quản lý tên miền']];
    return h('div', {
      className: 'auth__center'
    }, h('div', {
      className: 'onb'
    }, h('div', {
      className: 'onb__steps'
    }, h('div', {
      className: 'onb__dot onb__dot--on'
    }), h('div', {
      className: 'onb__dot onb__dot--on'
    }), h('div', {
      className: 'onb__dot'
    })), h('h1', null, 'Bạn muốn xây dựng gì?'), h('p', {
      style: {
        color: 'var(--text-muted)',
        marginTop: 8,
        fontSize: 16
      }
    }, 'Chúng tôi sẽ thiết lập môi trường phù hợp cho bạn.'), h('div', {
      className: 'onb__opts'
    }, opts.map(([id, ic, t, d]) => h('button', {
      key: id,
      className: 'onb__opt',
      'aria-pressed': pick === id,
      onClick: () => setPick(id)
    }, h('span', {
      className: 'onb__opt-ic'
    }, Ic(ic)), h('b', null, t), h('span', null, d)))), h('div', {
      style: {
        marginTop: 26,
        display: 'flex',
        gap: 12
      }
    }, h(Button, {
      size: 'lg',
      fullWidth: true,
      rightIcon: Ic('arrow', {
        width: 18,
        height: 18
      }),
      onClick: onDone
    }, 'Tiếp tục đến hPanel'))));
  }
  function AuthApp() {
    const [mode, setMode] = React.useState('login'); // login | register | onboarding
    const goDash = () => {
      window.location.href = '../dashboard/index.html';
    };
    let body;
    if (mode === 'login') body = h(LoginForm, {
      onSwitch: () => setMode('register'),
      onDone: goDash
    });else if (mode === 'register') body = h(RegisterForm, {
      onSwitch: () => setMode('login'),
      onDone: () => setMode('onboarding')
    });else body = h(Onboarding, {
      onDone: goDash
    });
    return h('div', {
      className: 'auth'
    }, h('style', null, css), h('div', {
      className: 'auth__form'
    }, h('a', {
      className: 'auth__brand',
      href: '../marketing/index.html'
    }, h('img', {
      src: '../../assets/logo-mark.svg',
      alt: ''
    }), 'NovaHost'), body, h('div', {
      style: {
        textAlign: 'center',
        color: 'var(--text-disabled)',
        fontSize: 13
      }
    }, '© 2026 NovaHost')), h(Aside));
  }
  window.AuthApp = AuthApp;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/auth/AuthApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DashboardApp.jsx
try { (() => {
/* NovaHost — hPanel-style control panel (Vietnamese). Composes DS primitives. */
(function () {
  const React = window.React;
  const NS = window.NovaHostDesignSystem_d39808;
  const I = window.NHIcons;
  const {
    SidebarNav,
    Card,
    Badge,
    Button,
    IconButton,
    Tabs,
    Avatar,
    Switch,
    Tag,
    Input,
    Alert
  } = NS;
  const Ic = (name, props) => React.createElement(I[name], props || {});
  const h = React.createElement;
  const css = `
  .dash { display:flex; height:100vh; min-height:640px; background: var(--surface-page); font-family: var(--font-sans); }
  .dash__side { display:flex; flex-direction:column; }
  .dash__brand { display:flex; align-items:center; gap:10px; padding:18px 16px 10px; font-weight:800; font-size:19px; color: var(--purple-900); letter-spacing:-0.02em; }
  .dash__brand img { width:28px; height:28px; }
  .dash__main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
  .dash__top { display:flex; align-items:center; gap:16px; height:64px; padding:0 24px; background: var(--surface-card); border-bottom:1px solid var(--border); flex:none; }
  .dash__search { flex:1; max-width:420px; position:relative; display:flex; align-items:center; }
  .dash__search svg { position:absolute; left:13px; color: var(--text-muted); width:18px; height:18px; }
  .dash__search input { width:100%; border:1.5px solid var(--border-strong); border-radius: var(--radius-pill); background: var(--surface-page);
    padding:9px 14px 9px 40px; font-family:inherit; font-size:14px; color: var(--text-strong); }
  .dash__search input:focus { outline:none; border-color: var(--border-focus); box-shadow: var(--ring); background:#fff; }
  .dash__top-actions { display:flex; align-items:center; gap:10px; margin-left:auto; }
  .dash__content { flex:1; overflow:auto; padding:28px; }
  .dash__pagehead { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:22px; gap:16px; flex-wrap:wrap; }
  .dash__pagehead h1 { font-size:28px; letter-spacing:-0.02em; }
  .dash__pagehead p { color: var(--text-muted); margin-top:4px; font-size:15px; }

  .dash-stats { display:grid; grid-template-columns: repeat(4,1fr); gap:16px; margin-bottom:24px; }
  .dash-stat { padding:18px 20px; }
  .dash-stat__top { display:flex; align-items:center; justify-content:space-between; }
  .dash-stat__ic { width:38px; height:38px; border-radius: var(--radius-sm); display:flex; align-items:center; justify-content:center; background: var(--purple-50); color: var(--brand); }
  .dash-stat__ic svg { width:20px; height:20px; }
  .dash-stat__val { font-size:30px; font-weight:800; color: var(--text-heading); letter-spacing:-0.02em; margin-top:14px; }
  .dash-stat__lbl { font-size:13px; color: var(--text-muted); margin-top:2px; }
  .dash-stat__delta { font-size:12px; font-weight:700; }
  .up { color: var(--success-ink); } .down { color: var(--danger-ink); }

  .dash-sec-title { font-size:13px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color: var(--text-muted); margin:6px 0 12px; }

  .site-list { display:flex; flex-direction:column; gap:12px; }
  .site-row { display:flex; align-items:center; gap:16px; padding:16px 18px; }
  .site-fav { width:42px; height:42px; border-radius: var(--radius-md); background: var(--gradient-brand); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; flex:none; }
  .site-row__main { flex:1; min-width:0; }
  .site-row__name { font-weight:700; color: var(--text-heading); font-size:15px; display:flex; align-items:center; gap:8px; }
  .site-row__meta { color: var(--text-muted); font-size:13px; margin-top:3px; display:flex; gap:14px; }
  .site-row__meta span { display:flex; align-items:center; gap:5px; }
  .site-row__meta svg { width:14px; height:14px; }
  .site-row__actions { display:flex; align-items:center; gap:8px; flex:none; }
  .hidden-sm { }

  .dash-grid2 { display:grid; grid-template-columns: 1.5fr 1fr; gap:20px; }
  .usage-row { display:flex; flex-direction:column; gap:16px; }
  .usage { }
  .usage__top { display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px; }
  .usage__top b { color: var(--text-heading); } .usage__top span { color: var(--text-muted); }
  .usage__bar { height:8px; border-radius: var(--radius-pill); background: var(--gray-200); overflow:hidden; }
  .usage__fill { height:100%; border-radius: var(--radius-pill); background: var(--gradient-brand); }
  .usage__fill--warn { background: linear-gradient(90deg,#F5A623,#E5402C); }

  .settings-card { max-width:640px; }
  .set-row { display:flex; align-items:center; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--border); }
  .set-row:last-child { border-bottom:0; }
  .set-row__t { font-weight:600; color: var(--text-heading); font-size:15px; }
  .set-row__d { color: var(--text-muted); font-size:13px; margin-top:2px; }
  `;
  const SIDEBAR = [{
    section: 'Tổng quan'
  }, {
    id: 'overview',
    label: 'Trang chủ',
    icon: Ic('home')
  }, {
    id: 'sites',
    label: 'Website',
    icon: Ic('globe'),
    badge: 3
  }, {
    id: 'domains',
    label: 'Tên miền',
    icon: Ic('server')
  }, {
    section: 'Quản lý'
  }, {
    id: 'email',
    label: 'Email',
    icon: Ic('mail')
  }, {
    id: 'files',
    label: 'Trình quản lý tệp',
    icon: Ic('folder')
  }, {
    id: 'db',
    label: 'Cơ sở dữ liệu',
    icon: Ic('database')
  }, {
    id: 'ssl',
    label: 'SSL',
    icon: Ic('lock')
  }, {
    section: 'Tài khoản'
  }, {
    id: 'settings',
    label: 'Cài đặt',
    icon: Ic('settings')
  }];
  const SITES = [{
    i: 'TX',
    name: 'taphoaxanh.vn',
    plan: 'Premium',
    status: 'Hoạt động',
    sv: 'success',
    php: 'PHP 8.3',
    ssl: true,
    app: 'WordPress'
  }, {
    i: 'CS',
    name: 'caphesom.com',
    plan: 'Premium',
    status: 'Hoạt động',
    sv: 'success',
    php: 'PHP 8.2',
    ssl: true,
    app: 'WordPress'
  }, {
    i: 'BU',
    name: 'studiobuu.vn',
    plan: 'Business',
    status: 'Đang tạo',
    sv: 'warning',
    php: 'PHP 8.3',
    ssl: false,
    app: 'Tĩnh'
  }];
  function TopBar({
    title
  }) {
    return h('header', {
      className: 'dash__top'
    }, h('div', {
      className: 'dash__search'
    }, Ic('search'), h('input', {
      placeholder: 'Tìm website, tên miền, cài đặt...'
    })), h('div', {
      className: 'dash__top-actions'
    }, h(Button, {
      size: 'sm',
      leftIcon: Ic('plus', {
        width: 16,
        height: 16
      })
    }, 'Tạo mới'), h(IconButton, {
      label: 'Thông báo',
      variant: 'ghost',
      icon: Ic('bell', {
        width: 19,
        height: 19
      })
    }), h(Avatar, {
      name: 'Nguyễn An',
      size: 'sm',
      status: 'online'
    })));
  }
  function Stat({
    icon,
    val,
    lbl,
    delta,
    dir
  }) {
    return h(Card, {
      className: 'dash-stat',
      elevation: 'sm'
    }, h('div', {
      className: 'dash-stat__top'
    }, h('div', {
      className: 'dash-stat__ic'
    }, icon), delta && h('span', {
      className: 'dash-stat__delta ' + (dir || 'up')
    }, delta)), h('div', {
      className: 'dash-stat__val'
    }, val), h('div', {
      className: 'dash-stat__lbl'
    }, lbl));
  }
  function SiteRow({
    s,
    onOpen
  }) {
    return h(Card, {
      className: 'site-row',
      elevation: 'sm',
      hover: true
    }, h('div', {
      className: 'site-fav'
    }, s.i), h('div', {
      className: 'site-row__main'
    }, h('div', {
      className: 'site-row__name'
    }, s.name, h(Badge, {
      variant: s.sv,
      dot: true
    }, s.status)), h('div', {
      className: 'site-row__meta'
    }, h('span', null, Ic('wp', {
      width: 14,
      height: 14
    }), s.app), h('span', null, Ic('code', {
      width: 14,
      height: 14
    }), s.php), h('span', null, Ic('lock', {
      width: 14,
      height: 14
    }), s.ssl ? 'SSL bật' : 'Chưa có SSL'), h('span', null, s.plan))), h('div', {
      className: 'site-row__actions'
    }, h(Button, {
      variant: 'secondary',
      size: 'sm',
      onClick: onOpen
    }, 'Quản lý'), h(IconButton, {
      label: 'Tùy chọn',
      variant: 'ghost',
      icon: Ic('settings', {
        width: 18,
        height: 18
      })
    })));
  }
  function Overview({
    onOpenSite
  }) {
    return h('div', null, h('div', {
      className: 'dash__pagehead'
    }, h('div', null, h('h1', null, 'Chào mừng trở lại, An 👋'), h('p', null, 'Đây là tổng quan tài khoản hosting của bạn.')), h(Button, {
      leftIcon: Ic('plus', {
        width: 16,
        height: 16
      })
    }, 'Tạo website')), h('div', {
      className: 'dash-stats'
    }, h(Stat, {
      icon: Ic('globe'),
      val: '3',
      lbl: 'Website đang hoạt động',
      delta: '+1',
      dir: 'up'
    }), h(Stat, {
      icon: Ic('chart'),
      val: '12.480',
      lbl: 'Lượt truy cập / 30 ngày',
      delta: '+18%',
      dir: 'up'
    }), h(Stat, {
      icon: Ic('gauge'),
      val: '0,32s',
      lbl: 'Thời gian tải TB',
      delta: '-8%',
      dir: 'up'
    }), h(Stat, {
      icon: Ic('database'),
      val: '18/100 GB',
      lbl: 'Dung lượng đã dùng'
    })), h('div', {
      className: 'dash-grid2'
    }, h('div', null, h('div', {
      className: 'dash-sec-title'
    }, 'Website của bạn'), h('div', {
      className: 'site-list'
    }, SITES.map((s, i) => h(SiteRow, {
      key: i,
      s,
      onOpen: onOpenSite
    })))), h('div', null, h('div', {
      className: 'dash-sec-title'
    }, 'Tài nguyên'), h(Card, {
      elevation: 'sm',
      padding: 'md'
    }, h('div', {
      className: 'usage-row'
    }, usage('Dung lượng SSD', '18 / 100 GB', 18), usage('Băng thông', '34 / 200 GB', 17), usage('Tài khoản email', '6 / 10', 60), usage('CPU', '82%', 82, true))), h('div', {
      style: {
        marginTop: 16
      }
    }, h(Alert, {
      variant: 'warning',
      title: 'CPU đang cao'
    }, 'Cân nhắc nâng cấp gói để có thêm tài nguyên.')))));
  }
  const usage = (label, val, pct, warn) => h('div', {
    className: 'usage'
  }, h('div', {
    className: 'usage__top'
  }, h('b', null, label), h('span', null, val)), h('div', {
    className: 'usage__bar'
  }, h('div', {
    className: 'usage__fill' + (warn ? ' usage__fill--warn' : ''),
    style: {
      width: pct + '%'
    }
  })));
  function Sites({
    onOpenSite
  }) {
    const [tab, setTab] = React.useState('all');
    return h('div', null, h('div', {
      className: 'dash__pagehead'
    }, h('div', null, h('h1', null, 'Website'), h('p', null, 'Quản lý toàn bộ website của bạn tại một nơi.')), h(Button, {
      leftIcon: Ic('plus', {
        width: 16,
        height: 16
      })
    }, 'Tạo website')), h('div', {
      style: {
        marginBottom: 18
      }
    }, h(Tabs, {
      variant: 'underline',
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Tất cả',
        count: 3
      }, {
        id: 'active',
        label: 'Hoạt động',
        count: 2
      }, {
        id: 'building',
        label: 'Đang tạo',
        count: 1
      }]
    })), h('div', {
      className: 'site-list'
    }, SITES.map((s, i) => h(SiteRow, {
      key: i,
      s,
      onOpen: onOpenSite
    }))));
  }
  function Settings() {
    return h('div', null, h('div', {
      className: 'dash__pagehead'
    }, h('div', null, h('h1', null, 'Cài đặt'), h('p', null, 'Tùy chỉnh tài khoản và thông báo.'))), h(Card, {
      className: 'settings-card',
      padding: 'lg',
      elevation: 'sm'
    }, h('div', {
      style: {
        display: 'grid',
        gap: 16,
        marginBottom: 8
      }
    }, h(Input, {
      label: 'Tên hiển thị',
      defaultValue: 'Nguyễn An'
    }), h(Input, {
      label: 'Email',
      type: 'email',
      defaultValue: 'an@taphoaxanh.vn'
    })), h('div', {
      style: {
        marginTop: 8
      }
    }, setRow('Tự động gia hạn', 'Gia hạn gói trước khi hết hạn', true), setRow('Sao lưu hằng ngày', 'Tạo bản sao lưu tự động mỗi đêm', true), setRow('Thông báo qua email', 'Nhận cảnh báo bảo mật và hóa đơn', false)), h('div', {
      style: {
        marginTop: 22,
        display: 'flex',
        gap: 10
      }
    }, h(Button, null, 'Lưu thay đổi'), h(Button, {
      variant: 'ghost'
    }, 'Hủy'))));
  }
  const setRow = (t, d, on) => h('div', {
    className: 'set-row'
  }, h('div', null, h('div', {
    className: 'set-row__t'
  }, t), h('div', {
    className: 'set-row__d'
  }, d)), h(Switch, {
    defaultChecked: on
  }));
  const PLACEHOLDER = title => () => h('div', null, h('div', {
    className: 'dash__pagehead'
  }, h('div', null, h('h1', null, title))), h(Card, {
    padding: 'lg',
    elevation: 'sm'
  }, h('p', {
    style: {
      color: 'var(--text-muted)'
    }
  }, 'Khu vực “' + title + '” — nội dung mẫu chưa được dựng trong UI kit này.')));
  function DashboardApp() {
    const [view, setView] = React.useState('overview');
    const titleFor = {
      sites: 'Website',
      overview: 'Tổng quan',
      settings: 'Cài đặt'
    };
    let Body;
    if (view === 'overview') Body = h(Overview, {
      onOpenSite: () => setView('sites')
    });else if (view === 'sites') Body = h(Sites, {
      onOpenSite: () => setView('sites')
    });else if (view === 'settings') Body = h(Settings);else Body = h(PLACEHOLDER(SIDEBAR.find(x => x.id === view)?.label || 'Trang'));
    return h('div', {
      className: 'dash'
    }, h('style', null, css), h(SidebarNav, {
      className: 'dash__side',
      value: view,
      onChange: setView,
      items: SIDEBAR,
      header: h('a', {
        className: 'dash__brand',
        href: '../marketing/index.html'
      }, h('img', {
        src: '../../assets/logo-mark.svg',
        alt: ''
      }), 'NovaHost'),
      footer: h('div', {
        style: {
          marginTop: 'auto',
          paddingTop: 12
        }
      }, h('button', {
        className: 'nh-navitem',
        onClick: () => {
          window.location.href = '../auth/index.html';
        }
      }, h('span', {
        className: 'nh-navitem__icon'
      }, Ic('logout', {
        width: 19,
        height: 19
      })), h('span', {
        className: 'nh-navitem__label'
      }, 'Đăng xuất')))
    }), h('div', {
      className: 'dash__main'
    }, h(TopBar, {
      title: titleFor[view]
    }), h('div', {
      className: 'dash__content'
    }, Body)));
  }
  window.DashboardApp = DashboardApp;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DashboardApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/MarketingHome.jsx
try { (() => {
/* NovaHost — Marketing homepage (Vietnamese). Composes DS primitives. */
(function () {
  const React = window.React;
  const NS = window.NovaHostDesignSystem_d39808;
  const I = window.NHIcons;
  const {
    Navbar,
    Button,
    Badge,
    Card,
    PricingCard,
    Tabs,
    Avatar
  } = NS;
  const css = `
  .mkt { font-family: var(--font-sans); color: var(--text-body); background: var(--surface-card); }
  .mkt__container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }

  /* Hero */
  .mkt-hero { background: var(--gradient-hero); position: relative; overflow: hidden; padding-bottom: 90px; }
  .mkt-hero::after { content:''; position:absolute; inset:0; background-image: radial-gradient(rgba(255,255,255,.06) 1.3px, transparent 1.3px); background-size: 22px 22px; pointer-events:none; }
  .mkt-hero__inner { position: relative; z-index: 1; text-align: center; padding-top: 64px; }
  .mkt-hero h1 { color: #fff; font-size: 58px; line-height: 1.05; letter-spacing: -0.03em; font-weight: 800; max-width: 880px; margin: 18px auto 0; text-wrap: balance; }
  .mkt-hero h1 .hl { color: #B9A3F2; }
  .mkt-hero__sub { color: var(--text-on-dark-muted); font-size: 20px; max-width: 620px; margin: 20px auto 0; line-height: 1.55; }
  .mkt-eyebrow { display:inline-flex; align-items:center; gap:8px; background: rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.18); color:#EBE5FC; font-size:13px; font-weight:600; padding:7px 14px; border-radius: var(--radius-pill); }
  .mkt-eyebrow b { color:#fff; }
  .mkt-hero__cta { display:flex; gap:14px; justify-content:center; margin-top:34px; }
  .mkt-hero__stats { display:flex; gap:42px; justify-content:center; margin-top:40px; flex-wrap:wrap; }
  .mkt-stat { text-align:center; }
  .mkt-stat b { display:block; color:#fff; font-size:30px; font-weight:800; letter-spacing:-0.02em; }
  .mkt-stat span { color: var(--text-on-dark-muted); font-size:14px; }

  /* Browser mock */
  .mkt-mock { position: relative; z-index: 1; max-width: 940px; margin: 44px auto -150px; border-radius: var(--radius-xl);
    background: #fff; box-shadow: var(--shadow-xl); overflow: hidden; border: 1px solid rgba(255,255,255,.4); }
  .mkt-mock__bar { display:flex; align-items:center; gap:8px; padding: 12px 16px; background: var(--gray-100); border-bottom:1px solid var(--border); }
  .mkt-mock__dot { width:11px; height:11px; border-radius:50%; }
  .mkt-mock__url { flex:1; margin-left:10px; background:#fff; border:1px solid var(--border); border-radius: var(--radius-pill); font-size:12px; color: var(--text-muted); padding:6px 14px; font-family: var(--font-mono); }
  .mkt-mock__body { display:flex; min-height: 280px; }
  .mkt-mock__side { width: 210px; background: var(--surface-card); border-right:1px solid var(--border); padding: 14px 10px; }
  .mkt-mock__main { flex:1; padding: 22px; background: var(--surface-page); }
  .mkt-mini { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius: var(--radius-sm); font-size:13px; font-weight:500; color: var(--text-body); }
  .mkt-mini--on { background: var(--purple-50); color: var(--brand); font-weight:600; }
  .mkt-mini svg { width:17px; height:17px; }
  .mkt-statcards { display:grid; grid-template-columns: repeat(3,1fr); gap:12px; }
  .mkt-statcard { background:#fff; border:1px solid var(--border); border-radius: var(--radius-md); padding:14px; }
  .mkt-statcard span { font-size:12px; color: var(--text-muted); }
  .mkt-statcard b { display:block; font-size:22px; font-weight:800; color: var(--text-heading); margin-top:4px; }

  /* Logos */
  .mkt-logos { padding: 190px 0 30px; text-align:center; }
  .mkt-logos p { font-size:13px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color: var(--text-muted); }
  .mkt-logos__row { display:flex; gap:44px; justify-content:center; align-items:center; margin-top:20px; flex-wrap:wrap; opacity:.62; }
  .mkt-logos__row span { font-size:22px; font-weight:800; color: var(--gray-500); letter-spacing:-0.02em; }

  /* Sections */
  .mkt-sec { padding: 84px 0; }
  .mkt-sec--alt { background: var(--gradient-soft); }
  .mkt-sec__head { text-align:center; max-width:680px; margin:0 auto 52px; }
  .mkt-sec__head h2 { font-size:42px; letter-spacing:-0.03em; font-weight:800; }
  .mkt-sec__head p { font-size:19px; color: var(--text-muted); margin-top:14px; line-height:1.55; }

  .mkt-features { display:grid; grid-template-columns: repeat(3,1fr); gap:22px; }
  .mkt-feat { padding:28px; }
  .mkt-feat__ic { width:52px; height:52px; border-radius: var(--radius-md); display:flex; align-items:center; justify-content:center;
    background: var(--purple-50); color: var(--brand); margin-bottom:18px; }
  .mkt-feat__ic svg { width:26px; height:26px; }
  .mkt-feat h3 { font-size:20px; }
  .mkt-feat p { font-size:15px; color: var(--text-muted); margin-top:8px; line-height:1.55; }

  .mkt-pricing__toggle { display:flex; justify-content:center; margin-bottom:36px; }
  .mkt-pricing__grid { display:grid; grid-template-columns: repeat(3,1fr); gap:22px; align-items:stretch; max-width: 1040px; margin:0 auto; }

  /* Testimonial */
  .mkt-quote { max-width:820px; margin:0 auto; text-align:center; }
  .mkt-quote__stars { display:flex; gap:4px; justify-content:center; color: var(--sun-400); margin-bottom:22px; }
  .mkt-quote__stars svg { width:24px; height:24px; fill: var(--sun-400); stroke: var(--sun-400); }
  .mkt-quote p { font-size:28px; font-weight:600; color: var(--text-heading); line-height:1.4; letter-spacing:-0.01em; text-wrap:balance; }
  .mkt-quote__who { display:flex; gap:12px; align-items:center; justify-content:center; margin-top:26px; }
  .mkt-quote__who b { color: var(--text-heading); font-size:15px; display:block; }
  .mkt-quote__who span { color: var(--text-muted); font-size:14px; }

  /* CTA band */
  .mkt-cta { background: var(--gradient-brand); border-radius: var(--radius-2xl); padding: 54px; text-align:center; position:relative; overflow:hidden; }
  .mkt-cta::after { content:''; position:absolute; inset:0; background-image: radial-gradient(rgba(255,255,255,.10) 1.3px, transparent 1.3px); background-size: 20px 20px; }
  .mkt-cta__in { position:relative; z-index:1; }
  .mkt-cta h2 { color:#fff; font-size:40px; letter-spacing:-0.03em; }
  .mkt-cta p { color: #EBE5FC; font-size:19px; margin-top:12px; }

  /* Footer */
  .mkt-footer { background: var(--surface-inverse-2); color: var(--text-on-dark-muted); padding: 64px 0 30px; }
  .mkt-footer__grid { display:grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap:32px; }
  .mkt-footer__brand { display:flex; align-items:center; gap:10px; color:#fff; font-weight:800; font-size:22px; }
  .mkt-footer__brand img { width:30px; height:30px; }
  .mkt-footer p.tg { margin-top:14px; font-size:14px; max-width:260px; line-height:1.6; }
  .mkt-footer h4 { color:#fff; font-size:14px; font-weight:700; margin-bottom:14px; }
  .mkt-footer ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px; }
  .mkt-footer a { color: var(--text-on-dark-muted); font-size:14px; text-decoration:none; }
  .mkt-footer a:hover { color:#fff; }
  .mkt-footer__bar { border-top:1px solid rgba(255,255,255,.12); margin-top:48px; padding-top:22px; display:flex; justify-content:space-between; font-size:13px; }
  `;
  const Ic = (name, props) => React.createElement(I[name], props || {});
  function Hero({
    onStart
  }) {
    return React.createElement('section', {
      className: 'mkt-hero'
    }, React.createElement('div', {
      className: 'mkt__container mkt-hero__inner'
    }, React.createElement('span', {
      className: 'mkt-eyebrow'
    }, Ic('bolt', {
      width: 15,
      height: 15
    }), 'Ưu đãi ', React.createElement('b', null, '-78%'), ' cho năm đầu tiên'), React.createElement('h1', null, 'Lưu trữ web ', React.createElement('span', {
      className: 'hl'
    }, 'siêu tốc'), ' cho mọi dự án'), React.createElement('p', {
      className: 'mkt-hero__sub'
    }, 'Khởi chạy website trong vài phút với hosting NVMe, SSL miễn phí và uptime 99,9%. Hỗ trợ tiếng Việt 24/7.'), React.createElement('div', {
      className: 'mkt-hero__cta'
    }, React.createElement(Button, {
      size: 'lg',
      variant: 'inverse',
      rightIcon: Ic('arrow', {
        width: 18,
        height: 18
      }),
      onClick: onStart
    }, 'Bắt đầu ngay'), React.createElement(Button, {
      size: 'lg',
      variant: 'ghost',
      style: {
        color: '#fff'
      }
    }, 'Xem bảng giá')), React.createElement('div', {
      className: 'mkt-hero__stats'
    }, stat('99,9%', 'Uptime đảm bảo'), stat('< 0,4s', 'Thời gian phản hồi'), stat('24/7', 'Hỗ trợ tiếng Việt'), stat('30 ngày', 'Hoàn tiền'))), React.createElement(BrowserMock, null));
  }
  const stat = (b, s) => React.createElement('div', {
    className: 'mkt-stat'
  }, React.createElement('b', null, b), React.createElement('span', null, s));
  function BrowserMock() {
    const nav = [['home', 'Trang chủ', false], ['globe', 'Website', true], ['mail', 'Email', false], ['shield', 'SSL', false], ['chart', 'Thống kê', false]];
    return React.createElement('div', {
      className: 'mkt-mock'
    }, React.createElement('div', {
      className: 'mkt-mock__bar'
    }, React.createElement('span', {
      className: 'mkt-mock__dot',
      style: {
        background: '#FF5F57'
      }
    }), React.createElement('span', {
      className: 'mkt-mock__dot',
      style: {
        background: '#FEBC2E'
      }
    }), React.createElement('span', {
      className: 'mkt-mock__dot',
      style: {
        background: '#28C840'
      }
    }), React.createElement('span', {
      className: 'mkt-mock__url'
    }, 'hpanel.novahost.vn/websites')), React.createElement('div', {
      className: 'mkt-mock__body'
    }, React.createElement('div', {
      className: 'mkt-mock__side'
    }, nav.map(([ic, label, on], i) => React.createElement('div', {
      key: i,
      className: 'mkt-mini' + (on ? ' mkt-mini--on' : '')
    }, Ic(ic), label))), React.createElement('div', {
      className: 'mkt-mock__main'
    }, React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18
      }
    }, React.createElement('h3', {
      style: {
        fontSize: 18,
        margin: 0
      }
    }, 'Tổng quan'), React.createElement(Badge, {
      variant: 'success',
      dot: true
    }, 'Hoạt động')), React.createElement('div', {
      className: 'mkt-statcards'
    }, mockStat('Lượt truy cập', '12.480'), mockStat('Băng thông', '34 GB'), mockStat('Dung lượng', '18 GB')))));
  }
  const mockStat = (s, b) => React.createElement('div', {
    className: 'mkt-statcard'
  }, React.createElement('span', null, s), React.createElement('b', null, b));
  function Features() {
    const items = [['gauge', 'Hiệu năng NVMe', 'Ổ cứng NVMe nhanh gấp 3 lần SSD thường, giúp trang tải tức thì.'], ['shield', 'Bảo mật chủ động', 'SSL miễn phí, tường lửa web và quét mã độc tự động trên mọi gói.'], ['wp', 'Tối ưu WordPress', 'Cài đặt 1 chạm, tăng tốc bằng LiteSpeed và bản cập nhật tự động.'], ['headset', 'Hỗ trợ 24/7', 'Đội ngũ chuyên gia tiếng Việt sẵn sàng qua chat suốt ngày đêm.'], ['globe', 'Tên miền miễn phí', 'Nhận tên miền .com hoặc .vn miễn phí năm đầu với gói năm.'], ['cloud', 'Sao lưu hằng ngày', 'Tự động sao lưu và khôi phục dữ liệu chỉ với một cú nhấp.']];
    return React.createElement('section', {
      className: 'mkt-sec'
    }, React.createElement('div', {
      className: 'mkt__container'
    }, head('Mọi thứ bạn cần để phát triển', 'Công cụ mạnh mẽ, đóng gói đơn giản — phù hợp từ người mới đến chuyên gia.'), React.createElement('div', {
      className: 'mkt-features'
    }, items.map(([ic, t, d], i) => React.createElement(Card, {
      key: i,
      className: 'mkt-feat',
      hover: true,
      elevation: 'sm'
    }, React.createElement('div', {
      className: 'mkt-feat__ic'
    }, Ic(ic, {
      width: 26,
      height: 26
    })), React.createElement('h3', null, t), React.createElement('p', null, d))))));
  }
  const head = (t, s) => React.createElement('div', {
    className: 'mkt-sec__head'
  }, React.createElement('h2', null, t), React.createElement('p', null, s));
  function Pricing({
    onStart,
    billing,
    setBilling
  }) {
    const mult = billing === 'y' ? 1 : 1.9;
    const fmt = n => Math.round(n * mult).toLocaleString('vi-VN') + '.000';
    const plans = [{
      name: 'Khởi đầu',
      desc: 'Cho website cá nhân đầu tiên',
      base: 29,
      save: 'Tiết kiệm 70%',
      features: ['1 website', '25 GB dung lượng SSD', 'SSL miễn phí', 'Email miễn phí', {
        text: 'Sao lưu hằng ngày',
        included: false
      }]
    }, {
      name: 'Premium',
      desc: 'Phù hợp doanh nghiệp nhỏ',
      base: 49,
      save: 'Tiết kiệm 75%',
      popular: true,
      features: ['25 website', '100 GB dung lượng SSD', 'Tên miền miễn phí', 'SSL không giới hạn', 'Sao lưu hằng tuần']
    }, {
      name: 'Business',
      desc: 'Hiệu năng cao, lưu lượng lớn',
      base: 89,
      save: 'Tiết kiệm 78%',
      features: ['100 website', '200 GB NVMe', 'CDN miễn phí', 'Sao lưu hằng ngày', 'Tài nguyên gấp đôi']
    }];
    return React.createElement('section', {
      className: 'mkt-sec mkt-sec--alt'
    }, React.createElement('div', {
      className: 'mkt__container'
    }, head('Bảng giá minh bạch', 'Không phí ẩn. Hoàn tiền trong 30 ngày nếu bạn chưa hài lòng.'), React.createElement('div', {
      className: 'mkt-pricing__toggle'
    }, React.createElement(Tabs, {
      variant: 'pill',
      value: billing,
      onChange: setBilling,
      items: [{
        id: 'y',
        label: 'Theo năm · -78%'
      }, {
        id: 'm',
        label: 'Theo tháng'
      }]
    })), React.createElement('div', {
      className: 'mkt-pricing__grid'
    }, plans.map((p, i) => React.createElement(PricingCard, {
      key: i,
      name: p.name,
      description: p.desc,
      price: fmt(p.base),
      period: '/tháng',
      save: p.save,
      popular: p.popular,
      features: p.features,
      ctaLabel: 'Chọn gói',
      onSelect: onStart
    })))));
  }
  function Quote() {
    return React.createElement('section', {
      className: 'mkt-sec'
    }, React.createElement('div', {
      className: 'mkt__container mkt-quote'
    }, React.createElement('div', {
      className: 'mkt-quote__stars'
    }, [0, 1, 2, 3, 4].map(i => Ic('star', {
      key: i
    }))), React.createElement('p', null, '“Chuyển sang NovaHost là quyết định đúng đắn. Trang của chúng tôi tải nhanh hơn hẳn và đội hỗ trợ phản hồi trong vài phút, bằng tiếng Việt.”'), React.createElement('div', {
      className: 'mkt-quote__who'
    }, React.createElement(Avatar, {
      name: 'Phạm Mai',
      size: 'lg'
    }), React.createElement('div', {
      style: {
        textAlign: 'left'
      }
    }, React.createElement('b', null, 'Phạm Thị Mai'), React.createElement('span', null, 'Nhà sáng lập, Tạp hóa Xanh')))));
  }
  function CTA({
    onStart
  }) {
    return React.createElement('section', {
      className: 'mkt-sec'
    }, React.createElement('div', {
      className: 'mkt__container'
    }, React.createElement('div', {
      className: 'mkt-cta'
    }, React.createElement('div', {
      className: 'mkt-cta__in'
    }, React.createElement('h2', null, 'Sẵn sàng đưa ý tưởng lên mạng?'), React.createElement('p', null, 'Bắt đầu chỉ từ 29.000₫/tháng. Hủy bất cứ lúc nào.'), React.createElement('div', {
      style: {
        marginTop: 28
      }
    }, React.createElement(Button, {
      size: 'lg',
      variant: 'inverse',
      rightIcon: Ic('rocket', {
        width: 18,
        height: 18
      }),
      onClick: onStart
    }, 'Tạo website của bạn'))))));
  }
  function Footer() {
    const col = (h, links) => React.createElement('div', null, React.createElement('h4', null, h), React.createElement('ul', null, links.map((l, i) => React.createElement('li', {
      key: i
    }, React.createElement('a', {
      href: '#'
    }, l)))));
    return React.createElement('footer', {
      className: 'mkt-footer'
    }, React.createElement('div', {
      className: 'mkt__container'
    }, React.createElement('div', {
      className: 'mkt-footer__grid'
    }, React.createElement('div', null, React.createElement('div', {
      className: 'mkt-footer__brand'
    }, React.createElement('img', {
      src: '../../assets/logo-mark.svg',
      alt: ''
    }), 'NovaHost'), React.createElement('p', {
      className: 'tg'
    }, 'Nền tảng lưu trữ web giúp người Việt khởi chạy và phát triển trực tuyến.')), col('Sản phẩm', ['Web Hosting', 'Cloud Hosting', 'WordPress', 'Tên miền', 'Email doanh nghiệp']), col('Công ty', ['Về chúng tôi', 'Tuyển dụng', 'Đối tác', 'Liên hệ']), col('Hỗ trợ', ['Trung tâm trợ giúp', 'Hướng dẫn', 'Trạng thái hệ thống', 'Cộng đồng'])), React.createElement('div', {
      className: 'mkt-footer__bar'
    }, React.createElement('span', null, '© 2026 NovaHost. Bảo lưu mọi quyền.'), React.createElement('span', null, 'Điều khoản · Bảo mật · Cookie'))));
  }
  function MarketingHome() {
    const [billing, setBilling] = React.useState('y');
    const goStart = () => {
      window.location.href = '../auth/index.html';
    };
    return React.createElement('div', {
      className: 'mkt'
    }, React.createElement('style', null, css), React.createElement(Navbar, {
      dark: true,
      logoSrc: '../../assets/logo-mark.svg',
      brand: 'NovaHost',
      links: [{
        label: 'Hosting'
      }, {
        label: 'Tên miền'
      }, {
        label: 'WordPress'
      }, {
        label: 'Bảng giá'
      }, {
        label: 'Hỗ trợ'
      }],
      actions: React.createElement(React.Fragment, null, React.createElement(Button, {
        variant: 'ghost',
        size: 'sm',
        style: {
          color: '#fff'
        },
        as: 'a',
        href: '../auth/index.html'
      }, 'Đăng nhập'), React.createElement(Button, {
        variant: 'inverse',
        size: 'sm',
        as: 'a',
        href: '../auth/index.html'
      }, 'Bắt đầu'))
    }), React.createElement(Hero, {
      onStart: goStart
    }), React.createElement('section', {
      className: 'mkt-logos'
    }, React.createElement('div', {
      className: 'mkt__container'
    }, React.createElement('p', null, 'Được tin dùng bởi hơn 120.000 doanh nghiệp Việt'), React.createElement('div', {
      className: 'mkt-logos__row'
    }, ['Tạp hóa Xanh', 'Cà phê Sớm', 'DevVN', 'Áo Dài Co', 'Studio Bưu'].map((n, i) => React.createElement('span', {
      key: i
    }, n))))), React.createElement(Features, null), React.createElement(Pricing, {
      onStart: goStart,
      billing,
      setBilling
    }), React.createElement(Quote, null), React.createElement(CTA, {
      onStart: goStart
    }), React.createElement(Footer, null));
  }
  window.MarketingHome = MarketingHome;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/MarketingHome.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.PricingCard = __ds_scope.PricingCard;

})();
