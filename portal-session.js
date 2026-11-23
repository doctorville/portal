// 닥터빌 업무 포털 — 공용 로그인 세션 (포털·제안서 생성기 등 doctorville.github.io 서비스가 함께 사용)
// 세션 저장 위치: localStorage 'portal.nhost.session' (같은 도메인 서비스끼리 공유)
// Nhost refresh token은 갱신할 때마다 바뀌므로, 다른 탭/서비스가 먼저 갱신한 값을 항상 먼저 확인한다.
(function () {
  'use strict';
  var C = window.PORTAL_CONFIG || {};
  var SUB = C.nhostSubdomain || 'ofujfkotwuqgiqiiygpq', REGION = C.nhostRegion || 'ap-southeast-1';
  var AUTH = 'https://' + SUB + '.auth.' + REGION + '.nhost.run/v1';
  var FN = 'https://' + SUB + '.functions.' + REGION + '.nhost.run/v1/portal';
  var STORE = 'portal.nhost.session';
  var PORTAL_URL = 'https://doctorville.github.io/portal/';
  var session = null, refreshing = null;

  function load() { try { var s = JSON.parse(localStorage.getItem(STORE) || 'null'); return s && s.accessToken && s.refreshToken ? s : null; } catch (e) { return null; } }
  function save(s) { session = s; try { s ? localStorage.setItem(STORE, JSON.stringify(s)) : localStorage.removeItem(STORE); } catch (e) {} }
  function fromNhost(s) { return { accessToken: s.accessToken, refreshToken: s.refreshToken, expiresAt: Date.now() + Number(s.accessTokenExpiresIn || 900) * 1000, user: s.user }; }
  function authErr(msg) { return Object.assign(new Error(msg || 'login'), { status: 401 }); }

  function post(url, body, token) {
    var h = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = 'Bearer ' + token;
    return fetch(url, { method: 'POST', headers: h, body: JSON.stringify(body || {}) }).then(function (r) {
      return r.text().then(function (t) { var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {} return { ok: r.ok, status: r.status, json: j }; });
    });
  }

  /** 유효한 액세스 토큰 (만료 1분 전이면 갱신) */
  function token() {
    var latest = load();
    if (latest && (!session || latest.refreshToken !== session.refreshToken)) session = latest;
    if (!session) return Promise.reject(authErr());
    if (session.expiresAt - Date.now() > 60000) return Promise.resolve(session.accessToken);
    if (!refreshing) {
      refreshing = post(AUTH + '/token', { refreshToken: session.refreshToken }).then(function (r) {
        if (!r.ok) {
          var again = load();
          if (again && again.refreshToken !== session.refreshToken && again.expiresAt - Date.now() > 60000) { session = again; return again.accessToken; }
          if (r.status === 401 || r.status === 400) save(null);
          throw authErr('expired');
        }
        var n = fromNhost(r.json); if (!n.user) n.user = session.user; save(n); return n.accessToken;
      }).finally(function () { refreshing = null; });
    }
    return refreshing;
  }

  function signOut() {
    var s = session || load(); save(null);
    if (s) post(AUTH + '/signout', { refreshToken: s.refreshToken }, s.accessToken).catch(function () {});
  }

  /** 포털 권한 조회: {email, role, account, services} */
  function me() {
    return token().then(function (t) { return post(FN + '/me', {}, t); }).then(function (r) {
      if (r.status === 401 || r.status === 403) { if (r.status === 403) save(null); throw authErr(r.json && r.json.error); }
      if (!r.ok) throw new Error('me ' + r.status);
      return r.json;
    });
  }

  /** 포털 함수 호출 (Bearer 자동) */
  function call(name, body) { return token().then(function (t) { return post(FN + '/' + name, body, t); }); }

  /** 포털 로그인 화면으로 이동 (로그인 후 돌아올 주소 포함) */
  function goLogin(next) {
    var u = PORTAL_URL + (next ? '?next=' + encodeURIComponent(next) : '');
    location.replace(u);
  }

  window.PortalSession = { AUTH: AUTH, FN: FN, STORE: STORE, PORTAL_URL: PORTAL_URL, load: load, save: save, fromNhost: fromNhost, post: post, token: token, signOut: signOut, me: me, call: call, goLogin: goLogin };
})();
