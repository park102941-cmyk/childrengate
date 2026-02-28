var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-RVbr6p/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-iOPFd0/bundledWorker-0.29697913091212824.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
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
        ownKeys: /* @__PURE__ */ __name2(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name2((_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name2((_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name2((_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[/* @__PURE__ */ Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name2(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name2((_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name2((_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name2((_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var re = Object.create;
var H = Object.defineProperty;
var se = Object.getOwnPropertyDescriptor;
var ne = Object.getOwnPropertyNames;
var oe = Object.getPrototypeOf;
var ie = Object.prototype.hasOwnProperty;
var E = /* @__PURE__ */ __name2((e, t) => () => (e && (t = e(e = 0)), t), "E");
var U = /* @__PURE__ */ __name2((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "U");
var de = /* @__PURE__ */ __name2((e, t, r, a) => {
  if (t && typeof t == "object" || typeof t == "function") for (let n of ne(t)) !ie.call(e, n) && n !== r && H(e, n, { get: /* @__PURE__ */ __name2(() => t[n], "get"), enumerable: !(a = se(t, n)) || a.enumerable });
  return e;
}, "de");
var V = /* @__PURE__ */ __name2((e, t, r) => (r = e != null ? re(oe(e)) : {}, de(t || !e || !e.__esModule ? H(r, "default", { value: e, enumerable: true }) : r, e)), "V");
var x;
var c = E(() => {
  x = { collectedLocales: [] };
});
var _;
var h = E(() => {
  _ = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/p(?:/([^/]+?))(?:/)?(?<rscsuff>\\.rsc)?$", dest: "/p-portal$rscsuff?id=$1", check: true }, { src: "^/dashboard/admin/student(?:/([^/]+?))(?:/)?(?<rscsuff>\\.rsc)?$", dest: "/dashboard/admin/student-detail$rscsuff?id=$1", check: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [{ src: "^/_next/data/(.*)$", dest: "/404", status: 404 }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|m91N8Yc5CQpEzg0pYacIa)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "_error.rsc.json": { path: "_error.rsc", contentType: "application/json" }, "_app.rsc.json": { path: "_app.rsc", contentType: "application/json" }, "_document.rsc.json": { path: "_document.rsc", contentType: "application/json" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { version: "15.1.7" }, crons: [] };
});
var m;
var u = E(() => {
  m = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_app.rsc.json": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc.json": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/_error.rsc.json": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_next/static/chunks/11.7790452089333ef0.js": { type: "static" }, "/_next/static/chunks/173-814af9653a2da584.js": { type: "static" }, "/_next/static/chunks/183-4f22d8a9e4344f75.js": { type: "static" }, "/_next/static/chunks/264-e216362e732a2f02.js": { type: "static" }, "/_next/static/chunks/32.f180619a5e6d23bd.js": { type: "static" }, "/_next/static/chunks/392.24ad9df603254d1c.js": { type: "static" }, "/_next/static/chunks/476.2a2f7e7e48b08e2f.js": { type: "static" }, "/_next/static/chunks/4bd1b696-6bf954e68bc4798c.js": { type: "static" }, "/_next/static/chunks/510.8120d4ca030e9613.js": { type: "static" }, "/_next/static/chunks/517-a4d39f69e915abaf.js": { type: "static" }, "/_next/static/chunks/52-2deec823b531ee8c.js": { type: "static" }, "/_next/static/chunks/5b86099a-99b92ef214d3cb80.js": { type: "static" }, "/_next/static/chunks/6-911e47473bfd3521.js": { type: "static" }, "/_next/static/chunks/608-e09064a87dbe72a0.js": { type: "static" }, "/_next/static/chunks/632.1a9177414490e6cb.js": { type: "static" }, "/_next/static/chunks/651-0245b06ed20ca79c.js": { type: "static" }, "/_next/static/chunks/714-1ba534d1a92702d7.js": { type: "static" }, "/_next/static/chunks/767-7485c0ff930c388a.js": { type: "static" }, "/_next/static/chunks/781.486167e1e47e5e5a.js": { type: "static" }, "/_next/static/chunks/898.bd76def3856bef13.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-a1a3950148666ec6.js": { type: "static" }, "/_next/static/chunks/app/admin/dashboard/page-259fdfefba0e06d0.js": { type: "static" }, "/_next/static/chunks/app/admin/page-4d4896805df3c994.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/dispatch/page-c24fe757c835d73b.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/events/page-f9462ab624ec5365.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/guide/page-3b44426914e9166a.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/layout-cc8b2cdb95b29fea.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/page-cc9d0a981464c170.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/qr/page-cfa178273a10bafd.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/settings/page-2a4b311c40f6728b.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/sheets/page-588d61d92f5f8872.js": { type: "static" }, "/_next/static/chunks/app/dashboard/admin/student-detail/page-23fd24e882692be4.js": { type: "static" }, "/_next/static/chunks/app/dashboard/parent/page-0594cfdc93079900.js": { type: "static" }, "/_next/static/chunks/app/dashboard/teacher/page-d7c44c1104267817.js": { type: "static" }, "/_next/static/chunks/app/layout-f9319b5b8923ea3e.js": { type: "static" }, "/_next/static/chunks/app/login/page-99ac11a37c3559ff.js": { type: "static" }, "/_next/static/chunks/app/p-portal/page-9d705790ff7ab2a1.js": { type: "static" }, "/_next/static/chunks/app/page-8b1e492f2023a2ab.js": { type: "static" }, "/_next/static/chunks/app/privacy/page-c027b6c4f333fcf9.js": { type: "static" }, "/_next/static/chunks/app/signup/page-b364709ff61a1c23.js": { type: "static" }, "/_next/static/chunks/app/terms/page-30ca84b7a71f4003.js": { type: "static" }, "/_next/static/chunks/d94474cc-6dcc46d32aa6a014.js": { type: "static" }, "/_next/static/chunks/framework-ac479e2484795ab1.js": { type: "static" }, "/_next/static/chunks/main-3ef1dd4ca2d35268.js": { type: "static" }, "/_next/static/chunks/main-app-b8020800bb2ece67.js": { type: "static" }, "/_next/static/chunks/pages/_app-abffdcde9d309a0c.js": { type: "static" }, "/_next/static/chunks/pages/_error-94b8133dd8229633.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-d14c2705e36dfed2.js": { type: "static" }, "/_next/static/css/7b91bef29097fcf1.css": { type: "static" }, "/_next/static/m91N8Yc5CQpEzg0pYacIa/_buildManifest.js": { type: "static" }, "/_next/static/m91N8Yc5CQpEzg0pYacIa/_ssgManifest.js": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/children_gate_logo.png": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/hero-image.png": { type: "static" }, "/manifest.json": { type: "static" }, "/next.svg": { type: "static" }, "/vercel.svg": { type: "static" }, "/window.svg": { type: "static" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/_error.rsc": { type: "override", path: "/_error.rsc.json", headers: { "content-type": "application/json" } }, "/_app.rsc": { type: "override", path: "/_app.rsc.json", headers: { "content-type": "application/json" } }, "/_document.rsc": { type: "override", path: "/_document.rsc.json", headers: { "content-type": "application/json" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/admin/dashboard.html": { type: "override", path: "/admin/dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/dashboard/layout,_N_T_/admin/dashboard/page,_N_T_/admin/dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin/dashboard": { type: "override", path: "/admin/dashboard.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/dashboard/layout,_N_T_/admin/dashboard/page,_N_T_/admin/dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin/dashboard.rsc": { type: "override", path: "/admin/dashboard.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/dashboard/layout,_N_T_/admin/dashboard/page,_N_T_/admin/dashboard", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/admin.html": { type: "override", path: "/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin": { type: "override", path: "/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/admin.rsc": { type: "override", path: "/admin.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/admin/layout,_N_T_/admin/page,_N_T_/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/dispatch.html": { type: "override", path: "/dashboard/admin/dispatch.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/dispatch/layout,_N_T_/dashboard/admin/dispatch/page,_N_T_/dashboard/admin/dispatch", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/dispatch": { type: "override", path: "/dashboard/admin/dispatch.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/dispatch/layout,_N_T_/dashboard/admin/dispatch/page,_N_T_/dashboard/admin/dispatch", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/dispatch.rsc": { type: "override", path: "/dashboard/admin/dispatch.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/dispatch/layout,_N_T_/dashboard/admin/dispatch/page,_N_T_/dashboard/admin/dispatch", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/events.html": { type: "override", path: "/dashboard/admin/events.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/events/layout,_N_T_/dashboard/admin/events/page,_N_T_/dashboard/admin/events", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/events": { type: "override", path: "/dashboard/admin/events.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/events/layout,_N_T_/dashboard/admin/events/page,_N_T_/dashboard/admin/events", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/events.rsc": { type: "override", path: "/dashboard/admin/events.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/events/layout,_N_T_/dashboard/admin/events/page,_N_T_/dashboard/admin/events", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/guide.html": { type: "override", path: "/dashboard/admin/guide.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/guide/layout,_N_T_/dashboard/admin/guide/page,_N_T_/dashboard/admin/guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/guide": { type: "override", path: "/dashboard/admin/guide.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/guide/layout,_N_T_/dashboard/admin/guide/page,_N_T_/dashboard/admin/guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/guide.rsc": { type: "override", path: "/dashboard/admin/guide.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/guide/layout,_N_T_/dashboard/admin/guide/page,_N_T_/dashboard/admin/guide", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/qr.html": { type: "override", path: "/dashboard/admin/qr.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/qr/layout,_N_T_/dashboard/admin/qr/page,_N_T_/dashboard/admin/qr", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/qr": { type: "override", path: "/dashboard/admin/qr.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/qr/layout,_N_T_/dashboard/admin/qr/page,_N_T_/dashboard/admin/qr", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/qr.rsc": { type: "override", path: "/dashboard/admin/qr.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/qr/layout,_N_T_/dashboard/admin/qr/page,_N_T_/dashboard/admin/qr", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/settings.html": { type: "override", path: "/dashboard/admin/settings.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/settings/layout,_N_T_/dashboard/admin/settings/page,_N_T_/dashboard/admin/settings", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/settings": { type: "override", path: "/dashboard/admin/settings.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/settings/layout,_N_T_/dashboard/admin/settings/page,_N_T_/dashboard/admin/settings", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/settings.rsc": { type: "override", path: "/dashboard/admin/settings.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/settings/layout,_N_T_/dashboard/admin/settings/page,_N_T_/dashboard/admin/settings", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/sheets.html": { type: "override", path: "/dashboard/admin/sheets.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/sheets/layout,_N_T_/dashboard/admin/sheets/page,_N_T_/dashboard/admin/sheets", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/sheets": { type: "override", path: "/dashboard/admin/sheets.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/sheets/layout,_N_T_/dashboard/admin/sheets/page,_N_T_/dashboard/admin/sheets", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/sheets.rsc": { type: "override", path: "/dashboard/admin/sheets.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/sheets/layout,_N_T_/dashboard/admin/sheets/page,_N_T_/dashboard/admin/sheets", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin/student-detail.html": { type: "override", path: "/dashboard/admin/student-detail.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/student-detail/layout,_N_T_/dashboard/admin/student-detail/page,_N_T_/dashboard/admin/student-detail", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/student-detail": { type: "override", path: "/dashboard/admin/student-detail.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/student-detail/layout,_N_T_/dashboard/admin/student-detail/page,_N_T_/dashboard/admin/student-detail", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin/student-detail.rsc": { type: "override", path: "/dashboard/admin/student-detail.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/student-detail/layout,_N_T_/dashboard/admin/student-detail/page,_N_T_/dashboard/admin/student-detail", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/admin.html": { type: "override", path: "/dashboard/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin": { type: "override", path: "/dashboard/admin.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/admin.rsc": { type: "override", path: "/dashboard/admin.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/admin/layout,_N_T_/dashboard/admin/page,_N_T_/dashboard/admin", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/parent.html": { type: "override", path: "/dashboard/parent.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/parent/layout,_N_T_/dashboard/parent/page,_N_T_/dashboard/parent", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/parent": { type: "override", path: "/dashboard/parent.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/parent/layout,_N_T_/dashboard/parent/page,_N_T_/dashboard/parent", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/parent.rsc": { type: "override", path: "/dashboard/parent.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/parent/layout,_N_T_/dashboard/parent/page,_N_T_/dashboard/parent", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/dashboard/teacher.html": { type: "override", path: "/dashboard/teacher.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/teacher/layout,_N_T_/dashboard/teacher/page,_N_T_/dashboard/teacher", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/teacher": { type: "override", path: "/dashboard/teacher.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/teacher/layout,_N_T_/dashboard/teacher/page,_N_T_/dashboard/teacher", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/dashboard/teacher.rsc": { type: "override", path: "/dashboard/teacher.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/dashboard/layout,_N_T_/dashboard/teacher/layout,_N_T_/dashboard/teacher/page,_N_T_/dashboard/teacher", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/favicon.ico": { type: "override", path: "/favicon.ico", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index.html": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/": { type: "override", path: "/index.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/index.rsc": { type: "override", path: "/index.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/page,_N_T_/", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/login.html": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/login": { type: "override", path: "/login.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/login.rsc": { type: "override", path: "/login.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/login/layout,_N_T_/login/page,_N_T_/login", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/p-portal.html": { type: "override", path: "/p-portal.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/p-portal/layout,_N_T_/p-portal/page,_N_T_/p-portal", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/p-portal": { type: "override", path: "/p-portal.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/p-portal/layout,_N_T_/p-portal/page,_N_T_/p-portal", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/p-portal.rsc": { type: "override", path: "/p-portal.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/p-portal/layout,_N_T_/p-portal/page,_N_T_/p-portal", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/privacy.html": { type: "override", path: "/privacy.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy/layout,_N_T_/privacy/page,_N_T_/privacy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/privacy": { type: "override", path: "/privacy.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy/layout,_N_T_/privacy/page,_N_T_/privacy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/privacy.rsc": { type: "override", path: "/privacy.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/privacy/layout,_N_T_/privacy/page,_N_T_/privacy", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/signup.html": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/signup": { type: "override", path: "/signup.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/signup.rsc": { type: "override", path: "/signup.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/signup/layout,_N_T_/signup/page,_N_T_/signup", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } }, "/terms.html": { type: "override", path: "/terms.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms/layout,_N_T_/terms/page,_N_T_/terms", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/terms": { type: "override", path: "/terms.html", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms/layout,_N_T_/terms/page,_N_T_/terms", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch" } }, "/terms.rsc": { type: "override", path: "/terms.rsc", headers: { "x-nextjs-stale-time": "4294967294", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/terms/layout,_N_T_/terms/page,_N_T_/terms", vary: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch", "content-type": "text/x-component" } } };
});
var F = U((We, $) => {
  "use strict";
  c();
  h();
  u();
  function N(e, t) {
    e = String(e || "").trim();
    let r = e, a, n = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      a = e[0];
      let i = e.lastIndexOf(a);
      n += e.substring(i + 1), e = e.substring(1, i);
    }
    let s = 0;
    return e = ue(e, (i) => {
      if (/^\(\?[P<']/.test(i)) {
        let d = /^\(\?P?[<']([^>']+)[>']/.exec(i);
        if (!d) throw new Error(`Failed to extract named captures from ${JSON.stringify(i)}`);
        let l = i.substring(d[0].length, i.length - 1);
        return t && (t[s] = d[1]), s++, `(${l})`;
      }
      return i.substring(0, 3) === "(?:" || s++, i;
    }), e = e.replace(/\[:([^:]+):\]/g, (i, d) => N.characterClasses[d] || i), new N.PCRE(e, n, r, n, a);
  }
  __name(N, "N");
  __name2(N, "N");
  function ue(e, t) {
    let r = 0, a = 0, n = false;
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      if (n) {
        n = false;
        continue;
      }
      switch (s) {
        case "(":
          a === 0 && (r = o), a++;
          break;
        case ")":
          if (a > 0 && (a--, a === 0)) {
            let i = o + 1, d = r === 0 ? "" : e.substring(0, r), l = e.substring(i), p = String(t(e.substring(r, i)));
            e = d + p + l, o = r;
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
  __name2(ue, "ue");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      static {
        __name2(this, "t");
      }
      constructor(a, n, o, s, i) {
        super(a, n), this.pcrePattern = o, this.pcreFlags = s, this.delimiter = i;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(N || (N = {}));
  N.prototype = N.PCRE.prototype;
  $.exports = N;
});
var X = U((q) => {
  "use strict";
  c();
  h();
  u();
  q.parse = Te;
  q.serialize = Se;
  var be = Object.prototype.toString, C = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function Te(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var r = {}, a = t || {}, n = a.decode || ve, o = 0; o < e.length; ) {
      var s = e.indexOf("=", o);
      if (s === -1) break;
      var i = e.indexOf(";", o);
      if (i === -1) i = e.length;
      else if (i < s) {
        o = e.lastIndexOf(";", s - 1) + 1;
        continue;
      }
      var d = e.slice(o, s).trim();
      if (r[d] === void 0) {
        var l = e.slice(s + 1, i).trim();
        l.charCodeAt(0) === 34 && (l = l.slice(1, -1)), r[d] = je(l, n);
      }
      o = i + 1;
    }
    return r;
  }
  __name(Te, "Te");
  __name2(Te, "Te");
  function Se(e, t, r) {
    var a = r || {}, n = a.encode || Pe;
    if (typeof n != "function") throw new TypeError("option encode is invalid");
    if (!C.test(e)) throw new TypeError("argument name is invalid");
    var o = n(t);
    if (o && !C.test(o)) throw new TypeError("argument val is invalid");
    var s = e + "=" + o;
    if (a.maxAge != null) {
      var i = a.maxAge - 0;
      if (isNaN(i) || !isFinite(i)) throw new TypeError("option maxAge is invalid");
      s += "; Max-Age=" + Math.floor(i);
    }
    if (a.domain) {
      if (!C.test(a.domain)) throw new TypeError("option domain is invalid");
      s += "; Domain=" + a.domain;
    }
    if (a.path) {
      if (!C.test(a.path)) throw new TypeError("option path is invalid");
      s += "; Path=" + a.path;
    }
    if (a.expires) {
      var d = a.expires;
      if (!we(d) || isNaN(d.valueOf())) throw new TypeError("option expires is invalid");
      s += "; Expires=" + d.toUTCString();
    }
    if (a.httpOnly && (s += "; HttpOnly"), a.secure && (s += "; Secure"), a.priority) {
      var l = typeof a.priority == "string" ? a.priority.toLowerCase() : a.priority;
      switch (l) {
        case "low":
          s += "; Priority=Low";
          break;
        case "medium":
          s += "; Priority=Medium";
          break;
        case "high":
          s += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (a.sameSite) {
      var p = typeof a.sameSite == "string" ? a.sameSite.toLowerCase() : a.sameSite;
      switch (p) {
        case true:
          s += "; SameSite=Strict";
          break;
        case "lax":
          s += "; SameSite=Lax";
          break;
        case "strict":
          s += "; SameSite=Strict";
          break;
        case "none":
          s += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return s;
  }
  __name(Se, "Se");
  __name2(Se, "Se");
  function ve(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(ve, "ve");
  __name2(ve, "ve");
  function Pe(e) {
    return encodeURIComponent(e);
  }
  __name(Pe, "Pe");
  __name2(Pe, "Pe");
  function we(e) {
    return be.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(we, "we");
  __name2(we, "we");
  function je(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(je, "je");
  __name2(je, "je");
});
c();
h();
u();
c();
h();
u();
c();
h();
u();
var b = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
c();
h();
u();
c();
h();
u();
c();
h();
u();
c();
h();
u();
var D = V(F());
function P(e, t, r) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let a = r ? "" : "i", n = [];
  return { match: (0, D.default)(`%${e}%${a}`, n).exec(t), captureGroupKeys: n };
}
__name(P, "P");
__name2(P, "P");
function T(e, t, r, { namedOnly: a } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (n, o) => {
    let s = r.indexOf(o);
    return a && s === -1 ? n : (s === -1 ? t[parseInt(o, 10)] : t[s + 1]) || "";
  });
}
__name(T, "T");
__name2(T, "T");
function I(e, { url: t, cookies: r, headers: a, routeDest: n }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? M(e.value, a.get(e.key), n) : { valid: a.has(e.key) };
    case "cookie": {
      let o = r[e.key];
      return o && e.value !== void 0 ? M(e.value, o, n) : { valid: o !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? M(e.value, t.searchParams.get(e.key), n) : { valid: t.searchParams.has(e.key) };
  }
}
__name(I, "I");
__name2(I, "I");
function M(e, t, r) {
  let { match: a, captureGroupKeys: n } = P(e, t);
  return r && a && n.length ? { valid: !!a, newRouteDest: T(r, a, n, { namedOnly: true }) } : { valid: !!a };
}
__name(M, "M");
__name2(M, "M");
c();
h();
u();
function B(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", b), new Request(e, { headers: t });
}
__name(B, "B");
__name2(B, "B");
c();
h();
u();
function f(e, t, r) {
  let a = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [n, o] of a) {
    let s = n.toLowerCase(), i = r?.match ? T(o, r.match, r.captureGroupKeys) : o;
    s === "set-cookie" ? e.append(s, i) : e.set(s, i);
  }
}
__name(f, "f");
__name2(f, "f");
function S(e) {
  return /^https?:\/\//.test(e);
}
__name(S, "S");
__name2(S, "S");
function g(e, t) {
  for (let [r, a] of t.entries()) {
    let n = /^nxtP(.+)$/.exec(r), o = /^nxtI(.+)$/.exec(r);
    n?.[1] ? (e.set(r, a), e.set(n[1], a)) : o?.[1] ? e.set(o[1], a.replace(/(\(\.+\))+/, "")) : (!e.has(r) || !!a && !e.getAll(r).includes(a)) && e.append(r, a);
  }
}
__name(g, "g");
__name2(g, "g");
function A(e, t) {
  let r = new URL(t, e.url);
  return g(r.searchParams, new URL(e.url).searchParams), r.pathname = r.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(r, e);
}
__name(A, "A");
__name2(A, "A");
function v(e) {
  return new Response(e.body, e);
}
__name(v, "v");
__name2(v, "v");
function L(e) {
  return e.split(",").map((t) => {
    let [r, a] = t.split(";"), n = parseFloat((a ?? "q=1").replace(/q *= */gi, ""));
    return [r.trim(), isNaN(n) ? 1 : n];
  }).sort((t, r) => r[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(L, "L");
__name2(L, "L");
c();
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
__name2(O, "O");
async function w(e, { request: t, assetsFetcher: r, ctx: a }, { path: n, searchParams: o }) {
  let s, i = new URL(t.url);
  g(i.searchParams, o);
  let d = new Request(i, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let l = await import(e.entrypoint);
        try {
          s = await l.default(d, a);
        } catch (p) {
          let y = p;
          throw y.name === "TypeError" && y.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : p;
        }
        break;
      }
      case "override": {
        s = v(await r.fetch(A(d, e.path ?? n))), e.headers && f(s.headers, e.headers);
        break;
      }
      case "static": {
        s = await r.fetch(A(d, n));
        break;
      }
      default:
        s = new Response("Not Found", { status: 404 });
    }
  } catch (l) {
    return console.error(l), new Response("Internal Server Error", { status: 500 });
  }
  return v(s);
}
__name(w, "w");
__name2(w, "w");
function G(e, t) {
  let r = "^//?(?:", a = ")/(.*)$";
  return !e.startsWith(r) || !e.endsWith(a) ? false : e.slice(r.length, -a.length).split("|").every((o) => t.has(o));
}
__name(G, "G");
__name2(G, "G");
c();
h();
u();
function le(e, { protocol: t, hostname: r, port: a, pathname: n }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(r).test(e.hostname) || a && !new RegExp(a).test(e.port) || n && !new RegExp(n).test(e.pathname));
}
__name(le, "le");
__name2(le, "le");
function pe(e, t) {
  if (e.method !== "GET") return;
  let { origin: r, searchParams: a } = new URL(e.url), n = a.get("url"), o = Number.parseInt(a.get("w") ?? "", 10), s = Number.parseInt(a.get("q") ?? "75", 10);
  if (!n || Number.isNaN(o) || Number.isNaN(s) || !t?.sizes?.includes(o) || s < 0 || s > 100) return;
  let i = new URL(n, r);
  if (i.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let d = n.startsWith("//"), l = n.startsWith("/") && !d;
  if (!l && !t?.domains?.includes(i.hostname) && !t?.remotePatterns?.find((R) => le(i, R))) return;
  let p = e.headers.get("Accept") ?? "", y = t?.formats?.find((R) => p.includes(R))?.replace("image/", "");
  return { isRelative: l, imageUrl: i, options: { width: o, quality: s, format: y } };
}
__name(pe, "pe");
__name2(pe, "pe");
function _e(e, t, r) {
  let a = new Headers();
  if (r?.contentSecurityPolicy && a.set("Content-Security-Policy", r.contentSecurityPolicy), r?.contentDispositionType) {
    let o = t.pathname.split("/").pop(), s = o ? `${r.contentDispositionType}; filename="${o}"` : r.contentDispositionType;
    a.set("Content-Disposition", s);
  }
  e.headers.has("Cache-Control") || a.set("Cache-Control", `public, max-age=${r?.minimumCacheTTL ?? 60}`);
  let n = v(e);
  return f(n.headers, a), n;
}
__name(_e, "_e");
__name2(_e, "_e");
async function z(e, { buildOutput: t, assetsFetcher: r, imagesConfig: a }) {
  let n = pe(e, a);
  if (!n) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: o, imageUrl: s } = n, d = await (o && s.pathname in t ? r.fetch.bind(r) : fetch)(s);
  return _e(d, s, a);
}
__name(z, "z");
__name2(z, "z");
c();
h();
u();
c();
h();
u();
c();
h();
u();
async function j(e) {
  return import(e);
}
__name(j, "j");
__name2(j, "j");
var me = "x-vercel-cache-tags";
var xe = "x-next-cache-soft-tags";
var ye = /* @__PURE__ */ Symbol.for("__cloudflare-request-context__");
async function J(e) {
  let t = `https://${b}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let r = new URL(e.url), a = await fe();
    if (r.pathname === "/v1/suspense-cache/revalidate") {
      let o = r.searchParams.get("tags")?.split(",") ?? [];
      for (let s of o) await a.revalidateTag(s);
      return new Response(null, { status: 200 });
    }
    let n = r.pathname.replace("/v1/suspense-cache/", "");
    if (!n.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let o = W(e, xe), s = await a.get(n, { softTags: o });
        return s ? new Response(JSON.stringify(s.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (s.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let o = globalThis[ye], s = /* @__PURE__ */ __name2(async () => {
          let i = await e.json();
          i.data.tags === void 0 && (i.tags ??= W(e, me) ?? []), await a.set(n, i);
        }, "s");
        return o ? o.ctx.waitUntil(s()) : await s(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (r) {
    return console.error(r), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
__name2(J, "J");
async function fe() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? K("kv") : K("cache-api");
}
__name(fe, "fe");
__name2(fe, "fe");
async function K(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, r = await j(t);
  return new r.default();
}
__name(K, "K");
__name2(K, "K");
function W(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(W, "W");
__name2(W, "W");
function Y() {
  globalThis[Z] || (ge(), globalThis[Z] = true);
}
__name(Y, "Y");
__name2(Y, "Y");
function ge() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let r = new Request(...t), a = await Ne(r);
    return a || (a = await J(r), a) ? a : (Re(r), e(r));
  };
}
__name(ge, "ge");
__name2(ge, "ge");
async function Ne(e) {
  if (e.url.startsWith("blob:")) try {
    let r = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, a = (await j(r)).default, n = { async arrayBuffer() {
      return a;
    }, get body() {
      return new ReadableStream({ start(o) {
        let s = Buffer.from(a);
        o.enqueue(s), o.close();
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
__name2(Ne, "Ne");
function Re(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(Re, "Re");
__name2(Re, "Re");
var Z = /* @__PURE__ */ Symbol.for("next-on-pages fetch patch");
c();
h();
u();
var Q = V(X());
var k = class {
  static {
    __name(this, "k");
  }
  static {
    __name2(this, "k");
  }
  constructor(t, r, a, n, o) {
    this.routes = t;
    this.output = r;
    this.reqCtx = a;
    this.url = new URL(a.request.url), this.cookies = (0, Q.parse)(a.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), g(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = o?.find((s) => s.domain === this.url.hostname), this.locales = new Set(n.collectedLocales);
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
  checkRouteMatch(t, { checkStatus: r, checkIntercept: a }) {
    let n = P(t.src, this.path, t.caseSensitive);
    if (!n.match || t.methods && !t.methods.map((s) => s.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let o = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((s) => {
      let i = I(s, o);
      return i.newRouteDest && (o.routeDest = i.newRouteDest), !i.valid;
    }) && !t.missing?.find((s) => I(s, o).valid) && !(r && t.status !== this.status)) {
      if (a && t.dest) {
        let s = /\/(\(\.+\))+/, i = s.test(t.dest), d = s.test(this.path);
        if (i && !d) return;
      }
      return { routeMatch: n, routeDest: o.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let r = "x-middleware-override-headers", a = t.headers.get(r);
    if (a) {
      let d = new Set(a.split(",").map((l) => l.trim()));
      for (let l of d.keys()) {
        let p = `x-middleware-request-${l}`, y = t.headers.get(p);
        this.reqCtx.request.headers.get(l) !== y && (y ? this.reqCtx.request.headers.set(l, y) : this.reqCtx.request.headers.delete(l)), t.headers.delete(p);
      }
      t.headers.delete(r);
    }
    let n = "x-middleware-rewrite", o = t.headers.get(n);
    if (o) {
      let d = new URL(o, this.url), l = this.url.hostname !== d.hostname;
      this.path = l ? `${d}` : d.pathname, g(this.searchParams, d.searchParams), t.headers.delete(n);
    }
    let s = "x-middleware-next";
    t.headers.get(s) ? t.headers.delete(s) : !o && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), f(this.reqCtx.request.headers, t.headers), f(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let r = t && this.output[t];
    if (!r || r.type !== "middleware") return this.status = 500, false;
    let a = await w(r, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), a.status === 500 ? (this.status = a.status, false) : (this.processMiddlewareResp(a), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, r, a) {
    !t.headers || (f(this.headers.normal, t.headers, { match: r, captureGroupKeys: a }), t.important && f(this.headers.important, t.headers, { match: r, captureGroupKeys: a }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, r, a) {
    if (!t.dest) return this.path;
    let n = this.path, o = t.dest;
    this.wildcardMatch && /\$wildcard/.test(o) && (o = o.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = T(o, r, a);
    let s = /\/index\.rsc$/i.test(this.path), i = /^\/(?:index)?$/i.test(n), d = /^\/__index\.prefetch\.rsc$/i.test(n);
    s && !i && !d && (this.path = n);
    let l = /\.rsc$/i.test(this.path), p = /\.prefetch\.rsc$/i.test(this.path), y = this.path in this.output;
    l && !p && !y && (this.path = this.path.replace(/\.rsc/i, ""));
    let R = new URL(this.path, this.url);
    return g(this.searchParams, R.searchParams), S(this.path) || (this.path = R.pathname), n;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: a, cookie: n } } = t, o = n && this.cookies[n], s = L(o ?? ""), i = L(this.reqCtx.request.headers.get("accept-language") ?? ""), p = [...s, ...i].map((y) => a[y]).filter(Boolean)[0];
    if (p) {
      !this.path.startsWith(p) && (this.headers.normal.set("location", p), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, r) {
    return !this.locales || r !== "miss" ? t : G(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, r) {
    let a = this.getLocaleFriendlyRoute(r, t), { routeMatch: n, routeDest: o } = this.checkRouteMatch(a, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, s = { ...a, dest: o };
    if (!n?.match || s.middlewarePath && this.middlewareInvoked.includes(s.middlewarePath)) return "skip";
    let { match: i, captureGroupKeys: d } = n;
    if (this.applyRouteOverrides(s), this.applyLocaleRedirects(s), !await this.runRouteMiddleware(s.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(s, i, d), this.applyRouteStatus(s);
    let p = this.applyRouteDest(s, i, d);
    if (s.check && !S(this.path)) if (p === this.path) {
      if (t !== "miss") return this.checkPhase(O(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !s.continue || s.status && s.status >= 300 && s.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let r = true;
    for (let o of this.routes[t]) {
      let s = await this.checkRoute(t, o);
      if (s === "error") return "error";
      if (s === "done") {
        r = false;
        break;
      }
    }
    if (t === "hit" || S(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let o of this.locales) {
      let s = new RegExp(`/${o}(/.*)`), d = this.path.match(s)?.[1];
      if (d && d in this.output) {
        this.path = d;
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
    return a || t === "miss" || t === "error" ? n = "hit" : r && (n = O(t)), this.checkPhase(n);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let r = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), r;
  }
};
async function ee(e, t, r, a) {
  let n = new k(t.routes, r, e, a, t.wildcard), o = await te(n);
  return Ce(e, o, r);
}
__name(ee, "ee");
__name2(ee, "ee");
async function te(e, t = "none", r = false) {
  return await e.run(t) === "error" || !r && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
__name2(te, "te");
async function Ce(e, { path: t = "/404", status: r, headers: a, searchParams: n, body: o }, s) {
  let i = a.normal.get("location");
  if (i) {
    if (i !== a.middlewareLocation) {
      let p = [...n.keys()].length ? `?${n.toString()}` : "";
      a.normal.set("location", `${i ?? "/"}${p}`);
    }
    return new Response(null, { status: r, headers: a.normal });
  }
  let d;
  if (o !== void 0) d = new Response(o, { status: r });
  else if (S(t)) {
    let p = new URL(t);
    g(p.searchParams, n), d = await fetch(p, e.request);
  } else d = await w(s[t], e, { path: t, status: r, headers: a, searchParams: n });
  let l = a.normal;
  return f(l, d.headers), f(l, a.important), d = new Response(d.body, { ...d, status: r || d.status, headers: l }), d;
}
__name(Ce, "Ce");
__name2(Ce, "Ce");
c();
h();
u();
function ae() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: ke };
}
__name(ae, "ae");
__name2(ae, "ae");
function ke(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let r = Ee();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, r), r;
}
__name(ke, "ke");
__name2(ke, "ke");
function Ee() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name2((t, r) => e.has(r) ? e.get(r) : Reflect.get(globalThis, r), "get"), set: /* @__PURE__ */ __name2((t, r, a) => Me.has(r) ? Reflect.set(globalThis, r, a) : (e.set(r, a), true), "set") });
}
__name(Ee, "Ee");
__name2(Ee, "Ee");
var Me = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ie = Object.defineProperty;
var Ae = /* @__PURE__ */ __name2((...e) => {
  let t = e[0], r = e[1], a = "__import_unsupported";
  if (!(r === a && typeof t == "object" && t !== null && a in t)) return Ie(...e);
}, "Ae");
globalThis.Object.defineProperty = Ae;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name2(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name2(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var va = { async fetch(e, t, r) {
  ae(), Y();
  let a = await __ALSes_PROMISE__;
  if (!a) {
    let s = new URL(e.url), i = await t.ASSETS.fetch(`${s.protocol}//${s.host}/cdn-cgi/errors/no-nodejs_compat.html`), d = i.ok ? i.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(d, { status: 503 });
  }
  let { envAsyncLocalStorage: n, requestContextAsyncLocalStorage: o } = a;
  return n.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: b }, async () => o.run({ env: t, ctx: r, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return z(e, { buildOutput: m, assetsFetcher: t.ASSETS, imagesConfig: _.images });
    let i = B(e);
    return ee({ request: i, ctx: r, assetsFetcher: t.ASSETS }, _, m, x);
  }));
} };

// node_modules/wrangler/templates/pages-dev-util.ts
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-iOPFd0/8jv1togs4ai.js
var define_ROUTES_default = { version: 1, include: ["/*"], exclude: [] };
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = va;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-RVbr6p/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_dev_pipeline_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-RVbr6p/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=8jv1togs4ai.js.map
