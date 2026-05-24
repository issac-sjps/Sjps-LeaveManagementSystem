# 新莊國小代理代課管理系統

## Firebase Security Rules 設定說明

### 在 Firebase Console 套用規則（必做！）

1. 前往 [Firebase Console](https://console.firebase.google.com)
2. 選擇專案 `sjps-leavemanagementsystem`
3. 左側選單 → **Firestore Database** → **規則**
4. 把下面的規則貼上去，取代原有內容，按**發布**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isLoggedIn() {
      return request.auth != null;
    }
    function getRole() {
      return get(/databases/$(database)/documents/accounts/$(request.auth.uid)).data.role;
    }
    function isAdmin() {
      return isLoggedIn() && getRole() == 'admin';
    }
    function isClerk() {
      return isLoggedIn() && (getRole() == 'admin' || getRole() == 'clerk');
    }

    match /settings/{docId} {
      allow read:  if true;
      allow write: if isAdmin();
    }
    match /teachers/{docId} {
      allow read:  if true;
      allow write: if isAdmin();
    }
    match /schoolTeachers/{docId} {
      allow read:  if true;
      allow write: if isAdmin();
    }
    match /records/{docId} {
      allow read:  if true;
      allow write: if isAdmin();
    }
    match /insurance/{docId} {
      allow read:  if isClerk();
      allow write: if isClerk();
    }
    match /overtime/{docId} {
      allow read:  if true;
      allow write: if isAdmin();
    }
    match /accounts/{uid} {
      allow read:  if isLoggedIn() && (request.auth.uid == uid || isAdmin());
      allow write: if isAdmin();
    }
  }
}
```

### 權限說明

| Collection | 公開讀取 | 管理者寫入 | 幹事讀寫 |
|---|---|---|---|
| settings | ✅ | ✅ | — |
| teachers | ✅ | ✅ | — |
| schoolTeachers | ✅ | ✅ | — |
| records | ✅ | ✅ | — |
| insurance | ❌ | ✅ | ✅ |
| overtime | ✅ | ✅ | — |
| accounts | 本人 | ✅ | — |

> ⚠️ 首頁密碼（073411373）只是前端防護，不能阻擋直接呼叫 Firebase API。
> Firestore Rules 才是真正的資料安全防線。

### Google 登入設定

1. Firebase Console → Authentication → Sign-in method
2. 啟用 **Google**
3. 在「已授權網域」加入 `issac-sjps.github.io`

### 上線步驟

1. 套用 Firestore Rules（上方）
2. 啟用 Google 登入並加入授權網域
3. 開啟 `setup.html` 初始化管理員帳號與預設設定
4. 到「校內老師管理」輸入所有校內老師
5. 到「代課老師管理」輸入所有代課老師
6. 到「超鐘點設定」勾選各老師超鐘點星期
7. 開始使用！
