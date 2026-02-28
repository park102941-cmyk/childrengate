var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name((_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[/* @__PURE__ */ Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name((_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var se = Object.create;
var H = Object.defineProperty;
var re = Object.getOwnPropertyDescriptor;
var ne = Object.getOwnPropertyNames;
var oe = Object.getPrototypeOf;
var ie = Object.prototype.hasOwnProperty;
var E = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "E");
var U = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "U");
var ce = /* @__PURE__ */ __name((e, t, s, a) => {
  if (t && typeof t == "object" || typeof t == "function") for (let n of ne(t)) !ie.call(e, n) && n !== s && H(e, n, { get: /* @__PURE__ */ __name(() => t[n], "get"), enumerable: !(a = re(t, n)) || a.enumerable });
  return e;
}, "ce");
var V = /* @__PURE__ */ __name((e, t, s) => (s = e != null ? se(oe(e)) : {}, ce(t || !e || !e.__esModule ? H(s, "default", { value: e, enumerable: true }) : s, e)), "V");
var x;
var d = E(() => {
  x = { collectedLocales: [] };
});
var _;
var h = E(() => {
  _ = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }, { src: "^/dashboard/admin/student/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/dashboard/admin/student/[id].rsc?nxtPid=$nxtPid" }, { src: "^/dashboard/admin/student/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/dashboard/admin/student/[id]?nxtPid=$nxtPid" }, { src: "^/p/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/p/[id].rsc?nxtPid=$nxtPid" }, { src: "^/p/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/p/[id]?nxtPid=$nxtPid" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|_hT9ksFlR\\-F6S8t4aA0JO)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { version: "15.1.7" }, crons: [] };
});
var m;
var u = E(() => {
  m = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/_hT9ksFlR-F6S8t4aA0JO/_buildManifest.js": { type: "static" }, "/_next/static/_hT9ksFlR-F6S8t4aA0JO/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/1392.d864494c091f8988.js": { type: "static" }, "/_next/static/chunks/1517-d607d4ffed8212d1.js": { type: "static" }, "/_next/static/chunks/183-4f22d8a9e4344f75.js": { type: "static" }, "/_next/static/chunks/2041.b83238defcba45f8.js": { type: "static" }, "/_next/static/chunks/2052-065af07d9a2e2101.js": { type: "static" }, "/_next/static/chunks/2510.b908a7a02815c902.js": { type: "static" }, "/_next/static/chunks/3902.7584573bcc2ceac6.js": { type: "static" }, "/_next/static/chunks/4bd1b696-e0714e7537a68763.js": { type: "static" }, "/_next/static/chunks/5032-f9b552e5853f54da.js": { type: "static" }, "/_next/static/chunks/5476.b5b7eaf7040ec81e.js": { type: "static" }, "/_next/static/chunks/5632.e685c8e9ffc4bbc1.js": { type: "static" }, "/_next/static/chunks/5714-0c00e3e3e73102b1.js": { type: "static" }, "/_next/static/chunks/5b86099a-558da3faac54dce0.js": { type: "static" }, "/_next/static/chunks/6032.821a3be100648601.js": { type: "static" }, "/_next/static/chunks/6608-1fcfb4f50002bdfd.js": { type: "static" }, "/_next/static/chunks/7011.2ef57cdfc454d5d7.js": { type: "static" }, "/_next/static/chunks/7767-7c22e5337a576fac.js": { type: "static" }, "/_next/static/chunks/8173-b7b433741baae8bb.js": { type: "static" }, "/_next/static/chunks/9006-f85b75ee7c2980b0.js": { type: "static" }, "/_next/static/chunks/9264-7186db33b31f76fd.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-44a0bafb965990dc.js": { type: "static" }, "/_next/static/chunks/app/admin/dashboard/page-e7a4f6e1874d1a18.js": { type: "static" }, "/_next/static/chunks/app/admin/page-704803f56ef54b05.js": { type: "static" }, "/_next/static/chunks/app/api/students/route-a18093a77653ca45.js": { type: "static" }, "/_next/static/chunks/app/api/sync-report/route-0220ca718411e098.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/dispatch/page-6d422d02c76fc386.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/events/page-9b8de083e351b097.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/guide/page-39b07a18ccce057b.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/layout-8e7d21bf3a4edca2.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/page-e899af255d464da1.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/qr/page-126b3348e4a8b647.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/settings/page-b17bbaee0ffb7126.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/sheets/page-d9f1b31c52bf1892.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/student/[id]/page-b065c1b6b5391882.js": { type: "static" }, "/_next/static/chunks/app/dashboard/parent/page-d71206fa0a77bf75.js": { type: "static" }, "/_next/static/chunks/app/dashboard/teacher/page-80c272c69f64abdf.js": { type: "static" }, "/_next/static/chunks/app/layout-b046342f21530e3f.js": { type: "static" }, "/_next/static/chunks/app/login/page-5caf2a87bd93961d.js": { type: "static" }, "/_next/static/chunks/app/p/[id]/page-0ffb119997f1dc1b.js": { type: "static" }, "/_next/static/chunks/app/page-0794123088eb4049.js": { type: "static" }, "/_next/static/chunks/app/privacy/page-d7b1c2b7ec31b4dc.js": { type: "static" }, "/_next/static/chunks/app/signup/page-11e13b7551e7e383.js": { type: "static" }, "/_next/static/chunks/app/terms/page-9713b03237cb3f2e.js": { type: "static" }, "/_next/static/chunks/d94474cc-a5dd035a228b9d40.js": { type: "static" }, "/_next/static/chunks/framework-aaee405aadff41a5.js": { type: "static" }, "/_next/static/chunks/main-5226d7e9370dc9c6.js": { type: "static" }, "/_next/static/chunks/main-app-b9ad1fe7ffb6d6c0.js": { type: "static" }, "/_next/static/chunks/pages/_app-5f03510007f8ee45.js": { type: "static" }, "/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-cac1fa6d7b0b0f4e.js": { type: "static" }, "/_next/static/css/ebd6490b2eda414b.css": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/children_gate_logo.png": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/hero-image.png": { type: "static" }, "/manifest.json": { type: "static" }, "/next.svg": { type: "static" }, "/vercel.svg": { type: "static" }, "/window.svg": { type: "static" }, "/api/students": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/students.func.js" }, "/api/students.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/students.func.js" }, "/api/sync-report": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/sync-report.func.js" }, "/api/sync-report.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/sync-report.func.js" }, "/dashboard/admin/student/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/admin/student/[id].func.js" }, "/dashboard/admin/student/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/dashboard/admin/student/[id].func.js" }, "/p/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/p/[id].func.js" }, "/p/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/p/[id].func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/admin/dashboard.html": { type: "override", path: "/admin/dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/dashboard/layout,_N_T_/admin/dashboard/page,_N_T_/admin/dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin/dashboard": { type: "override", path: "/admin/dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/dashboard/layout,_N_T_/admin/dashboard/page,_N_T_/admin/dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin/dashboard.rsc": { type: "override", path: "/admin/dashboard.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/dashboard/layout,_N_T_/admin/dashboard/page,_N_T_/admin/dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/admin.html": { type: "override", path: "/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin": { type: "override", path: "/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin.rsc": { type: "override", path: "/admin.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/dispatch.html": { type: "override", path: "/dashboard/admin/dispatch.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/dispatch/layout,_N_T_/dashboard/admin/dispatch/page,_N_T_/dashboard/admin/dispatch", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/dispatch": { type: "override", path: "/dashboard/admin/dispatch.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/dispatch/layout,_N_T_/dashboard/admin/dispatch/page,_N_T_/dashboard/admin/dispatch", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/dispatch.rsc": { type: "override", path: "/dashboard/admin/dispatch.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/dispatch/layout,_N_T_/dashboard/admin/dispatch/page,_N_T_/dashboard/admin/dispatch", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/events.html": { type: "override", path: "/dashboard/admin/events.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/events/layout,_N_T_/dashboard/admin/events/page,_N_T_/dashboard/admin/events", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/events": { type: "override", path: "/dashboard/admin/events.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/events/layout,_N_T_/dashboard/admin/events/page,_N_T_/dashboard/admin/events", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/events.rsc": { type: "override", path: "/dashboard/admin/events.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/events/layout,_N_T_/dashboard/admin/events/page,_N_T_/dashboard/admin/events", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/guide.html": { type: "override", path: "/dashboard/admin/guide.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/guide/layout,_N_T_/dashboard/admin/guide/page,_N_T_/dashboard/admin/guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/guide": { type: "override", path: "/dashboard/admin/guide.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/guide/layout,_N_T_/dashboard/admin/guide/page,_N_T_/dashboard/admin/guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/guide.rsc": { type: "override", path: "/dashboard/admin/guide.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/guide/layout,_N_T_/dashboard/admin/guide/page,_N_T_/dashboard/admin/guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/qr.html": { type: "override", path: "/dashboard/admin/qr.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/qr/layout,_N_T_/dashboard/admin/qr/page,_N_T_/dashboard/admin/qr", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/qr": { type: "override", path: "/dashboard/admin/qr.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/qr/layout,_N_T_/dashboard/admin/qr/page,_N_T_/dashboard/admin/qr", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/qr.rsc": { type: "override", path: "/dashboard/admin/qr.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/qr/layout,_N_T_/dashboard/admin/qr/page,_N_T_/dashboard/admin/qr", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/settings.html": { type: "override", path: "/dashboard/admin/settings.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/settings/layout,_N_T_/dashboard/admin/settings/page,_N_T_/dashboard/admin/settings", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/settings": { type: "override", path: "/dashboard/admin/settings.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/settings/layout,_N_T_/dashboard/admin/settings/page,_N_T_/dashboard/admin/settings", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/settings.rsc": { type: "override", path: "/dashboard/admin/settings.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/settings/layout,_N_T_/dashboard/admin/settings/page,_N_T_/dashboard/admin/settings", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/sheets.html": { type: "override", path: "/dashboard/admin/sheets.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/sheets/layout,_N_T_/dashboard/admin/sheets/page,_N_T_/dashboard/admin/sheets", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/sheets": { type: "override", path: "/dashboard/admin/sheets.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/sheets/layout,_N_T_/dashboard/admin/sheets/page,_N_T_/dashboard/admin/sheets", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/sheets.rsc": { type: "override", path: "/dashboard/admin/sheets.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/sheets/layout,_N_T_/dashboard/admin/sheets/page,_N_T_/dashboard/admin/sheets", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin.html": { type: "override", path: "/dashboard/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin": { type: "override", path: "/dashboard/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin.rsc": { type: "override", path: "/dashboard/admin.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/parent.html": { type: "override", path: "/dashboard/parent.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/parent/layout,_N_T_/dashboard/parent/page,_N_T_/dashboard/parent", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/parent": { type: "override", path: "/dashboard/parent.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/parent/layout,_N_T_/dashboard/parent/page,_N_T_/dashboard/parent", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/parent.rsc": { type: "override", path: "/dashboard/parent.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/parent/layout,_N_T_/dashboard/parent/page,_N_T_/dashboard/parent", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/teacher.html": { type: "override", path: "/dashboard/teacher.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/teacher/layout,_N_T_/dashboard/teacher/page,_N_T_/dashboard/teacher", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/teacher": { type: "override", path: "/dashboard/teacher.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/teacher/layout,_N_T_/dashboard/teacher/page,_N_T_/dashboard/teacher", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/teacher.rsc": { type: "override", path: "/dashboard/teacher.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/teacher/layout,_N_T_/dashboard/teacher/page,_N_T_/dashboard/teacher", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/favicon.ico": { type: "override", path: "/favicon.ico", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index.html": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index.rsc": { type: "override", path: "/index.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/login.html": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/login": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/login.rsc": { type: "override", path: "/login.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/privacy.html": { type: "override", path: "/privacy.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy/layout,_N_T_/privacy/page,_N_T_/privacy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/privacy": { type: "override", path: "/privacy.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy/layout,_N_T_/privacy/page,_N_T_/privacy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/privacy.rsc": { type: "override", path: "/privacy.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy/layout,_N_T_/privacy/page,_N_T_/privacy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/signup.html": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/signup": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/signup.rsc": { type: "override", path: "/signup.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/terms.html": { type: "override", path: "/terms.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms/layout,_N_T_/terms/page,_N_T_/terms", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/terms": { type: "override", path: "/terms.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms/layout,_N_T_/terms/page,_N_T_/terms", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/terms.rsc": { type: "override", path: "/terms.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms/layout,_N_T_/terms/page,_N_T_/terms", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } } };
});
var $ = U((ze, F) => {
  "use strict";
  d();
  h();
  u();
  function N(e, t) {
    e = String(e || "").trim();
    let s = e, a, n = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      a = e[0];
      let i = e.lastIndexOf(a);
      n += e.substring(i + 1), e = e.substring(1, i);
    }
    let r = 0;
    return e = ue(e, (i) => {
      if (/^\(\?[P<']/.test(i)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(i);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(i)}`);
        let l = i.substring(c[0].length, i.length - 1);
        return t && (t[r] = c[1]), r++, `(${l})`;
      }
      return i.substring(0, 3) === "(?:" || r++, i;
    }), e = e.replace(/\[:([^:]+):\]/g, (i, c) => N.characterClasses[c] || i), new N.PCRE(e, n, s, n, a);
  }
  __name(N, "N");
  function ue(e, t) {
    let s = 0, a = 0, n = false;
    for (let o = 0; o < e.length; o++) {
      let r = e[o];
      if (n) {
        n = false;
        continue;
      }
      switch (r) {
        case "(":
          a === 0 && (s = o), a++;
          break;
        case ")":
          if (a > 0 && (a--, a === 0)) {
            let i = o + 1, c = s === 0 ? "" : e.substring(0, s), l = e.substring(i), p = String(t(e.substring(s, i)));
            e = c + p + l, o = s;
          }
          break;
        case "\\":
          n = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(ue, "ue");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      constructor(a, n, o, r, i) {
        super(a, n), this.pcrePattern = o, this.pcreFlags = r, this.delimiter = i;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(N || (N = {}));
  N.prototype = N.PCRE.prototype;
  F.exports = N;
});
var Q = U((q) => {
  "use strict";
  d();
  h();
  u();
  q.parse = Te;
  q.serialize = ve;
  var Re = Object.prototype.toString, C = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function Te(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var s = {}, a = t || {}, n = a.decode || Se, o = 0; o < e.length; ) {
      var r = e.indexOf("=", o);
      if (r === -1) break;
      var i = e.indexOf(";", o);
      if (i === -1) i = e.length;
      else if (i < r) {
        o = e.lastIndexOf(";", r - 1) + 1;
        continue;
      }
      var c = e.slice(o, r).trim();
      if (s[c] === void 0) {
        var l = e.slice(r + 1, i).trim();
        l.charCodeAt(0) === 34 && (l = l.slice(1, -1)), s[c] = je(l, n);
      }
      o = i + 1;
    }
    return s;
  }
  __name(Te, "Te");
  function ve(e, t, s) {
    var a = s || {}, n = a.encode || Pe;
    if (typeof n != "function") throw new TypeError("option encode is invalid");
    if (!C.test(e)) throw new TypeError("argument name is invalid");
    var o = n(t);
    if (o && !C.test(o)) throw new TypeError("argument val is invalid");
    var r = e + "=" + o;
    if (a.maxAge != null) {
      var i = a.maxAge - 0;
      if (isNaN(i) || !isFinite(i)) throw new TypeError("option maxAge is invalid");
      r += "; Max-Age=" + Math.floor(i);
    }
    if (a.domain) {
      if (!C.test(a.domain)) throw new TypeError("option domain is invalid");
      r += "; Domain=" + a.domain;
    }
    if (a.path) {
      if (!C.test(a.path)) throw new TypeError("option path is invalid");
      r += "; Path=" + a.path;
    }
    if (a.expires) {
      var c = a.expires;
      if (!we(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      r += "; Expires=" + c.toUTCString();
    }
    if (a.httpOnly && (r += "; HttpOnly"), a.secure && (r += "; Secure"), a.priority) {
      var l = typeof a.priority == "string" ? a.priority.toLowerCase() : a.priority;
      switch (l) {
        case "low":
          r += "; Priority=Low";
          break;
        case "medium":
          r += "; Priority=Medium";
          break;
        case "high":
          r += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (a.sameSite) {
      var p = typeof a.sameSite == "string" ? a.sameSite.toLowerCase() : a.sameSite;
      switch (p) {
        case true:
          r += "; SameSite=Strict";
          break;
        case "lax":
          r += "; SameSite=Lax";
          break;
        case "strict":
          r += "; SameSite=Strict";
          break;
        case "none":
          r += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return r;
  }
  __name(ve, "ve");
  function Se(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(Se, "Se");
  function Pe(e) {
    return encodeURIComponent(e);
  }
  __name(Pe, "Pe");
  function we(e) {
    return Re.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(we, "we");
  function je(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(je, "je");
});
d();
h();
u();
d();
h();
u();
d();
h();
u();
var R = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
d();
h();
u();
d();
h();
u();
d();
h();
u();
d();
h();
u();
var D = V($());
function P(e, t, s) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let a = s ? "" : "i", n = [];
  return { match: (0, D.default)(`%${e}%${a}`, n).exec(t), captureGroupKeys: n };
}
__name(P, "P");
function T(e, t, s, { namedOnly: a } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (n, o) => {
    let r = s.indexOf(o);
    return a && r === -1 ? n : (r === -1 ? t[parseInt(o, 10)] : t[r + 1]) || "";
  });
}
__name(T, "T");
function I(e, { url: t, cookies: s, headers: a, routeDest: n }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? M(e.value, a.get(e.key), n) : { valid: a.has(e.key) };
    case "cookie": {
      let o = s[e.key];
      return o && e.value !== void 0 ? M(e.value, o, n) : { valid: o !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? M(e.value, t.searchParams.get(e.key), n) : { valid: t.searchParams.has(e.key) };
  }
}
__name(I, "I");
function M(e, t, s) {
  let { match: a, captureGroupKeys: n } = P(e, t);
  return s && a && n.length ? { valid: !!a, newRouteDest: T(s, a, n, { namedOnly: true }) } : { valid: !!a };
}
__name(M, "M");
d();
h();
u();
function B(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", R), new Request(e, { headers: t });
}
__name(B, "B");
d();
h();
u();
function y(e, t, s) {
  let a = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [n, o] of a) {
    let r = n.toLowerCase(), i = s?.match ? T(o, s.match, s.captureGroupKeys) : o;
    r === "set-cookie" ? e.append(r, i) : e.set(r, i);
  }
}
__name(y, "y");
function v(e) {
  return /^https?:\/\//.test(e);
}
__name(v, "v");
function g(e, t) {
  for (let [s, a] of t.entries()) {
    let n = /^nxtP(.+)$/.exec(s), o = /^nxtI(.+)$/.exec(s);
    n?.[1] ? (e.set(s, a), e.set(n[1], a)) : o?.[1] ? e.set(o[1], a.replace(/(\(\.+\))+/, "")) : (!e.has(s) || !!a && !e.getAll(s).includes(a)) && e.append(s, a);
  }
}
__name(g, "g");
function A(e, t) {
  let s = new URL(t, e.url);
  return g(s.searchParams, new URL(e.url).searchParams), s.pathname = s.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(s, e);
}
__name(A, "A");
function S(e) {
  return new Response(e.body, e);
}
__name(S, "S");
function L(e) {
  return e.split(",").map((t) => {
    let [s, a] = t.split(";"), n = parseFloat((a ?? "q=1").replace(/q *= */gi, ""));
    return [s.trim(), isNaN(n) ? 1 : n];
  }).sort((t, s) => s[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(L, "L");
d();
h();
u();
function O(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(O, "O");
async function w(e, { request: t, assetsFetcher: s, ctx: a }, { path: n, searchParams: o }) {
  let r, i = new URL(t.url);
  g(i.searchParams, o);
  let c = new Request(i, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let l = await import(e.entrypoint);
        try {
          r = await l.default(c, a);
        } catch (p) {
          let f = p;
          throw f.name === "TypeError" && f.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : p;
        }
        break;
      }
      case "override": {
        r = S(await s.fetch(A(c, e.path ?? n))), e.headers && y(r.headers, e.headers);
        break;
      }
      case "static": {
        r = await s.fetch(A(c, n));
        break;
      }
      default:
        r = new Response("Not Found", { status: 404 });
    }
  } catch (l) {
    return console.error(l), new Response("Internal Server Error", { status: 500 });
  }
  return S(r);
}
__name(w, "w");
function G(e, t) {
  let s = "^//?(?:", a = ")/(.*)$";
  return !e.startsWith(s) || !e.endsWith(a) ? false : e.slice(s.length, -a.length).split("|").every((o) => t.has(o));
}
__name(G, "G");
d();
h();
u();
function le(e, { protocol: t, hostname: s, port: a, pathname: n }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(s).test(e.hostname) || a && !new RegExp(a).test(e.port) || n && !new RegExp(n).test(e.pathname));
}
__name(le, "le");
function pe(e, t) {
  if (e.method !== "GET") return;
  let { origin: s, searchParams: a } = new URL(e.url), n = a.get("url"), o = Number.parseInt(a.get("w") ?? "", 10), r = Number.parseInt(a.get("q") ?? "75", 10);
  if (!n || Number.isNaN(o) || Number.isNaN(r) || !t?.sizes?.includes(o) || r < 0 || r > 100) return;
  let i = new URL(n, s);
  if (i.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let c = n.startsWith("//"), l = n.startsWith("/") && !c;
  if (!l && !t?.domains?.includes(i.hostname) && !t?.remotePatterns?.find((b) => le(i, b))) return;
  let p = e.headers.get("Accept") ?? "", f = t?.formats?.find((b) => p.includes(b))?.replace("image/", "");
  return { isRelative: l, imageUrl: i, options: { width: o, quality: r, format: f } };
}
__name(pe, "pe");
function _e(e, t, s) {
  let a = new Headers();
  if (s?.contentSecurityPolicy && a.set("Content-Security-Policy", s.contentSecurityPolicy), s?.contentDispositionType) {
    let o = t.pathname.split("/").pop(), r = o ? `${s.contentDispositionType}; filename="${o}"` : s.contentDispositionType;
    a.set("Content-Disposition", r);
  }
  e.headers.has("Cache-Control") || a.set("Cache-Control", `public, max-age=${s?.minimumCacheTTL ?? 60}`);
  let n = S(e);
  return y(n.headers, a), n;
}
__name(_e, "_e");
async function K(e, { buildOutput: t, assetsFetcher: s, imagesConfig: a }) {
  let n = pe(e, a);
  if (!n) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: o, imageUrl: r } = n, c = await (o && r.pathname in t ? s.fetch.bind(s) : fetch)(r);
  return _e(c, r, a);
}
__name(K, "K");
d();
h();
u();
d();
h();
u();
d();
h();
u();
async function j(e) {
  return import(e);
}
__name(j, "j");
var me = "x-vercel-cache-tags";
var xe = "x-next-cache-soft-tags";
var fe = /* @__PURE__ */ Symbol.for("__cloudflare-request-context__");
async function J(e) {
  let t = `https://${R}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let s = new URL(e.url), a = await ye();
    if (s.pathname === "/v1/suspense-cache/revalidate") {
      let o = s.searchParams.get("tags")?.split(",") ?? [];
      for (let r of o) await a.revalidateTag(r);
      return new Response(null, { status: 200 });
    }
    let n = s.pathname.replace("/v1/suspense-cache/", "");
    if (!n.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let o = z(e, xe), r = await a.get(n, { softTags: o });
        return r ? new Response(JSON.stringify(r.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (r.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let o = globalThis[fe], r = /* @__PURE__ */ __name(async () => {
          let i = await e.json();
          i.data.tags === void 0 && (i.tags ??= z(e, me) ?? []), await a.set(n, i);
        }, "r");
        return o ? o.ctx.waitUntil(r()) : await r(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (s) {
    return console.error(s), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
async function ye() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? W("kv") : W("cache-api");
}
__name(ye, "ye");
async function W(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, s = await j(t);
  return new s.default();
}
__name(W, "W");
function z(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(z, "z");
function X() {
  globalThis[Z] || (ge(), globalThis[Z] = true);
}
__name(X, "X");
function ge() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let s = new Request(...t), a = await Ne(s);
    return a || (a = await J(s), a) ? a : (be(s), e(s));
  };
}
__name(ge, "ge");
async function Ne(e) {
  if (e.url.startsWith("blob:")) try {
    let s = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, a = (await j(s)).default, n = { async arrayBuffer() {
      return a;
    }, get body() {
      return new ReadableStream({ start(o) {
        let r = Buffer.from(a);
        o.enqueue(r), o.close();
      } });
    }, async text() {
      return Buffer.from(a).toString();
    }, async json() {
      let o = Buffer.from(a);
      return JSON.stringify(o.toString());
    }, async blob() {
      return new Blob(a);
    } };
    return n.clone = () => ({ ...n }), n;
  } catch {
  }
  return null;
}
__name(Ne, "Ne");
function be(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(be, "be");
var Z = /* @__PURE__ */ Symbol.for("next-on-pages fetch patch");
d();
h();
u();
var Y = V(Q());
var k = class {
  static {
    __name(this, "k");
  }
  constructor(t, s, a, n, o) {
    this.routes = t;
    this.output = s;
    this.reqCtx = a;
    this.url = new URL(a.request.url), this.cookies = (0, Y.parse)(a.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), g(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = o?.find((r) => r.domain === this.url.hostname), this.locales = new Set(n.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: s, checkIntercept: a }) {
    let n = P(t.src, this.path, t.caseSensitive);
    if (!n.match || t.methods && !t.methods.map((r) => r.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let o = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((r) => {
      let i = I(r, o);
      return i.newRouteDest && (o.routeDest = i.newRouteDest), !i.valid;
    }) && !t.missing?.find((r) => I(r, o).valid) && !(s && t.status !== this.status)) {
      if (a && t.dest) {
        let r = /\/(\(\.+\))+/, i = r.test(t.dest), c = r.test(this.path);
        if (i && !c) return;
      }
      return { routeMatch: n, routeDest: o.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let s = "x-middleware-override-headers", a = t.headers.get(s);
    if (a) {
      let c = new Set(a.split(",").map((l) => l.trim()));
      for (let l of c.keys()) {
        let p = `x-middleware-request-${l}`, f = t.headers.get(p);
        this.reqCtx.request.headers.get(l) !== f && (f ? this.reqCtx.request.headers.set(l, f) : this.reqCtx.request.headers.delete(l)), t.headers.delete(p);
      }
      t.headers.delete(s);
    }
    let n = "x-middleware-rewrite", o = t.headers.get(n);
    if (o) {
      let c = new URL(o, this.url), l = this.url.hostname !== c.hostname;
      this.path = l ? `${c}` : c.pathname, g(this.searchParams, c.searchParams), t.headers.delete(n);
    }
    let r = "x-middleware-next";
    t.headers.get(r) ? t.headers.delete(r) : !o && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), y(this.reqCtx.request.headers, t.headers), y(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let s = t && this.output[t];
    if (!s || s.type !== "middleware") return this.status = 500, false;
    let a = await w(s, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), a.status === 500 ? (this.status = a.status, false) : (this.processMiddlewareResp(a), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, s, a) {
    !t.headers || (y(this.headers.normal, t.headers, { match: s, captureGroupKeys: a }), t.important && y(this.headers.important, t.headers, { match: s, captureGroupKeys: a }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, s, a) {
    if (!t.dest) return this.path;
    let n = this.path, o = t.dest;
    this.wildcardMatch && /\$wildcard/.test(o) && (o = o.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = T(o, s, a);
    let r = /\/index\.rsc$/i.test(this.path), i = /^\/(?:index)?$/i.test(n), c = /^\/__index\.prefetch\.rsc$/i.test(n);
    r && !i && !c && (this.path = n);
    let l = /\.rsc$/i.test(this.path), p = /\.prefetch\.rsc$/i.test(this.path), f = this.path in this.output;
    l && !p && !f && (this.path = this.path.replace(/\.rsc/i, ""));
    let b = new URL(this.path, this.url);
    return g(this.searchParams, b.searchParams), v(this.path) || (this.path = b.pathname), n;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: a, cookie: n } } = t, o = n && this.cookies[n], r = L(o ?? ""), i = L(this.reqCtx.request.headers.get("accept-language") ?? ""), p = [...r, ...i].map((f) => a[f]).filter(Boolean)[0];
    if (p) {
      !this.path.startsWith(p) && (this.headers.normal.set("location", p), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, s) {
    return !this.locales || s !== "miss" ? t : G(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, s) {
    let a = this.getLocaleFriendlyRoute(s, t), { routeMatch: n, routeDest: o } = this.checkRouteMatch(a, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, r = { ...a, dest: o };
    if (!n?.match || r.middlewarePath && this.middlewareInvoked.includes(r.middlewarePath)) return "skip";
    let { match: i, captureGroupKeys: c } = n;
    if (this.applyRouteOverrides(r), this.applyLocaleRedirects(r), !await this.runRouteMiddleware(r.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(r, i, c), this.applyRouteStatus(r);
    let p = this.applyRouteDest(r, i, c);
    if (r.check && !v(this.path)) if (p === this.path) {
      if (t !== "miss") return this.checkPhase(O(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !r.continue || r.status && r.status >= 300 && r.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let s = true;
    for (let o of this.routes[t]) {
      let r = await this.checkRoute(t, o);
      if (r === "error") return "error";
      if (r === "done") {
        s = false;
        break;
      }
    }
    if (t === "hit" || v(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let o of this.locales) {
      let r = new RegExp(`/${o}(/.*)`), c = this.path.match(r)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let a = this.path in this.output;
    if (!a && this.path.endsWith("/")) {
      let o = this.path.replace(/\/$/, "");
      a = o in this.output, a && (this.path = o);
    }
    if (t === "miss" && !a) {
      let o = !this.status || this.status < 400;
      this.status = o ? 404 : this.status;
    }
    let n = "miss";
    return a || t === "miss" || t === "error" ? n = "hit" : s && (n = O(t)), this.checkPhase(n);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let s = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), s;
  }
};
async function ee(e, t, s, a) {
  let n = new k(t.routes, s, e, a, t.wildcard), o = await te(n);
  return Ce(e, o, s);
}
__name(ee, "ee");
async function te(e, t = "none", s = false) {
  return await e.run(t) === "error" || !s && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
async function Ce(e, { path: t = "/404", status: s, headers: a, searchParams: n, body: o }, r) {
  let i = a.normal.get("location");
  if (i) {
    if (i !== a.middlewareLocation) {
      let p = [...n.keys()].length ? `?${n.toString()}` : "";
      a.normal.set("location", `${i ?? "/"}${p}`);
    }
    return new Response(null, { status: s, headers: a.normal });
  }
  let c;
  if (o !== void 0) c = new Response(o, { status: s });
  else if (v(t)) {
    let p = new URL(t);
    g(p.searchParams, n), c = await fetch(p, e.request);
  } else c = await w(r[t], e, { path: t, status: s, headers: a, searchParams: n });
  let l = a.normal;
  return y(l, c.headers), y(l, a.important), c = new Response(c.body, { ...c, status: s || c.status, headers: l }), c;
}
__name(Ce, "Ce");
d();
h();
u();
function ae() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: ke };
}
__name(ae, "ae");
function ke(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let s = Ee();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, s), s;
}
__name(ke, "ke");
function Ee() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name((t, s) => e.has(s) ? e.get(s) : Reflect.get(globalThis, s), "get"), set: /* @__PURE__ */ __name((t, s, a) => Me.has(s) ? Reflect.set(globalThis, s, a) : (e.set(s, a), true), "set") });
}
__name(Ee, "Ee");
var Me = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ie = Object.defineProperty;
var Ae = /* @__PURE__ */ __name((...e) => {
  let t = e[0], s = e[1], a = "__import_unsupported";
  if (!(s === a && typeof t == "object" && t !== null && a in t)) return Ie(...e);
}, "Ae");
globalThis.Object.defineProperty = Ae;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var Sa = { async fetch(e, t, s) {
  ae(), X();
  let a = await __ALSes_PROMISE__;
  if (!a) {
    let r = new URL(e.url), i = await t.ASSETS.fetch(`${r.protocol}//${r.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = i.ok ? i.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: n, requestContextAsyncLocalStorage: o } = a;
  return n.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: R }, async () => o.run({ env: t, ctx: s, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return K(e, { buildOutput: m, assetsFetcher: t.ASSETS, imagesConfig: _.images });
    let i = B(e);
    return ee({ request: i, ctx: s, assetsFetcher: t.ASSETS }, _, m, x);
  }));
} };
export {
  Sa as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.8289380354769124.mjs.map
