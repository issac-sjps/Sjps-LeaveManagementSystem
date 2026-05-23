import { initAuth, logout, isAdmin, isClerk } from "./auth.js";

const SITE_PASSWORD = "073411373";
const PW_KEY = "sjps_authed";

export function initPasswordGate() {
  const screen = document.getElementById("pw-screen");
  if (!screen) return;
  if (sessionStorage.getItem(PW_KEY) === "1") { screen.classList.add("hidden"); return; }
  const input = document.getElementById("pw-input");
  const btn   = document.getElementById("pw-btn");
  const err   = document.getElementById("pw-error");
  function attempt() {
    if (input.value === SITE_PASSWORD) {
      sessionStorage.setItem(PW_KEY, "1");
      screen.classList.add("hidden");
    } else { err.textContent = "密碼錯誤，請再試一次"; input.value = ""; input.focus(); }
  }
  btn.addEventListener("click", attempt);
  input.addEventListener("keydown", e => { if (e.key === "Enter") attempt(); });
}

// ── Detect if we are inside /pages/ subfolder ──────────────────
function inPages() {
  return window.location.pathname.includes("/pages/");
}

// Convert a "root-relative" path like "pages/foo.html" or "index.html"
// to the correct href depending on whether we're in /pages/ or at root.
function href(rootRelative) {
  if (rootRelative === "index.html") {
    return inPages() ? "../index.html" : "index.html";
  }
  // rootRelative is like "pages/sub-teachers.html"
  if (inPages()) {
    // strip the "pages/" prefix → just "sub-teachers.html"
    return rootRelative.replace(/^pages\//, "");
  }
  return rootRelative;
}

export function initLayout(activePage) {
  initPasswordGate();

  const navItems = [
    // public
    { id: "home",             label: "首頁",         icon: "🏠", path: "index.html",                     public: true },
    { id: "query",            label: "查詢",         icon: "🔍", path: "pages/query.html",               public: true },
    { id: "teachers",         label: "代課老師徵詢", icon: "👩‍🏫", path: "pages/teachers.html",            public: true },
    { id: "salary-table",     label: "薪資費率表",   icon: "💰", path: "pages/salary-table.html",        public: true },
    // admin / clerk section
    { divider: "管理功能" },
    { id: "register",         label: "代課登記",     icon: "📝", path: "pages/register.html",            admin: true },
    { id: "salary-calc",      label: "薪資計算",     icon: "🧮", path: "pages/salary-calc.html",         clerk: true },
    { id: "insurance",        label: "加保管理",     icon: "🛡️",  path: "pages/insurance.html",           clerk: true },
    // data section
    { divider: "資料管理" },
    { id: "sub-teachers",     label: "代課老師管理", icon: "👤", path: "pages/sub-teachers.html",        admin: true },
    { id: "school-teachers",  label: "校內老師管理", icon: "🏫", path: "pages/school-teachers.html",     admin: true },
    { id: "overtime",         label: "超鐘點設定",   icon: "⏰", path: "pages/overtime.html",            admin: true },
    { id: "settings",         label: "系統設定",     icon: "⚙️",  path: "pages/settings.html",            admin: true },
  ];

  initAuth((user, role) => {
    const nav = document.getElementById("sidebar-nav");
    if (!nav) return;
    nav.innerHTML = "";

    navItems.forEach(item => {
      // divider
      if (item.divider) {
        if (!user) return;
        const el = document.createElement("div");
        el.className = "nav-section-label";
        el.textContent = item.divider;
        nav.appendChild(el);
        return;
      }
      // permission check
      if (item.admin  && !isAdmin())  return;
      if (item.clerk  && !isClerk())  return;

      const a = document.createElement("a");
      a.className = "nav-item" + (item.id === activePage ? " active" : "");
      a.href = href(item.path);
      a.innerHTML = `<span class="icon">${item.icon}</span>${item.label}`;
      nav.appendChild(a);
    });

    // Footer: login / user chip
    const footer = document.getElementById("sidebar-footer");
    if (!footer) return;
    if (user) {
      const initials  = user.displayName ? user.displayName.slice(0, 2) : "？";
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
      footer.innerHTML = `<button class="btn btn-secondary w-full" id="btn-login">🔑 Google 登入</button>`;
      document.getElementById("btn-login").addEventListener("click", async () => {
        const { loginWithGoogle } = await import("./auth.js");
        await loginWithGoogle();
      });
    }
  });
}
