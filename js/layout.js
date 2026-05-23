import { initAuth, logout, isAdmin, isClerk } from "./auth.js";

const SITE_PASSWORD = "073411373";
const PW_KEY = "sjps_authed";

// ── Password gate ──────────────────────────────────────────────
export function initPasswordGate() {
  const screen = document.getElementById("pw-screen");
  if (!screen) return;
  if (sessionStorage.getItem(PW_KEY) === "1") {
    screen.classList.add("hidden");
    return;
  }
  const input = document.getElementById("pw-input");
  const btn = document.getElementById("pw-btn");
  const err = document.getElementById("pw-error");

  function attempt() {
    if (input.value === SITE_PASSWORD) {
      sessionStorage.setItem(PW_KEY, "1");
      screen.classList.add("hidden");
    } else {
      err.textContent = "密碼錯誤，請再試一次";
      input.value = "";
      input.focus();
    }
  }
  btn.addEventListener("click", attempt);
  input.addEventListener("keydown", e => { if (e.key === "Enter") attempt(); });
}

// ── Sidebar render ─────────────────────────────────────────────
export function initLayout(activePage) {
  initPasswordGate();

  const allNavItems = [
    { id: "home",           label: "首頁",         icon: "🏠", href: "../index.html",            public: true },
    { id: "query",          label: "查詢",         icon: "🔍", href: "query.html",               public: true },
    { id: "teachers",       label: "代課老師徵詢", icon: "👩‍🏫", href: "teachers.html",            public: true },
    { id: "salary-table",   label: "薪資費率表",   icon: "💰", href: "salary-table.html",        public: true },
    { id: "divider-admin",  label: "管理功能",     divider: true,                                public: false },
    { id: "register",       label: "代課登記",     icon: "📝", href: "register.html",            public: false },
    { id: "salary-calc",    label: "薪資計算",     icon: "🧮", href: "salary-calc.html",         clerk: true },
    { id: "insurance",      label: "加保管理",     icon: "🛡️", href: "insurance.html",           clerk: true },
    { id: "divider-data",   label: "資料管理",     divider: true,                                public: false },
    { id: "sub-teachers",   label: "代課老師管理", icon: "👤", href: "sub-teachers.html",        public: false },
    { id: "school-teachers",label: "校內老師管理", icon: "🏫", href: "school-teachers.html",     public: false },
    { id: "overtime",       label: "超鐘點設定",   icon: "⏰", href: "overtime.html",            public: false },
    { id: "settings",       label: "系統設定",     icon: "⚙️", href: "settings.html",            public: false },
  ];

  initAuth((user, role) => {
    const nav = document.getElementById("sidebar-nav");
    if (!nav) return;
    nav.innerHTML = "";

    allNavItems.forEach(item => {
      if (item.divider) {
        if (!user || (!isAdmin() && !isClerk())) return;
        const el = document.createElement("div");
        el.className = "nav-section-label";
        el.textContent = item.label;
        nav.appendChild(el);
        return;
      }
      // visibility rules
      if (!item.public && !isAdmin()) return;
      if (item.clerk && !isClerk()) return;

      const a = document.createElement("a");
      a.className = "nav-item" + (item.id === activePage ? " active" : "");
      a.href = item.href || "#";
      a.innerHTML = `<span class="icon">${item.icon}</span>${item.label}`;
      nav.appendChild(a);
    });

    // Auth area
    const footer = document.getElementById("sidebar-footer");
    if (!footer) return;
    if (user) {
      const initials = user.displayName ? user.displayName.slice(0,2) : "？";
      const roleLabel = role === "admin" ? "管理者" : role === "clerk" ? "幹事" : "訪客";
      footer.innerHTML = `
        <div class="user-chip">
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <div class="name">${user.displayName || user.email}</div>
            <div class="role">${roleLabel}</div>
          </div>
          <button class="btn-logout" id="btn-logout" title="登出">⏏</button>
        </div>`;
      document.getElementById("btn-logout").addEventListener("click", logout);
    } else {
      footer.innerHTML = `
        <button class="btn btn-secondary w-full" id="btn-login">
          🔑 Google 登入
        </button>`;
      document.getElementById("btn-login").addEventListener("click", async () => {
        const { loginWithGoogle } = await import("./auth.js");
        await loginWithGoogle();
      });
    }
  });
}
